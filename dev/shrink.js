import React from 'react'
import Shrink from '../components/shrink'
class Main extends React.Component {
  constructor () {
    super()
    this.state = {
      collapsed: true
    }
  }
  render () {
    const { collapsed } = this.state
    console.log(collapsed, 'collapsed')
    return (
      <Shrink
        height={40}
        collapsed={collapsed}
        collapsedNode={(
          <div
            onClick={() => {
              this.setState({
                collapsed: !collapsed
              })
            }}
          >
            {collapsed ? '展开' : '折叠'}
          </div>
        )}
      >
        <div
          style={{height: 40, background: 'red'}}
        />
        <div
          style={{height: 40, background: 'blue'}}
        />
      </Shrink>
    )
  }
}
export default Main
