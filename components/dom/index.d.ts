/// <reference types="animejs" />

export type EasingProps = anime.EasingOptions | string | ReadonlyArray<number>;

export type Selector = string | DomInstance | Element | React.ReactInstance | Document
export interface DomInstance {
  [key: number]: HTMLElement
  length: number
  query (selector: Selector): this
  parseHtml (str: string): {
    /** 元素标签名称 */
    tagName: string
    /** 元素的子元素 */
    children: string
    /** 元素属性 */
    attrs: {[name: string]: string}
  }
  createElement (tagName: string, attrs: {[name: string]: string}, children: string): Element
  eq (i: number): this
  merge (first: any, second: any): any
  find (el: Selector): DomInstance
  html (html: string): void
  parent (): any
  each (cb: (el?: Element, index?: number) => void): void
  attr (name: object | string, value?: any): void
  css (name: object | string, value?: any): any
  text (str: string): string
  append (children: string | DomInstance): this
  children (selector: Selector): DomInstance
  addClass (name: string): void
  removeClass (name: string): void
  remove (): void
  index (): number
  on (event: string, fn?: (event?: any) => void): this
  off (event: string, fn?: any): this
  click (fn: (event?: any) => void): void
  offset (): {
    left: number,
    top: number
  },
  width (): number
  height (): number
  outerWidth (isContainOuter?: boolean): number
  outerHeight (isContainOuter?: boolean): number
  scroll (fn: (e?: E) => void): void
  scrollTop (top?: number, duration?: number): number
  val (value?: any): string
  select (): void
  keydown (fn: (e?: E) => void): this
  keyup (fn: (e?: E) => void): this
  trigger (event: string): void
  one (envent: string, fn: (e?: E) => void): void
  hover (onmouseover: (e?: any) => void, onmouseleave: (e?: E) => void): void
  fadeIn<C = any> (speed?: number, easing?: EasingProps | C, cb?: C): void
  fadeOut<C = any> (speed?: number, easing?: EasingProps | C, cb?: C): void
  slideDown<C = any> (speed?: number, easing?: EasingProps | C, cb?: C): void
  slideUp<C = any> (speed?: number, easing?: EasingProps | C, cb?: C): void
}
export interface E extends Event {
  params: any[]
  target: HTMLElement
  currentTarget: HTMLElement
}
interface DomFunc {
  (selctor: Selector): DomInstance
  param: (params: object) => string
  css: (elem: Element, name: string | object, value?: string | number) => any
  /** 空对象判断 */
  isEmptyObject: (obj: object) => boolean
}
declare const dom: DomFunc
export default dom
