import React from 'react'
import $, { DomInstance } from '../dom'

export interface Options {
  title?: string
  message: string
  duration?: number
}
type T = 'success' | 'error' | 'warning'
let defaultOptions = {
  title: '系统提示',
  message: '暂无信息',
  duration: 4500
}
export default {
  $el: $('<div class="pilipa-notification"></div>'),
  warning (options: Options = defaultOptions) {
    this.show(options, 'warning')
  },
  error (options: Options = defaultOptions) {
    this.show(options, 'error')
  },
  success (options: Options = defaultOptions) {
    this.show(options, 'success')
  },
  show (options: Options, type: T) {
    this.duration = options.duration || defaultOptions.duration
    const template = $(this.template(options, type))
    template.addClass('pilipa-notification-fade-enter pilipa-notification-fade-active')
    setTimeout(() => {
      template.removeClass('pilipa-notification-fade-enter pilipa-notification-fade-active')
    }, 240)
    this.$el.append(template)
    if ($('body').find(this.$el).length === 0) {
      $('body').append(this.$el)
    }
    this.initEvent(template)
  },
  initEvent (template: any) {
    const showTime = new Date().getTime()
    let t = setTimeout(() => {
      this.leave(template, this.n)
    }, this.duration - 240)
    template.find('.pilipa-notification-close').off('click').on('click', (event: any) => {
      // const template = $(event.target).parent()
      this.leave(template)
    })
    template.hover(() => {
      const nowTime = new Date().getTime()
      this.usedTime = nowTime - showTime
      clearTimeout(t)
    }, () => {
      const time = this.duration - this.usedTime
      t = setTimeout(() => {
        this.leave(template)
      }, time)
    })
  },
  leave (template: DomInstance) {
    template.addClass('pilipa-notification-fade-leave pilipa-notification-fade-active')
    setTimeout(() => {
      template.removeClass('pilipa-notification-fade-enter pilipa-notification-fade-active')
      template.remove()
    }, 240)
  },
  config (options: {}) {
    defaultOptions = Object.assign(defaultOptions, options)
  },
  template (options: Options, type: T) {
    const types = {
      success: 'fa-check-circle',
      warning: 'fa-exclamation-circle',
      error: 'fa-times-circle'
    }
    return `
      <div class="pilipa-notification-notice">
        <div class="pilipa-notification-icon">
          <i class="fa ${types[type]}" aria-hidden="true"></i>
        </div>
        <div class="pilipa-notification-close">×</div>
        <div class="pilipa-notification-content">
          <div class="pilipa-notification-title" title="${options.title || defaultOptions.title}">
            ${options.title || defaultOptions.title}
          </div>
          <p class="pilipa-notification-message" title="${options.message}">
            ${options.message}
          </p>
        </div>
      </div>
    `
  }
}
