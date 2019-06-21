import React from 'react'
import $, { DomInstance } from '../dom'
export default {
  $el: $('<div class="pilipa-loading"></div>'),
  hide () {
    if (this.t) {
      clearInterval(this.t)
    }
    $('.pilipa-loading-content').fadeOut(10, () => {
      if ($('body').find(this.$el).length > 0) {
        this.$el.remove()
      }
    })
  },
  show () {
    this.$el.html(this.template())
    if ($('body').find(this.$el).length > 0) {
      this.$el.remove()
    }
    let i = 0
    this.t = setInterval(() => {
      i = i === 3 ? 0 : i + 1
      $('.pilipa-loading-content span').text('.'.repeat(i))
    }, 500)
    $('body').append(this.$el)
  },
  template () {
    return `
      <div class="pilipa-loading-mask">
        <div class="pilipa-loading-content">
          <span></span>
        </div>
      </div>
    `
  }
}
