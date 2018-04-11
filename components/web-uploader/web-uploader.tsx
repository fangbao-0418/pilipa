import classNames from 'classnames'
import $ from 'jquery'
import React from 'react'
import events from '../decorations/events'
import modal from '../modal'
import notification from '../notification'
import bus from './bus'
import Item from './item'
export interface ProgressEvent {
  target: {
    result: string
  }
}
export interface Props {
  accept?: string
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
  bucket: string
  region: string
  dir: string
  maxUploadNum?: number
  uploadTarget?: string
  mark?: string
  callBack?: {}
}
export interface States {
  initShow: boolean
  files: File[]
  uploadStatus: string
  percentage: number
  successNo: number
  failedNo: number
  newNo: number, // 新增数
  sumSize: string
}
export type UploadStatus = 'start' | 'pause' | 'continue' | 'finish'
@events()
class WebUploader extends React.Component <Props, States> {
  public static id = new Date().getTime()
  public on: <T>(event: string, cb: (payload: T) => void) => void
  public trigger: <T>(event: string, payload: T) => void
  public off: (event: string) => void
  public files: File[] = []
  public percentages: number[] = [0]
  public uploadedUrls: string[] = []
  public uploadedInfo: Array<'success' | 'failed'> = []
  public m: any
  public defaultAccpet: string = 'jpeg,png,gif'
  public allUploadStatus: any = {
    start: '开始上传',
    pause: '暂停上传',
    continue: '继续上传',
    finish: '上传完成'
  }
  public maxUploadNum: number = this.props.maxUploadNum || 3
  public uploadTarget = this.props.uploadTarget || '图片'
  public state = {
    initShow: this.files.length === 0,
    files: this.files,
    uploadStatus: 'start',
    percentage: 0,
    successNo: 0,
    failedNo: 0,
    newNo: 0,
    sumSize: 'OKb'
  }
  public componentWillMount () {
    if (!FileReader) {
      alert('当前浏览器不支持FileReader,请选择高版本浏览器！')
    }
    bus.on('end-upload', this.onEndUpload.bind(this))
    bus.on('percentage', this.onPercentage.bind(this))
  }
  public componentDidMount () {
    this.handleDrop()
  }
  public componentWillUnmount () {
    console.log('willmount')
    this.resetData()
  }
  public handleDrop () {
    const $dropArea = $(this.refs['drop-area'])
    document.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    document.addEventListener('dragenter', (event: any) => {
      console.log($dropArea.parent().find(event.target).length)
      if ($dropArea.parent().find(event.target).length) {
        $dropArea.css({
          border: '2px rgba(0, 0, 0, .8) dashed'
        })
      }
    })
    document.addEventListener('dragleave', (event: any) => {
      if (!$dropArea.parent().find(event.target).length) {
        $dropArea.css({
          border: ''
        })
      }
    })
    document.addEventListener('drop', (event: any) => {
      $dropArea.css({
        border: ''
      })
      event.preventDefault()
      for (const item of event.dataTransfer.files) {
        this.files.push(item)
      }
      this.filterRepeatFile()
    })
  }
  // 手动添加文件
  public toAddFile () {
    const file: any = $(this.refs.file)
    file.attr('multiple', 'multiple')
    file.off('change').on('change', () => {
      const files = file[0].files
      for (const item of files) {
        if (item) {
          this.files.push(item)
        }
      }
      this.filterRepeatFile()
      file[0].value = ''
    })
    file.trigger('click')
  }
  public toVerify () {
    if (this.files.length > this.maxUploadNum) {
      // notification.warning({
      //   message: `上传文件数目超过${this.maxUploadNum}张，可能会存在卡顿！`
      // })
      // this.files.splice(this.maxUploadNum)
    }
  }
  // 过滤文件
  public filterRepeatFile () {
    const accept = this.props.accept || this.defaultAccpet
    const allowTypes = ('image/' + accept.replace(/[,|]/g, ',image/')).split(',')
    const temp: any = {}
    const files: File[] = []
    const filterFiles: string[] = []
    this.files.map((item, index) => {
      // 过滤重复文件
      if (
          temp[item.name] && temp[item.name].size === item.size
          && temp[item.name].type === item.type
          // && temp[item.name].lastModified === item.lastModified
      ) {
      } else {
        temp[item.name] = item
        // 过滤不允许的文件类型
        if (allowTypes.indexOf(item.type) > -1) {
          files.push(item)
        } else {
          filterFiles.push(item.name)
        }
      }
    })
    if (filterFiles.length > 0) {
      notification.warning({
        message: `${filterFiles.join('、')}等文件格式不符，已被过滤掉！`
      })
    }
    this.files = files
    this.toVerify()
    this.setState({
      files: this.files,
      initShow: this.files.length === 0
    })
    this.reckonNewNo()
    this.reckonFilesSize()
    this.reckonPercentage()
  }
  public createPreview () {
    if (this.files.length) {
      this.setState({
        initShow: false
      })
    }
  }
  public initShowView () {
    return (
      <div className='pilipa-web-uploader-constructor'>
        <div className='pilipa-web-uploader-btn' onClick={this.toAddFile.bind(this)}>
          点击选择{this.uploadTarget}
        </div>
        <p className=''>
          或将{this.uploadTarget}拖到这里，
          {/* 单次推荐最多选{this.maxUploadNum}张， */}
          仅支持jpg、png、gif类型的文件
        </p>
      </div>
    )
  }
  public removeImage (index: number) {
    this.files.splice(index, 1)
    this.uploadedInfo.splice(index, 1)
    this.percentages.splice(index, 1)
    this.setState({
      files: this.files,
      initShow: this.files.length === 0
    })
    this.reckonFilesNo()
    this.reckonPercentage()
    this.reckonFilesSize()
  }
  public imageListView () {
    return (
      <div className='pilipa-web-uploader-images'>
        <ul>
          {
            this.state.files.map((file, index) => {
              return (
                <Item
                  key={`pilipa-web-uploader-image-${file.name}-${file.size}`}
                  accessKeyId={this.props.accessKeyId}
                  accessKeySecret={this.props.accessKeySecret}
                  stsToken={this.props.stsToken}
                  bucket={this.props.bucket}
                  region={this.props.region}
                  dir={this.props.dir}
                  index={index}
                  file={file}
                  removeImg={this.removeImage.bind(this, index)}
                  callBack={this.props.callBack}
                />
              )
            })
          }
        </ul>
      </div>
    )
  }
  // 处理上传
  public handleUpload () {
    bus.trigger('handle-upload', this.state.uploadStatus)
    let status = 'start'
    switch (this.state.uploadStatus) {
    case 'start':
      status = 'pause'
      break
    case 'pause':
      status = 'continue'
      break
    case 'continue':
      status = 'pause'
      break
    case 'finish':
      status = 'finish'
      this.uploadSuccess()
      break
    }
    this.setState({
      newNo: status === 'finish' ? this.state.newNo : 0,
      uploadStatus: status
    })
  }
  // 监听上传进度
  public onPercentage (item: {index: number, percentage: number}) {
    this.percentages[item.index] = item.percentage
    this.reckonPercentage()
  }
  // 计算总体进度
  public reckonPercentage () {
    let sum = 0
    this.percentages.map((v) => {
      sum += v
    })
    this.setState({
      percentage: Math.round((sum / this.files.length) * 100) || 0
    })
  }
  // 计算新增的文件数目
  public reckonNewNo () {
    const { successNo, failedNo } = this.state
    const sum = this.files.length
    const newNo = sum - successNo - failedNo
    let uploadStatus = 'start'
    if (this.state.uploadStatus === 'start') {
      uploadStatus = 'start'
    } else {
      uploadStatus = newNo > 0 ? 'continue' : this.state.uploadStatus
    }
    this.setState({
      newNo,
      uploadStatus
    })
  }
  // 计算成功失败的文件数目
  public reckonFilesNo () {
    let successNo = 0
    let uploadStatus = 'finish'
    this.uploadedInfo.map((v) => {
      if(v === 'success') {
        successNo += 1
      }
    })
    const failedNo = this.uploadedInfo.length - successNo
    this.setState({
      successNo,
      failedNo
    })
    if (this.uploadedInfo.length === this.files.length && this.state.uploadStatus !== 'start') {
      if (this.files.length === 0) {
        uploadStatus = 'start'
      } else if (successNo !== this.files.length && this.files.length > 0) {
        uploadStatus = 'continue'
      }
      this.setState({
        uploadStatus
      })
    }
  }
  // 监听上传结束
  public onEndUpload (item: {index: number, status: 'success' | 'failed', url: string}) {
    this.uploadedInfo[item.index] = item.status
    this.uploadedUrls[item.index] = item.url
    this.reckonFilesNo()
  }
  public uploadSuccess () {
    const urls: string[] = []
    this.uploadedUrls.map((url) => {
      if (url) {
        urls.push(url)
      }
    })
    this.resetData()
    bus.trigger('complete', urls)
  }
  public resetData () {
    this.files = []
    this.uploadedInfo = []
    this.uploadedUrls = []
    this.percentages = []
    this.setState({
      initShow: true,
      uploadStatus: 'start',
      files: [],
      successNo: 0,
      failedNo: 0,
      newNo: 0,
      percentage: 0,
      sumSize: 'OKb'
    })
  }
  // 忽略未上传的
  public toIgnore () {
    this.setState({
      uploadStatus: 'finish'
    })
  }
  public reckonFilesSize () {
    let size = 0
    let sumSize = '0Kb'
    for (const item of this.files) {
      if (item) {
        size += item.size
      }
    }
    if (size < 1024 * 1000) {
      sumSize = this.toFix(size / 1024) + 'Kb'
    } else if (size < 1024 * 1024 * 1000) {
      sumSize = this.toFix(size / 1024 / 1024) + 'Mb'
    } else {
      sumSize = this.toFix(size / 1024 / 1024 / 1024) + 'Gb'
    }
    this.setState({
      sumSize
    })
  }
  public toFix (num: number, decimals: number = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  public toClose () {
    $(`.pilia-web-uploader-menu-${WebUploader.id}`).remove()
    this.resetData()
    bus.trigger('close')
  }
  public toFold () {
    bus.trigger('fold')
    $(`.pilia-web-uploader-menu-${WebUploader.id}`).remove()
    const $uploader = $(this.refs.uploader)
    const $wrap = $uploader.parents('.pilipa-modal-wrap')
    $wrap.removeClass('pilipa-web-uploader-unfold pilipa-web-uploader-active')
    $wrap.addClass('pilipa-web-uploader-fold pilipa-web-uploader-active')
    $('body').append(`
      <div class='pilia-web-uploader-menu pilia-web-uploader-menu-${WebUploader.id}'>
        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        ${this.uploadTarget}上传
      </div>`
    )
    const $menu = $(`.pilia-web-uploader-menu-${WebUploader.id}`)
    setTimeout(() => {
      $menu.addClass('pilipa-web-uploader-menu-unfold pilipa-web-uploader-menu-active')
    }, 300)
    $menu.click(() => {
      bus.trigger('unfold')
      $menu.removeClass('pilipa-web-uploader-menu-unfold pilipa-web-uploader-menu-active')
      $menu.addClass('pilipa-web-uploader-menu-fold pilipa-web-uploader-menu-active')
      setTimeout(() => {
        $wrap.addClass('pilipa-web-uploader-unfold pilipa-web-uploader-active')
      }, 300)
    })
  }
  public render () {
    return (
      <div className='pilipa-web-uploader' ref='uploader'>
        <div className='pilipa-web-uploader-header'>
          <span>{this.uploadTarget}上传</span>
          <div className='pilipa-web-uploader-shrink' onClick={this.toFold.bind(this)}>
            <i className='fa fa-angle-double-right' aria-hidden='true'></i>
          </div>
          <div className='pilipa-web-uploader-close' onClick={this.toClose.bind(this)}>
            <i>×</i>
          </div>
        </div>
        <div className='pilipa-web-uploader-body'>
          <p className='pilipa-web-uploader-mark'>{this.props.mark}</p>
          <div
            className={classNames([
              'pilipa-web-uploader-drop-area',
              {
                'pilipa-web-uploader-border-white': !this.state.initShow
              }
            ])}
            ref='drop-area'
          >
            {
              // 初始显示的view
              this.state.initShow ? this.initShowView() : this.imageListView()
            }
          </div>
        </div>
        {
          this.state.files.length > 0 &&
          <div className='pilipa-web-uploader-footer'>
            {
               this.state.uploadStatus === 'start' &&
               <div className='pilipa-web-uploader-info'>
                <p>共<b>{this.state.files.length}</b>张 ({this.state.sumSize})</p>
               </div>
            }
            {
              this.state.uploadStatus !== 'start' &&
              <div className='pilipa-web-uploader-info'>
                <div className='pilipa-web-uploader-percentage'>
                  <span>{this.state.percentage}%</span>
                  <div
                    className='pilipa-web-uploader-percentage-solid'
                    style={{width: `${this.state.percentage}%`}}
                  >
                  </div>
                </div>
                <p style={{marginLeft: '15px'}}>
                  共<b>{this.state.files.length}</b>张 ({this.state.sumSize}),
                  成功<b style={{color: '#52c41a'}}>{this.state.successNo}</b>张,
                  失败<b style={{color: '#cf1322'}}>{this.state.failedNo}</b>张,
                  新增<b style={{color: '#0050b3'}}>
                    {this.state.newNo}
                  </b>张
                </p>
                {
                  this.state.newNo === 0 && this.state.uploadStatus !== 'finish' &&
                  <p style={{marginLeft: '15px'}}>
                    上传失败请点击
                    <span className='clickabled' onClick={this.handleUpload.bind(this)}>继续上传</span>
                    或
                    <span className='clickabled' onClick={this.toIgnore.bind(this)}>忽略</span>
                  </p>
                }
              </div>
            }
            <div className='pilipa-web-uploader-operate'>
              <div className='pilipa-web-uploader-operate'>
                <div
                  onClick={this.toAddFile.bind(this)}
                  className='pilipa-web-uploader-btn-default mr-10'
                >
                  继续添加
                </div>
                <div
                  className='pilipa-web-uploader-btn-primary'
                  onClick={this.handleUpload.bind(this)}
                >
                  {this.allUploadStatus[this.state.uploadStatus]}
                </div>
              </div>
            </div>
          </div>
        }
        <input type='file' ref='file' style={{display: 'none'}} />
      </div>
    )
  }
}
export default WebUploader
