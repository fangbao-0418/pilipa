import dom from './base'
import { getWidthOrHeight } from './utils'
function Data () {
  this.expando = dom.expando + Data.uid++
}
Data.uid = 1
Data.prototype = {
  cache: function (owner) {
    var value = owner[this.expando]
    if (!value) {
      value = {}
      owner[this.expando] = value
    }
    return value
  },
  set: function (owner, data, value) {
    const cache = this.cache(owner)
    if (typeof data === 'string') {
      cache[data] = value
    }
    if (data instanceof Object) {
      for (const prop in data) {
        cache[prop] = data[prop]
      }
    }
    return cache
  },
  get: function (owner, key) {
    return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[this.expando][key]
  },
  remove: function (owner, key) {
    const cache = owner[this.expando]
    if (key === undefined) {
      owner[this.expando] = undefined
      return
    }
    if (typeof key === 'string') {
      key = [key]
    }
    key.map((item) => {
      if (item in cache) {
        delete cache[key]
      }
    })
  },
  /**
   * 记录样式属性
   * @param {*} owner
   * @param {string[]} props
   */
  record: function (owner) {
    const props = ['height', 'width', 'display', 'opacity']
    if (!(owner instanceof Object && owner.nodeType === 1)) {
      return
    }
    const style = dom.attr(owner, 'style')
    const orig = {}
    const record = {}
    props.map((item) => {
      if (this.get(owner, item) === undefined) {
        if (['width', 'height'].indexOf(item) > -1) {
          orig[item] = getWidthOrHeight(owner, item, 'content')
        } else {
          orig[item] = dom.css(owner)[item]
        }
        record[item] = orig[item]
      } else {
        orig[item] = this.get(owner, item)
      }
    })
    if (this.get(owner, 'style') === undefined && style !== null) {
      record.style = style
    }
    this.set(owner, record)
    return orig
  },
  /**
   * 还原样式属性
   * @param {*} owner
   * @param {string[]} props
   */
  restore: function (owner) {
    const props = ['height', 'width', 'opacity']
    const style = this.get(owner, 'style')
    owner.style = style
    dom.css(owner, 'display', this.get(owner, 'display'))
    this.remove(owner, 'style')
    props.map((item) => {
      this.remove(owner, item)
    })
  }
}
export default new Data()
