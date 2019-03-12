import React from 'react'

import { AutoComplete, DropDown } from '../components'

export default class extends React.Component {
  constructor () {
    super()
    this.data = [{
      code: 3306,
      key: 1,
      title: undefined
    }, {
      key: 2,
      title: 0
    }]
    this.data2 = [{
      key2: 1,
      title2: '爱康鼎科技有限公司爱康鼎科技有限公司爱康鼎科技有限公司爱康鼎科技有限公司1'
    }, {
      key2: 2,
      title2: '噼里啪智能财税'
    }]
    let i = 0
    while (i < 100) {
      console.log(i)
      this.data.push({
        key: i,
        title: `测试数据${i}`
      })
      i++
    }
    this.state = {
      name: '点击',
      title: ''
    }
  }
  render () {
    return (
      <div style={{height: '1000px'}}>
        <button
          onClick={() => {
            this.setState({
              name: this.state.name === '点击' ? '取消' : '点击',
              title: '测试数据55'
            })
          }}
        >{this.state.name}</button>
        <DropDown
          // delay={2000}
          animation={false}
          type='click'
          style={{float: 'left', marginRight: '20px'}}
          data={[]}
          onChange={(item) => {
            console.log(item)
          }}
          filter
        />
        <DropDown
          // delay={2000}
          // defaultValue={{key: '测试数据55', title: '测试数据5'}}
          defaultValue={{
            title: this.state.title
          }}
          style={{float: 'left', marginRight: '20px'}}
          data={this.data}
          onChange={(item) => {
            console.log(item)
          }}
          filter={true}
          initCapital={(item) => {
            return [item.code]
          }}
        />
        <DropDown
          disabled={true}
          style={{float: 'left'}}
          data={this.data2}
          defaultValue={{
            key2: 2,
            title2: '噼里啪智能财税'
          }}
          setFields={{key: 'key2', title: 'title2'}}
          filter
        />
      </div>
    )
  }
}
