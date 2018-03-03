import React from 'react'
import { findDOMNode } from 'react-dom'
import modal from '../lib/modal'
import $ from 'jquery'
class Content extends React.Component {
  toClick () {
    console.log(this)
    alert('xxx')
  }
  render () {
    return (
      <div>
        Content Component
        <button onClick={this.toClick.bind(this)}>点我</button>
      </div>
    )
  }
}
export default class extends React.Component {
  constructor () {
    super()
    this.modal = new modal({
      title: '修改文字',
      content: '333',
      // maskClosable: false,
      // header: '<button>xxx</button>',
      // footer: '<button>xxx</button>',
      // footer: null,
      onOk: () => {
        this.modal3.show()
        // console.log(this)
      },
      onCancel () {
        console.log('cancel')
      }
    })
    this.modal2 = new modal({
      title: 'xxx',
      mask: false
    })
    this.modal3 = new modal({
      title: 'xxx',
      // mask: false,
      className: 'abc cde',
      style: {width: '200px'}
    })
    // this.modal.show()
    // this.modal2.show()
    // this.modal3.show()
  }
  toClick () {
    this.modal.show()
    // this.modal2.show()
  }
  toClose () {
    this.modal.hide()
  }
  render () {
    return (
      <div>
        <button onClick={this.toClick.bind(this)}>打开</button>
        <button
          onClick={this.toClick.bind(this)}
          style={{
            position: 'absolute',
            right: 0
          }}
        >
          打开1
        </button>
        <button
          onClick={this.toClick.bind(this)}
          style={{
            position: 'absolute',
            right: '50%',
            top: '0'
          }}
        >
          打开
        </button>
        <button
          onClick={this.toClick.bind(this)}
          style={{
            position: 'absolute',
            right: '50%',
            top: '500px'
          }}
        >
          打开
        </button>
        <button onClick={this.toClose.bind(this)}>关闭</button>
      </div>
    )
  }
}
