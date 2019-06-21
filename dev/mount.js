import React from 'react'
import $ from '../components/dom'
import { mount } from '../components'
const data = [{
  key: 1,
  title: 'ceshi'
}]
export default class extends React.Component {
  componentDidMount () {
    mount({
      props: {
        data: data,
        onChange: (item) => {
          console.log(item, 'dropdown')
        }
      },
      component: 'DropDown',
      el: $(this.refs.mount)
    })
  }
  render () {
    return (
      <div ref='mount'>mount</div>
    )
  }
}
