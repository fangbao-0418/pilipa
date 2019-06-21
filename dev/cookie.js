import React from 'react'
import cookie from '../components/cookie'
import $ from '../components/dom'
export default class extends React.Component {
  toClick (type) {
    const key = $('input:nth-child(1)').val()
    const value = $('input:nth-child(2)').val()
    const expires = $('input:nth-child(3)').val()
    console.log(type)
    switch (type) {
    case 'get':
      alert(cookie.get(key))
      break
    case 'set':
      cookie.set({
        [key]: value
      }, {
        expires: expires
      })
      break
    case 'remove':
      cookie.remove()
      break
    default :
      alert('no type')
      break
    }
  }
  render () {
    return (
      <div>
        <div>
          key: <input /> &nbsp;
          value: <input /> &nbsp;
          expires: <input />
        </div>
        <br />
        <button
          style={{marginRight: '10px'}}
          className="pilipa-btn pilipa-btn-warning"
          onClick={this.toClick.bind(this, 'set')}
        >
          setCookie
        </button>
        <button
          style={{marginRight: '10px'}}
          className="pilipa-btn pilipa-btn-warning"
          onClick={this.toClick.bind(this, 'get')}
        >
          getCookie
        </button>
        <button
          style={{marginRight: '10px'}}
          className="pilipa-btn pilipa-btn-warning"
          onClick={this.toClick.bind(this, 'remove')}
        >
          removeCookie
        </button>
      </div>
    )
  }
}
