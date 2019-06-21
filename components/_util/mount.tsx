import React from 'react'
import { findDOMNode, render } from 'react-dom'
import $ from '../dom'
import * as modules from '../index'
const Components: any = modules
let instance: object = null
function init () {
  instance = this
}
function mounted () {
  instance = this
}
function destroy () {
}
const allowComponents = ['SearchView', 'DropDown']
export default function <P> (conf: {component: string, props: P,  el: any}) {
  const { component, props } = conf
  let { el } = conf
  if (allowComponents.indexOf(component) === -1) {
    throw new Error('the component does not exist')
  }
  const Component = Components[component]
  if (el.__proto__.jquery) {
    el = el[0]
  }
  const promise = new Promise((resolve: any, reject: any) => {
    if (!(el instanceof Element)) {
      throw new Error('el is not a valid element')
    } else {
      const res = render(
        <Component {...props} init={init} mounted={mounted} destroy={destroy}/>,
        el,
        () => {
          resolve(instance)
        }
      )
    }
  })
  return promise
}
