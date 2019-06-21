import anime from 'animejs'
export default function dom (options) {
  return new Dom(options)
}
/**
 * 对象序列化
 * @param {object} obj
 * @returns {string}
 */
dom.param = function (obj) {
  const arr = []
  let keys = []
  function loop (o) {
    if (typeof o === 'object') {
      let i = 0
      for (const k in o) {
        let val = [null, undefined].indexOf(o[k]) === -1 ? o[k] : ''
        if (typeof val === 'object') {
          keys.push(k)
          loop(val)
        } else {
          keys = keys.length === 0 ? [k] : keys.concat([k])
          const finalkey = encodeURIComponent(keys.length > 1 ? keys[0] + ('[' + keys.slice(1).join('][') + ']') : k)
          let finalval = encodeURIComponent(val)
          arr.push(`${finalkey}=${finalval}`)
        }
        keys = keys.slice(0, -1)
        i++
      }
      if (i === 0 && encodeURIComponent(o) !== encodeURIComponent({})) {
        const finalkey = encodeURIComponent(keys.length > 1 ? keys[0] + ('[' + keys.slice(1).join('][') + ']') : keys[0])
        let finalval = encodeURIComponent(o)
        arr.push(`${finalkey}=${finalval}`)
      }
    } else {
      throw new Error('param is not a valid object')
    }
  }
  loop(obj)
  const str = arr.join('&')
  return str
}

const Dom = function (selector) {
  if (!selector) {
    return this
  }
  if (typeof selector === 'object' && selector.nodeType !== undefined) {
    return this.merge(this.constructor(), [selector])
  }
  const result = this.parseHtml(selector)
  if (result) {
    this[0] = this.createElement(result.tagName, result.attrs, result.children)
    this.length = 1
    return this
  }
  const els = this.queryAll(selector)
  this.length = els.length
  return this.merge(this.constructor(), els)
}

