import React from 'react'
const location = window.location.href
let hash
let Component
try {
  hash = location.match(/#([\w-]*)$/)[1]
  try {
    Component = require('./' + hash + '.tsx').default
  } catch (e) {
    Component = require('./' + hash + '.js').default
  }
} catch (e) {
  console.log('home page')
}

export default class App extends React.Component {
  mapDemo () {
    const demo = ['shrink', 'dropdown', 'auto-complete', 'voucher', 'modal', 'notification', 'loading', 'cookie', 'webuploader', 'searchView', 'test', 'carousel', 'form', 'mount', 'utils']
    const node = []
    demo.map((item, index) => {
      node.push(
        <li
          key={index}
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            window.location.href = '/#' + item
            window.location.reload()
          }}
        >
          {item}
        </li>)
    })
    return node
  }
  render () {
    return (
      <div>
        {
          Component !== undefined &&
          <div>
            <h3
              style={{
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              onClick={() => {
                window.location.href = '/'
              }}
            >
              返回列表
            </h3>
            <hr />
            <Component />
          </div>
        }
        {
          Component === undefined &&
          <div>
            <h3>组件demo</h3>
            <ul>
              {this.mapDemo()}
            </ul>
          </div>
        }
      </div>
    )
  }
}
