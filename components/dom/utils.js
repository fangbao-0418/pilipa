import dataPriv from './Data'
const cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' }
var cssExpand = [ 'Top', 'Right', 'Bottom', 'Left' ]
/**
 * 对象序列化
 * @param {object} obj
 * @returns {string}
 */

export function param (obj) {
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
export function isEmptyObject (obj) {
  let key
  for (key in obj) {
    return false
  }
  return true
}
/**
 * 操作css
 * @param {Element} elem - 元素
 * @param {string|object} key - 样式名称或者样式对象
 * @param {string} value - 样式值
 * @returns {*}
 */
export function css (elem, name, value) {
  if (!(elem instanceof Object && elem.nodeType === 1)) {
    throw Error('elem is not a valid Element')
  }
  const styles = getComputedStyle(elem)
  if (value !== undefined) {
    if (typeof name === 'string') {
      elem.style[name] = value
    } else {
      throw Error('key is not string')
    }
  } else if (name === undefined) {
    return styles
  } else if (typeof name === 'string') {
    return styles[name]
  } else if (name instanceof Object) {
    for (const prop in name) {
      elem.style[prop] = name[prop]
    }
  }
}
export function attr (elem, name, value) {
  if (typeof name === 'string') {
    if (value === undefined) {
      return elem && elem.getAttribute(name)
    } else {
      elem.setAttribute(name, value)
    }
  } else if (name instanceof Object) {
    for (const key in name) {
      if (name.hasOwnProperty(key)) {
        elem.setAttribute(key, name[key])
      }
    }
  }
}
export function queue (elem, type = 'fx', fn) {
  type = type + 'queue'
  let queue = dataPriv.get(elem, type)
  if (queue === undefined) {
    queue = dataPriv.set(elem, type, [])[type]
  }
  if (fn) {
    queue.push(fn)
  }
  return queue
}
export function dequeue (elem, type = 'fx') {
  const q = queue(elem, type)
  let fn = q.shift()
  const next = function () {
    dequeue(elem, type)
  }
  if (fn === 'inprogress') {
    fn = q.shift()
  }
  if (fn) {
    q.unshift('inprogress')
    fn(next)
  }
  if (q.length === 0) {
    dataPriv.remove(elem, type + 'queue')
  }
}

/**
 * 获取元素高度或宽度
 * @param {Element} elem - 元素
 * @param {'width'|'height'} dimension - 维度
 * @param {'margin'|'border'|'content'|''} extra - 盒模型类型
 * @returns {number}
 */
export function getWidthOrHeight (elem, dimension = 'height', extra) {
  if (!(typeof elem === 'object' && elem.nodeType)) {
    throw Error('elem is not a valid Element')
  }
  let val = parseFloat(css(elem, dimension))
  // const offsetProp = 'offset' + dimension[0].toUpperCase() + dimension.slice(1)
  const isBorderBox = css(elem, 'boxSizing') === 'border-box'
  /** 处理隐藏元素 */
  if (/none/.test(css(elem, 'display'))) {
    return swap(elem, (el) => {
      return getWidthOrHeight(el, dimension, extra)
    })
  }
  if (!isBorderBox && extra === 'content') {
    return parseFloat(val) || 0
  }
  val += boxModelAdjustment(elem, dimension, extra, isBorderBox)
  val = parseFloat(val)
  return val >= 0 ? val : 0
}
/**
 * 获取盒模型外边距、内边距、边框大小
 * @param {*} elem - 元素
 * @param {width|height} dimension - 维度
 * @param {padding|margin|border} type
 * @returns {number}
 */
export function boxModelAdjustment (elem, dimension, type, isBorderBox) {
  let i = dimension === 'width' ? 1 : 0
  let ret = 0
  if ((type === 'content' && !isBorderBox) || (type === 'border' && isBorderBox)) {
    return 0
  }
  for (; i < 4; i += 2) {
    if (isBorderBox && type === 'content') {
      ret -= parseFloat(css(elem)['border' + cssExpand[i] + 'Width'])
      ret -= parseFloat(css(elem)['padding' + cssExpand[i]])
    } else {
      if (!isBorderBox) {
        ret += parseFloat(css(elem)['border' + cssExpand[i] + 'Width'])
        ret += parseFloat(css(elem)['padding' + cssExpand[i]])
      }
      if (type === 'margin') {
        ret += parseFloat(css(elem)[type + cssExpand[i]])
      }
    }
  }
  return ret || 0
}
/**
 * 处理隐藏元素
 * @param {Element} el - 元素
 * @param {function} callback
 */
function swap (el, callback) {
  let ret
  let name
  let old = {}
  for (name in cssShow) {
    old[ name ] = el.style[ name ]
    el.style[ name ] = cssShow[ name ]
  }
  ret = callback(el)
  for (name in cssShow) {
    el.style[ name ] = old[ name ]
  }
  return ret
}
export function simulator (el, event, args) {
  const e = document.createEvent('Event')
  e.params = args
  e.initEvent(event, true, false)
  el.dispatchEvent(e)
}
export function extend (src, ...args) {
  args.map((obj) => {
    for (const key in obj) {
      src[key] = obj[key]
    }
  })
  return src
}

export function Event (e, cur) {
  const obj = {}
  for (const key in e) {
    obj[key] = e[key]
  }
  obj.currentElement = cur
  return obj
}