Dom.prototype = {
  constructor: dom,
  length: 0,
  jquery: '1.0.0',
  use (fn) {
    try {
      if (fn) {
        fn(Dom)
      }
    } catch (e) {
      console.log('xxx')
    }
  },
  /**
   * 解析html模板
   * @param str - html模板字符串
   */
  parseHtml (str = '') {
    /**
     * 标准html模板 eg: <div class="abc"><span>abc</span></div>
     */
    const pattern1 = /^<([\S\s]*?)>([\S\s]*)(?=<\/\w+>)/
    /**
     * 非标准html模板 eg: <div class="abc"> or <div class="abc" />
     */
    const pattern2 = /^<([\S\s]+?)(?=(?:>|\/>))/
    const match1 = str.trim().match(pattern1)
    const match2 = str.trim().match(pattern2)

    let start = ''
    let children = ''

    if (match1) {
      const match = match1
      start = match[1]
      children = match[2]
    } else if (match2) {
      const match = match2
      start = match[1]
    } else {
      return undefined
    }
    const tagName = start.match(/^([\w-]+)/)[1]
    const group = (start.split(/\s+(?=\w+(?==))/) || []).slice(1)
    const attrs = {}
    group.map((item) => {
      const arr = item.trim().match(/(\w+)(?==)=['"]?([\w- ]*(?=['"]?))['"]?/)
      attrs[arr[1].trim()] = arr[2].trim()
    })
    const result = {
      tagName,
      attrs,
      children
    }
    return result
  },
  createElement (tagName, attrs, children) {
    const el = document.createElement(tagName)
    for (const key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        el.setAttribute(key, attrs[key])
      }
    }
    el.innerHTML = children
    return el
  },
  html (html) {
    if (html === undefined) {
      return this[0] ? this[0].innerHTML : undefined
    } else {
      this[0] && (this[0].innerHTML = html)
    }
  },
  text (text) {
    if (text === undefined) {
      return this[0].innerText
    } else {
      this[0] && (this[0].innerText = text)
    }
  },
  query (selector) {
    const els = document.querySelector(selector)
    return els
  },
  queryAll (selector) {
    const els = document.querySelectorAll(selector)
    return els
  },
  eq (i) {
    const len = this.length
    const n = +i + (i < 0 ? len : 0)
    return this.merge(this.constructor(), n >= 0 && n < len ? [this[n]] : [])
  },
  merge (first, second) {
    const len = +second.length
    let j = 0
    let i = first.length
    for (; j < len; j++) {
      first[i++] = second[j]
    }
    first.length = i
    return first
  },
  /**
   * 元素查找
   * @param {*} match - 查找的元素对象
   * @param {boolean} onLydirect - 是否仅仅查询直系元素
   */
  find (match, onLydirect = false) {
    if (!match) {
      return this
    }
    const nodes = this.getAllChildren(match, onLydirect)
    return this.merge(this.constructor(), nodes)
  },
  parent () {
    const parents = []
    this.each((el) => {
      parents.push(el.parentNode)
    })
    const results = this.unique(parents)
    return this.merge(this.constructor(), results)
  },
  children (match = '*') {
    return this.find(match, true)
  },
  /**
   * 获取所有子元素
   * @param {*} parent - 被筛选元素
   * @param {string | Dom | Element} match - 匹配的元素
   * @param {boolean} onLydirect - 是否仅仅查询直系元素
   * @returns {Element[]}
   */
  getAllChildren (match = null, onLydirect = false) {
    let children = []
    /** 所有匹配结果 */
    let allMatchResult = []
    let pushed = {}
    if (typeof match === 'string') {
      allMatchResult = this.queryAll(match)
      if (allMatchResult.length === 0) {
        return []
      }
    } else if (typeof match === 'object' && match.nodeType !== undefined) {
      match = this.constructor(match)
    }
    const loop = function (el) {
      const nodes = el.children
      const len = nodes.length
      for (let i = 0; i < len; i++) {
        /** 子元素 */
        const item = nodes.item(i)
        /** 是否筛选元素  */
        if (match && match instanceof Dom) {
          match.each((val) => {
            if (val === item && item !== undefined) {
              children.push(item)
            } else if (item.contains(val) && !onLydirect) {
              loop(item)
            }
          })
        } else {
          if (allMatchResult.length > 0) {
            allMatchResult.forEach((val, index) => {
              if (item === val && !pushed[index] && val !== undefined) {
                children.push(val)
                pushed[index] = true
              }
            })
            if (item.children.length > 0 && !onLydirect) {
              loop(item)
            }
          } else {
            children.push(item)
            if (item.children.length > 0 && !onLydirect) {
              loop(item)
            }
          }
        }
      }
    }
    this.each((item) => {
      loop(item)
    })
    return this.unique(children)
  },
  /**
   * 数组去重
   * @param {*[]} results - 选择去重的数组
   * @returns {*[]}
   */
  unique (results) {
    var arr = []
    let len = results.length
    let i = 0
    while (i < len) {
      const index = arr.findIndex((val) => {
        return val === results[i]
      })
      if (index === -1) {
        arr.push(results[i])
      }
      i++
    }
    return arr
  },
  fadeIn (n = 50, cb) {
    anime({
      targets: this[0],
      opacity: [0, 1],
      duration: n,
      complete () {
        if (cb) {
          cb()
        }
      }
    })
  },
  fadeOut (n = 50, cb) {
    anime({
      targets: this[0],
      opacity: [1, 0],
      duration: n,
      complete () {
        if (cb) {
          cb()
        }
      }
    })
  },
  each (cb) {
    if (cb) {
      for (const key in this) {
        if (/\d{1,}/.test(key) && this.hasOwnProperty(key)) {
          cb(this[key], Number(key))
        }
      }
    }
  },
  attr (name, value) {
    if (typeof name === 'string') {
      if (value === undefined) {
        return this[0] && this[0].getAttribute(name)
      } else {
        this.each((el) => {
          el.setAttribute(name, value)
        })
      }
    } else {
      this.each((el) => {
        for (const key in name) {
          if (name.hasOwnProperty(key)) {
            el.setAttribute(key, name[key])
          }
        }
      })
    }
  },
  getComputedStyle (name) {
    let style
    if (getComputedStyle) {
      style = getComputedStyle(this[0]) || {}
    } else {
      style = this[0] ? this[0].currentStyle : {}
    }
    return name ? style[name] : style
  },
  css (sourceName, value) {
    const name = sourceName
    if (typeof name === 'string') {
      if (value !== undefined) {
        this.each((el) => {
          el.style[name] = value
        })
      } else {
        return this.getComputedStyle(name)
      }
    } else if (typeof name === 'object') {
      for (const key in name) {
        if (name.hasOwnProperty(key)) {
          this.each((el) => {
            el.style[key] = name[key]
          })
        }
      }
    }
  },
  addClass (name = '') {
    this.each((el) => {
      const regexp = new RegExp(name.trim().split(/\s+/).join('|'), 'g')
      let className = el.getAttribute('class') || ''
      className = (className.replace(regexp, '') + ' ' + name).trim().split(/\s+/).join(' ')
      el.setAttribute('class', className)
    })
    return this
  },
  removeClass (name = '') {
    this.each((el) => {
      const regexp = new RegExp(name.trim().split(/\s+/).join('|'), 'g')
      let className = el.getAttribute('class') || ''
      className = className.replace(regexp, '').trim().split(/\s+/).join(' ')
      el.setAttribute('class', className)
    })
    return this
  },
  cloneElement (el) {
    return this.constructor(el.outerHTML)
  },
  append (children) {
    let el
    if (children instanceof Dom) {
      el = children[0]
    } else if (typeof children === 'string') {
      const result = this.parseHtml(children)
      el = this.createElement(result.tagName, result.attrs, result.children)
    }
    this.each((item) => {
      item.appendChild(this.length === 1 ? el : this.cloneElement(el)[0])
    })
    return this
  },
  remove () {
    this.each((el) => {
      if (el.parentNode && el) {
        el.parentNode.removeChild(el)
      }
    })
  },
  click (fn) {
    this.each((el) => {
      el.onclick = fn
    })
  },
  on (event, fn) {
    this.each((el) => {
      listener.on(el, event, fn)
    })
    return this
  },
  off (event, fn) {
    this.each((el) => {
      console.log(window['getEventListeners'])
      listener.off(el, event, fn)
    })
    return this
  },
  one (event, fn) {
    this.each((el) => {
      const func = (e) => {
        if (fn) {
          fn(e)
          listener.off(el, event, func)
        }
      }
      listener.on(el, event, func)
    })
    return this
  },
  trigger (event, ...args) {
    this.each((el) => {
      simulator(el, event, args)
    })
  },
  hover (mouseover, mouseleave) {
    this.each((el) => {
      el.onmouseover = mouseover
      el.onmouseleave = mouseleave
    })
  },
  /** 格式化像素 */
  formatPx (str) {
    return Number(str.trim().replace('px', ''))
  },
  width () {
    return this.formatPx(this.css('witdh'))
  },
  height () {
    return this.formatPx(this.css('height'))
  },
  outerWidth (isContainOuter = false) {
    const offsetWidth = this[0] ? this[0].offsetWidth : 0
    const marginLeft = this.formatPx(this.css('marginLeft')) || 0
    const marginRight = this.formatPx(this.css('marginRight')) || 0
    return isContainOuter ? offsetWidth + marginLeft + marginRight : offsetWidth
  },
  outerHeight (isContainOuter = false) {
    const offsetHeight = this[0] ? this[0].offsetHeight : 0
    const marginTop = this.formatPx(this.css('marginTop')) || 0
    const marginBottom = this.formatPx(this.css('marginBottom')) || 0
    return isContainOuter ? offsetHeight + marginTop + marginBottom : offsetHeight
  },
  offset () {
    if (this[0]) {
      return {
        left: this[0].offsetLeft,
        top: this[0].offsetTop
      }
    }
    return null
  },
  index () {
    let index = 0
    if (this[0]) {
      this.constructor(this[0].parentNode).children().each((el, i) => {
        if (el === this[0]) {
          index = i
        }
      })
    }
    return index
  },
  scroll (fn) {
    this.each((el) => {
      el.onscroll = (e) => {
        if (fn) {
          fn(e)
        }
      }
    })
  },
  scrollTop (top, duration = 0) {
    if (top === undefined) {
      return this[0] ? (this[0].scrollTop || 0) : 0
    }
    this.each((el) => {
      let o = {
        scrollTop: el.scrollTop
      }
      if (duration === 0) {
        el.scrollTop = top
        return
      }
      anime({
        targets: o,
        scrollTop: top,
        easing: 'linear',
        round: 1,
        duration: duration,
        update: () => {
          el.scrollTop = o.scrollTop
        }
      })
    })
  },
  val (value) {
    if (value === undefined) {
      return this[0] ? this[0].value : undefined
    }
    this.each((el) => {
      el.value = value
    })
  },
  keydown (fn) {
    this.each((el) => {
      listener.on(el, 'keydown', fn)
    })
  },
  keyup (fn) {
    this.each((el) => {
      listener.on(el, 'keyup', fn)
    })
  },
  select () {
    this.each((el) => {
      if (el.select) {
        el.select()
      }
    })
  }
}
const simulator = (el, event, args) => {
  const e = document.createEvent('Event')
  e.params = args
  e.initEvent(event, true, false)
  el.dispatchEvent(e)
}
const listener = {
  listeners: [],
  on: (element, type, handler) => {
    element.addEventListener(type, handler)
    listener.listeners.push({
      element,
      type,
      handler
    })
  },
  off: (element, type, handler) => {
    listener.listeners.map((item) => {
      if (element === item.element && type === item.type && (handler === undefined || handler === item.handler)) {
        element.removeEventListener(type, item.handler)
      }
    })
  }
}
