import $ from 'jquery'
import React from 'react'
import { webUploader } from '../components'
/* tslint:disable:max-line-length quotemark */
const ossCfg: any = JSON.parse('{"credentials":{"securityToken":"CAIS1QJ1q6Ft5B2yfSjIr4vsDIjdnZVQ1vqpYUDhrm0NZ8xqqPH5qTz2IH5Je3NgBOgdtfo+m2xX6P8alrhrSptEXUXzNJYtt8oHr1z5MtIAPANiEflW5qe+EE2/VjQGta27OpceJbGwU/OpbE++2U0X6LDmdDKkckW4OJmS8/BOZcgWWQ/KClgjA8xNdDN/tOgQN3baKYyYUHjQj3HXEVBjtydllGp78t7f+MCH7QfEh1CI441Cro/qcJ+/dJsubtUtS9ax3fR/M6/Flydf5h5Wr+ArhqUcpjqb59qUXwlfuU3ea7OI+4RhIV8+PPBjSusc9r++t4Uh4bGMxt+pkkkSZr4PCniAfu36npuYQtHOH80iaLP2N07K1t2yLZTvu2smGylFaVwQK4d5cSQuWENwFW+DcrXW/0vRJx+iT6md2eQz1d970lHsuNOBLFWUWKUCDqXLwBbgBRqAATgGBVk0XhvYFp7JGN+5xiIl/9OfqofLZX4QwlQ0IVekqy7ZKuF447qhX0D84N7D67ixmOMUzJYJ4QOFHUGK1jZW9ImHnud7Gi69FWp2gWrw4hWdRkXY48xmTYh/gUsm+B7DySjg235SeXocFy30egH3wPMJVEp4rGuNwzPmvzU9","accessKeySecret":"33gwmJe7qV8cDxxnsr9j2TK2a2GVwSzZrGWe1fPuwQpf","accessKeyId":"STS.NHYG2ipJqa8BcfPJmXkCFG4RK","expiration":"2019-03-04T08:55:09Z"},"endpoint":"oss-cn-beijing.aliyuncs.com","bucket":"pilipa-ml","roleSessionName":"pilipa_1551686709","pathPrefix":"agent3/5ba07e41ca48f200014a1fe8/2019-02"}')
console.log(ossCfg)
const newOssCfg = JSON.parse('{"credentials":{"securityToken":"CAIS1QJ1q6Ft5B2yfSjIr4vsDIjdnZVQ1vqpYUDhrm0NZ8xqqPH5qTz2IH5Je3NgBOgdtfo+m2xX6P8alrhrSptEXUXzNJYtt8oHr1z5MtIAPANiEflW5qe+EE2/VjQGta27OpceJbGwU/OpbE++2U0X6LDmdDKkckW4OJmS8/BOZcgWWQ/KClgjA8xNdDN/tOgQN3baKYyYUHjQj3HXEVBjtydllGp78t7f+MCH7QfEh1CI441Cro/qcJ+/dJsubtUtS9ax3fR/M6/Flydf5h5Wr+ArhqUcpjqb59qUXwlfuU3ea7OI+4RhIV8+PPBjSusc9r++t4Uh4bGMxt+pkkkSZr4PCniAfu36npuYQtHOH80iaLP2N07K1t2yLZTvu2smGylFaVwQK4d5cSQuWENwFW+DcrXW/0vRJx+iT6md2eQz1d970lHsuNOBLFWUWKUCDqXLwBbgBRqAATgGBVk0XhvYFp7JGN+5xiIl/9OfqofLZX4QwlQ0IVekqy7ZKuF447qhX0D84N7D67ixmOMUzJYJ4QOFHUGK1jZW9ImHnud7Gi69FWp2gWrw4hWdRkXY48xmTYh/gUsm+B7DySjg235SeXocFy30egH3wPMJVEp4rGuNwzPmvzU9","accessKeySecret":"33gwmJe7qV8cDxxnsr9j2TK2a2GVwSzZrGWe1fPuwQpf","accessKeyId":"STS.NHYG2ipJqa8BcfPJmXkCFG4RK","expiration":"2019-03-04T08:55:09Z"},"endpoint":"oss-cn-beijing.aliyuncs.com","bucket":"pilipa-ml","roleSessionName":"pilipa_1551686709","pathPrefix":"agent3/5ba07e41ca48f200014a1fe8/2019-02"}')

export default class extends React.Component {
  public componentDidMount () {
    const uploader = new webUploader({
      accessKeyId: ossCfg.credentials.accessKeyId,
      accessKeySecret: ossCfg.credentials.accessKeySecret,
      stsToken: ossCfg.credentials.securityToken,
      bucket: ossCfg.bucket,
      region: 'oss-cn-beijing',
      dir: ossCfg.pathPrefix,
      accept: ossCfg.accept,
      uploadTarget: '票据',
      maskClosable: true,
      // maxUploadNum: 19,
      mark: '西藏山峰广告装饰有限公司',
      beforeUpdate: (item: any) => {
        console.log(item)
        return $.ajax({
          url: '/api/note/duplicates-checking',
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(item)
        })
      },
      callback: {
        url: "https://x-agent3.i-counting.cn/incoming/callback/oss",
        host: "x-agent3.i-counting.cn",
        body: 'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}' +
        '&width=${imageInfo.width}&receiptid=0&typeid=1&' +
        `&self=0&companycode=4533&relateDate=2018-08&version=3` +
        `&userid=ceshiid&nickname=ceshi&agency=agency1` +
        '&originalfile=${file.name}',
        contentType: 'application/x-www-form-urlencoded'
        // contentType: "application/json"
        // body: "filename=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}&receiptid=${x:receiptid}&typeid=${x:typeid}&companyid=${x:companyid}&userid=${x:userid}&self=${x:self}&companycode=${x:companycode}",
        // customValue: {
        //   receiptid: "0",
        //   typeid: "1",
        //   companyid: "7048",
        //   userid: "665",
        //   self: "0",
        //   companycode: "5a93be1a85effd0001e7f7d0"
        // }
      }
    })
    uploader.on('error', () => {
      // uploader.trigger('oss-update', {
      //   accessKeyId: newOssCfg.AccessKeyId,
      //   accessKeySecret: newOssCfg.AccessKeySecret,
      //   stsToken: newOssCfg.SecurityToken,
      //   bucket: newOssCfg.bucketName,
      //   region: 'oss-beijing',
      //   dir: newOssCfg.dir
      // })
    })
    uploader.on('complete', (urls) => {
      console.log(urls, '上传成功')
    })
    uploader.on('close', (urls) => {
      uploader.destroy()
    })
  }
  public render () {
    return (
      <div>xxx</div>
    )
  }
}
