import React from 'react'
import { render } from 'react-dom'
import $, { DomInstance } from '../dom'
export interface MyOptions {
  style?: string
  className?: string
  title?: string
  header?: any
  content?: any
  footer?: any
  onOk?: () => void
  onCancel?: () => void
  mask?: boolean
  maskClosable?: boolean
  cancelText?: string
  okText?: string
}
class Modal {
  public static maskClosable: boolean = true
  public static position: 'normal' | 'reverse' = 'normal'
  public static config (config: {
    maskClosable?: boolean,
    position?: 'normal' | 'reverse'
  }) {
    Modal.maskClosable = config.maskClosable !== undefined ? config.maskClosable : Modal.maskClosable
    Modal.position = config.position !== undefined ? config.position : Modal.position
  }
  public style: string
  public className: string
  public title: string = 'Modal'
  public okText = '确 定'
  public cancelText = '取 消'
  public header: any
  public content: any
  public footer: any
  public onOk: () => void
  public onCancel: () => void
  public mask: boolean = true
  public maskClosable: boolean = true
  public $el: DomInstance
  public defaultCls = 'pilipa-modal'
  public pageX: number
  public pageY: number = 0
  public constructor (options: MyOptions = {}) {
    this.$el = $('<div />')
    this.style = options.style
    this.className = options.className
    this.title = options.title || this.title
    this.cancelText = options.cancelText || this.cancelText
    this.okText = options.okText || this.okText
    this.header = options.header
    this.content = options.content
    this.footer = options.footer
    this.onOk = options.onOk
    this.onCancel = options.onCancel
    this.mask = options.mask !== undefined ? options.mask : this.mask
    this.maskClosable = options.maskClosable !== undefined ? options.maskClosable : Modal.maskClosable
    this.$el.addClass(this.defaultCls)
  }
  public destroy () {
    this.$el.remove()
  }
  public initEvent () {
    this.$el.find('.pilipa-modal-close').off('click').click(() => {
      if (this.onCancel) {
        this.onCancel()
      }
      this.hide()
    })
    if (this.footer === undefined) {
      this.$el.find('.pilipa-modal-footer button').off('click').click((event) => {
        const index = $(event.target).index()
        if (index === 1 && Modal.position === 'normal' || index === 0 && Modal.position === 'reverse') {
          this.hide()
          if (this.onCancel) {
            this.onCancel()
          }
        } else if (index === 0 && Modal.position === 'normal' || index === 1 && Modal.position === 'reverse') {
          if (this.onOk) {
            this.onOk()
          }
        }
      })
    }
    const $wrap = this.$el.find('.pilipa-modal-wrap')
    const $content = this.$el.find('.pilipa-modal-content')
    $wrap.off('click').on('click', (event) => {
      if ($content.find(event.target).length === 0 && this.maskClosable) {
        this.hide()
      }
    })
  }
  public setTransformOrigin () {
    const offset = this.$el.find('.pilipa-modal-content').offset()
    const w = this.$el.find('.pilipa-modal-content').width()
    const h = this.$el.find('.pilipa-modal-content').height()
    let x = 0
    if (offset.left + w/2 > this.pageX) {
      x = offset.left - this.pageX
    } else {
      x = -(this.pageX - offset.left)
    }
    const y = offset.top - this.pageY
    this.$el.find('.pilipa-modal-content').css({
      transformOrigin: `${-x}px ${-y}px 0px`
    })
  }
  public show () {
    $('body').css({
      overflow: 'hidden'
    })
    $('body').append(this.$el)
    this.$el.html(this.template())
    this.$el.find('.pilipa-modal-content').attr({
      style: this.style,
      class: ['pilipa-modal-content', this.className].join(' ')
    })
    if (!this.mask) {
      this.$el.find('.pilipa-modal-mask').css({
        'background-color': 'rgba(0,0,0,0)'
      })
    }
    this.setNode()
    this.setAnimation()
    this.initEvent()
  }
  public hide (cb?: () => void) {
    if ($('body').find(this.$el).length > 0) {
      this.$el.find('.pilipa-modal-mask').addClass('pilipa-fade-leave pilipa-fade-active')
      this.$el.find('.pilipa-modal-content').addClass('pilipa-zoom-leave pilipa-zoom-active')
      setTimeout(() => {
        this.$el.find('.pilipa-modal-mask').removeClass('pilipa-fade-leave pilipa-fade-active')
        this.$el.find('.pilipa-modal-content').removeClass('pilipa-zoom-leave pilipa-zoom-active')
        this.$el.remove()
        if ($('body').find('.pilipa-modal').length === 0) {
          $('body').css({
            overflow: ''
          })
        }
        if (cb) {
          cb()
        }
      }, 200)
    }
  }
  public setAnimation () {
    this.$el.find('.pilipa-modal-mask').addClass('pilipa-fade-enter pilipa-fade-active')
    this.$el.find('.pilipa-modal-content').addClass('pilipa-zoom-enter pilipa-zoom-active')
    setTimeout(() => {
      this.$el.find('.pilipa-modal-mask').removeClass('pilipa-fade-enter pilipa-fade-active')
      this.$el.find('.pilipa-modal-content').removeClass('pilipa-zoom-enter pilipa-zoom-active')
    }, 200)
  }
  public setNode () {
    const nodes: any = {
      header: this.header,
      body: this.content,
      footer: this.footer
    }
    for (const key in nodes) {
      if (nodes[key] instanceof Object && nodes[key].$$typeof) {
        render(
          nodes[key],
          this.$el.find(`.pilipa-modal-${key}`)[0]
        )
      } else {
        if (nodes[key] === null) {
          this.$el.find(`.pilipa-modal-${key}`).remove()
        } else {
          this.$el.find(`.pilipa-modal-${key}`).html(nodes[key])
        }
      }
    }
  }
  public template () {
    let buttons = `
      <button class="pilipa-btn pilipa-btn-primary">${this.okText}</button>
      <button class="pilipa-btn pilipa-btn-default">${this.cancelText}</button>
    `
    if (Modal.position === 'reverse') {
      buttons = `
        <button class="pilipa-btn pilipa-btn-default">${this.cancelText}</button>
        <button class="pilipa-btn pilipa-btn-primary">${this.okText}</button>
      `
    }
    return `
      <div class="${this.defaultCls}-mask"></div>
      <div class="${this.defaultCls}-wrap">
        <div class="${this.defaultCls}-content" style="">
          <div class="${this.defaultCls}-header">
            <span class="${this.defaultCls}-title">${this.title}</span>
            <span class="${this.defaultCls}-close">×</span>
          </div>
          <div class="${this.defaultCls}-body"></div>
          <div class="${this.defaultCls}-footer">
            ${buttons}
          </div>
        </div>
      </div>
    `
  }
}
export default Modal
