import { Event } from './utils'
const listener = {
  listeners: [],
  on (element, type, handler) {
    function finalHandler (e) {
      if (handler) {
        handler.call(element, Event(e, element))
      }
    }
    element.addEventListener(type, finalHandler)
    this.listeners.push({
      element,
      type,
      handler,
      finalHandler
    })
    return finalHandler
  },
  one (element, type, handler) {
    const that = this
    function func (e) {
      if (handler) {
        handler.call(element, e)
        that.off(element, type, f)
      }
    }
    const f = this.on(element, type, func)
  },
  off (element, type, handler) {
    const listeners = []
    this.listeners.map((item, index) => {
      if (element === item.element && type === item.type && (handler === undefined || handler === item.handler)) {
        element.removeEventListener(type, item.finalHandler)
      } else {
        listeners.push(item)
      }
    })
    this.listeners = listeners
  }
}
export default listener
