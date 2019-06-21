import React from 'react'
import { AutoComplete } from '../components'
export default class extends React.Component {
  constructor () {
    super()
    this.data = [{
      code: 0,
      key2: 0,
      title2: 0
    }, {
      code: '1001',
      key2: '1001',
      title2: '测试1001'
    }]
    for (var i = 0; i <= 100; i++) {
      this.data.push({
        code: `k${i}`,
        key2: i,
        title2: `测试数xxxxxxxxxxxxxxxx据${i}`
      })
    }
    this.state = {
      value: {
        title: 2
      }
    }
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        value: {
          title: 44444
        }
      })
    }, 1000)
  }
  render () {
    console.log(this.data, 'data')
    return (
      <div>
        <AutoComplete
          disabled={true}
          data={this.data}
          style={{float: 'left', position: 'absolute', top: '400px'}}
          setFields={{
            title: 'title2',
            key: 'key2'
          }}
          select={true}
          onChange={(item) => {
            console.log(item)
          }}
          placement='top'
          initCapital={(item) => {
            return [item.code]
          }}
        />
        <AutoComplete
          style={{float: 'left'}}
          data={this.data}
          select={true}
          setFields={{
            title: 'title2',
            key: 'key2'
          }}
          defaultValue='0'
          onChange={(item) => {
            console.log(item)
          }}
        />
        <AutoComplete
          animation={false}
          style={{float: 'left'}}
          data={this.data.slice(0, 4)}
          setFields={{
            title: 'title2',
            key: 'key2'
          }}
          defaultValue={this.state.value}
          onChange={(item) => {
            console.log(item)
          }}
        />
      </div>
    )
  }
}
