import { CheckPoint, Client, ConfigProps, Wrapper as OSS } from 'ali-oss'
import classNames from 'classnames'
import $ from 'jquery'
import React from 'react'
import Viewer from 'viewerjs'
import { md5 } from '../_util'
import bus from './bus'
export interface Props {
  file: File
  index: number
  removeImg?: (index: number, status: string) => void
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
  bucket: string
  region: string
  dir: string
  callBack?: any
  isRepeat: boolean
}
export interface States {
  src: string
  percentage: number
  uploadStatus: string
  uploading: boolean
}
export interface ClientPromise {
  then: (cb: (res: any) => void) => this
  catch: (cb: (e: any) => void) => this
  finally: (cb: (res: any, e: any) => void) => this
}
export interface P extends ConfigProps {
  dir: string
}
export type UploadStatus = 'start' | 'pause' | 'continue'
export default class extends React.Component <Props, States> {
  public deg = 0
  public state = {
    src: '',
    percentage: 0,
    uploadStatus: 'unknow',
    uploading: false
  }
  public tempCheckpoint: CheckPoint = null
  public ossOpts: ConfigProps = {
    accessKeyId: this.props.accessKeyId,
    accessKeySecret: this.props.accessKeySecret,
    stsToken: this.props.stsToken,
    bucket: this.props.bucket,
    region: this.props.region
  }
  public store: Client[] = []
  public storeId: number = 0
  public name = ''
  public uploadId = ''
  public dir = ''
  public viewer: Viewer
  public isDestroy: boolean = false
  public callback: any
  public success: boolean = false
  public completeMultipartUpload: any
  public maxIndex = 0
  public componentWillMount () {
    this.readFile()
    this.handleCallBack()
    this.dir = this.props.dir
    bus.on<{status: UploadStatus, maxIndex: number, next?: boolean}>('handle-upload', (payload) => {
      const { status, maxIndex, next } = payload
      this.maxIndex = maxIndex
      const isRepeat = this.props.isRepeat === undefined ? true : this.props.isRepeat
      if (this.isDestroy || this.success) {
        return
      }
      this.initStatus(() => {
        if (isRepeat) {
          bus.trigger('end-upload', {
            index: this.props.index,
            status: 'failed'
          })
          return
        }
        setTimeout(() => {
          this.handleUpload(status, maxIndex, next)
        }, 0)
      })
    })
    bus.on('oss-update', this.updateOssOpts.bind(this))
    this.createFileName()
  }
  public componentDidMount () {
    const $el = $(this.refs.item)
    const img = $(this.refs.img)
    if (!this.viewer) {
      this.viewer = new Viewer($(img)[0], {
      })
    }
  }
  public componentWillUnmount () {
    this.isDestroy = true
    if (this.viewer) {
      this.viewer.destroy()
    }
  }
  public handleCallBack () {
    const callback = this.props.callBack
    if (!callback) {
      return
    }
    if (typeof callback === 'object' && typeof callback.body === 'string' && typeof this.props.file === 'object') {
      const file: any = this.props.file
      const body = callback.body.replace(/\${(file)(\.(\w+))?}/g, ($0: string, $1: string, $2: string, $3: string) => {
        console.log($3, '$3')
        if ($3) {
          return file[$3]
        }
        return $0
      })
      this.callback = Object.assign({}, callback, {body})
    }
  }
  public initStatus (cb?: () => void) {
    if (['success'].indexOf(this.state.uploadStatus) > -1) {
      return
    }
    this.setState({
      uploadStatus: 'unknow'
    }, () => {
      if (cb) {
        cb()
      }
    })
  }
  public updateOssOpts (options?: P) {
    if (this.isDestroy || this.success) {
      return
    }
    this.dir = options.dir
    delete options.dir
    this.ossOpts = options
  }
  public createFileName () {
    const pattern = 'ABCDEFGHIJKLMNOPQRESUVWXYZabcdefghijklmnopqresuvwxyz1234567890'
    let i = 0
    let random
    let str = ''
    const suffix = this.props.file.type.replace('image/', '').replace('jpeg', 'jpg')
    while (i < 10) {
      random = Math.floor(Math.random()*62)
      str += pattern.charAt(random)
      i++
    }
    const nowTime = new Date().getTime().toString()
    str = md5([this.props.file.name, nowTime, str].join('||'))
    this.name = '/' + this.dir + '/' + str.toUpperCase() + '.' + suffix
  }
  public readFile () {
    const reader: FileReader = new FileReader()
    reader.readAsBinaryString(this.props.file)
    reader.onload = (e: any) => {
      const result = e.target.result
      const hash = md5(result, 32).toUpperCase()
      bus.trigger('file-readed', {
        index: this.props.index,
        name: this.props.file.name,
        hash
      })
    }
    this.setState({
      src: window.URL.createObjectURL(this.props.file)
    })
  }
  public fileUpload () {
    if (this.success) {
      return
    }
    this.store[this.storeId].multipartUpload<{
      parallel: number
      partSize: number
      progress: (percentage: number, checkpoint: CheckPoint) => void,
      checkpoint?: CheckPoint
      callback?: any,
      timeout: number
    }, ClientPromise>(this.name, this.props.file, {
      parallel: 2,
      partSize: 500 * 1024,
      progress: async (percentage, checkpoint) => {
        percentage = percentage > 1 ? 1 : percentage
        this.setState({
          percentage
        })
        bus.trigger<{index: number, percentage: number}>('percentage', {
          index: this.props.index,
          percentage
        })
        if (checkpoint) {
          // if (percentage === 1 && !this.success && checkpoint.uploadId && !this.completeMultipartUpload) {
          //   this.completeMultipartUpload = true
          //   this.store[this.storeId]
          //   .completeMultipartUpload<any>(this.name, checkpoint.uploadId, checkpoint.doneParts)
          //   .then((res: any) => {
          //     this.handleUploadSuccess(res)
          //     return res
          //   })
          //   .catch((err: any) => {
          //     this.handleUploadError(err)
          //   })
          // }
          this.tempCheckpoint = checkpoint
          this.uploadId = checkpoint.uploadId
        }
      },
      checkpoint: this.tempCheckpoint,
      callback: this.callback,
      timeout: 15 * 60 * 1000
    }).then((res) => {
      this.handleUploadSuccess(res)
    }).catch((err) => {
      this.handleUploadError(err)
    }).finally(() => {
      // console.log('finally')
    })
  }
  public handleUploadSuccess (res: any) {
    this.tempCheckpoint = null
    // console.log(res, this.props.index, 'success')
    if (this.isDestroy) {
      return
    }
    this.success = true
    this.setState({
      uploadStatus: 'success',
      uploading: false
    })
    bus.trigger<{index: number, percentage: number}>('percentage', {
      index: this.props.index,
      percentage: 1
    })
    bus.trigger('end-upload', {
      index: this.props.index,
      status: 'success',
      url: res.res.requestUrls[0]
    })
  }
  public handleUploadError (err: any) {
    console.log(err.code)
    // console.log(err, 'error')
    if (this.success || this.isDestroy) {
      return
    }
    this.setState({
      uploading: false
    })
    if (typeof err === 'object' && err.name === 'cancel') {
      this.setState({
        uploadStatus: 'pause'
      })
    } else {
      switch (err.status) {
      case 403:
        if (this.success || this.isDestroy) {
          return
        }
        this.setState({
          uploadStatus: 'failed'
        })
        bus.trigger('error', err)
        bus.trigger('end-upload', {
          index: this.props.index,
          status: 'failed'
        })
        break
      default:
        // ali-oss 5.1.1 修复上传bug 此处验证文件代码屏蔽掉
        this.store[this.storeId].get<any>(this.name).then((res: any) => {
          this.handleUploadSuccess(res)
        }).catch((err2: any) => {
          if (this.success || this.isDestroy) {
            return
          }
          if (err2.code === 403) {
            bus.trigger('error', err2)
          }
          this.setState({
            uploadStatus: 'failed'
          })
          bus.trigger('end-upload', {
            index: this.props.index,
            status: 'failed'
          })
        })
        break
      }
    }
  }
  public setOss () {
    if (this.props.index > this.maxIndex) {
      return
    }
    this.storeId += 1
    const { accessKeyId, accessKeySecret, stsToken, bucket, region } = this.ossOpts
    this.store[this.storeId] = OSS({
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket,
      region
    })
  }
  public handleUpload (status: UploadStatus, maxIndex?: number, next?: boolean) {
    const { uploadStatus } = this.state
    console.log(maxIndex, 'handleUpload')
    if (this.props.index >= maxIndex) {
      if (status === 'pause') {
        this.setState({
          uploadStatus: 'pause',
          uploading: false
        })
      }
      return
    } else {
      if (this.state.uploading) {
        return
      }
    }
    if (this.success || (uploadStatus === 'failed' && next)) {
      return
    }
    switch (status) {
    case 'start':
      this.setOss()
      this.setState({
        uploading: true
      })
      this.fileUpload()
      break
    case 'pause':
      this.setState({
        uploadStatus: 'pause',
        uploading: false
      })
      if (this.store[this.storeId]) {
        this.store[this.storeId].cancel()
      }
      break
    case 'continue':
      this.setState({
        uploading: true
      })
      this.setOss()
      this.fileUpload()
      break
    }
  }
  public handleOpearte (type: 'rotate-left' | 'rotate-right' | 'zoom-in' | 'delete') {
    const $img = $(this.refs.img)
    switch (type) {
    case 'rotate-left':
      this.deg -= 90
      $img.css({
        transform: `rotate(${this.deg}deg)`
      })
      break
    case 'rotate-right':
      this.deg += 90
      $img.css({
        transform: `rotate(${this.deg}deg)`
      })
      break
    case 'zoom-in':
      this.viewer.show()
      break
    case 'delete':
      if (this.props.removeImg) {
        this.removeFile()
        this.props.removeImg(this.props.index, this.state.uploadStatus)
      }
      break
    }
  }
  public removeFile () {
    const status = this.state.uploadStatus
    console.log(this.store[this.storeId], 'store')
    switch (status) {
    case 'success':
      // this.store.delete(this.name)
      break
    case 'failed':
      this.store[this.storeId].abortMultipartUpload(this.name, this.uploadId)
      break
    case 'pause':
      this.store[this.storeId].abortMultipartUpload(this.name, this.uploadId)
      break
    }
  }
  public render () {
    const { isRepeat } = this.props
    const { uploadStatus } = this.state
    return (
      <li ref='item'>
        {
          // 上传进度
          this.state.uploading &&
          <div className='pilipa-web-uploader-imgage-uploading'>
            <div className='pilipa-web-uploader-ring'></div>
            <span>{Math.round(this.state.percentage * 100)}%</span>
          </div>
        }
        {
          // 暂停
          this.state.uploadStatus === 'pause' &&
          <div className='pilipa-web-uploader-imgage-uploading'>
            <div className='pilipa-web-uploader-pause'>
              <i className='fa fa-pause-circle-o' aria-hidden='true'></i>
            </div>
          </div>
        }
        {
          // 失败 || 成功
          (isRepeat || ['success', 'failed'].indexOf(this.state.uploadStatus) > -1) &&
          <div
            className={
              classNames([
                'pilipa-web-uploader-image-upload-status',
                {
                  success: uploadStatus === 'success',
                  failed: uploadStatus !== 'success' && (isRepeat || uploadStatus === 'failed')
                }
              ])
            }
          >
            {uploadStatus === 'success' ? '上传成功' : (isRepeat ? '票据重复' : '上传失败')}
          </div>
        }
        <div className='pilipa-web-uploader-image-operate'>
          <i className='fa fa-undo' aria-hidden='true' onClick={this.handleOpearte.bind(this, 'rotate-left')}></i>
          <i className='fa fa-repeat' aria-hidden='true' onClick={this.handleOpearte.bind(this, 'rotate-right')}></i>
          <i
            className='fa fa-search-plus'
            aria-hidden='true'
            onClick={this.handleOpearte.bind(this, 'zoom-in')}
          >
          </i>
          {
            !this.success &&
            <i
              className='fa fa-trash-o'
              aria-hidden='true'
              onClick={this.handleOpearte.bind(this, 'delete')}
            >
            </i>
          }
        </div>
        <img
          src={this.state.src}
          ref='img'
          alt={this.props.file.name}
          style={{display: this.state.src ? 'initial' : 'none'}}
        />
      </li>
    )
  }
}
