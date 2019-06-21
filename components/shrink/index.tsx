import classNames from 'classnames'
import React from 'react'
import * as _ from '../_util'
export interface Props {
  className?: string
  /** 设置高度 */
  height?: number
  /** 默认展开状态 */
  defaultCollapsed?: boolean
  /** 展开状态 */
  collapsed?: boolean
  /** 展开node */
  collapsedNode?: React.ReactNode
}
export interface State {
  visibled: boolean
}
class Main extends React.Component<Props, State> {
  public collapsed = this.props.collapsed !== undefined
  ? this.props.collapsed : (this.props.defaultCollapsed !== undefined ? this.props.defaultCollapsed : true)
  public state: State = {
    visibled: !this.collapsed
  }
  public throttlComputeHeight = _.throttle(this.computeHeight.bind(this), 500)
  public componentDidMount () {
    this.computeHeight()
    window.addEventListener('resize', this.throttlComputeHeight)
  }
  public componentWillReceiveProps (props: Props) {
    if (props.collapsed !== undefined) {
      this.setState({
        visibled: !props.collapsed
      })
    }
  }
  public componentWillUnmount () {
    window.removeEventListener('resize', this.throttlComputeHeight)
  }
  public computeHeight () {
    const el: any = this.refs.el
    const h = this.props.height || 40
    const ch = el.children[0].children[0].clientHeight
    const button: any = this.refs.button
    if (ch <= h) {
      button.style.display = 'none'
    } else {
      button.style.display = ''
    }
  }
  public render () {
    const { visibled } = this.state
    const height = this.props.height || 40
    const collapsedNode = this.props.collapsedNode
    return (
      <div
        ref='el'
        style={{height: visibled ? 'auto' : height}}
        className={classNames('pilipa-shrink', this.props.className)}
      >
        <div className='pilipa-shrink-wrap'>
          <div className='pilipa-shrink-content'>
            {this.props.children}
          </div>
        </div>
        <div ref='button' className='pilipa-shrink-button' style={{height}}>
          {collapsedNode ? collapsedNode : <i
            onClick={() => {
              this.setState({
                visibled: !visibled
              })
            }}
            className={classNames('fa', visibled ? 'fa-chevron-circle-down fa-lg' : 'fa-chevron-circle-up fa-lg')}
            aria-hidden='true'
            style={{color:'#1890ff'}}
          />}
        </div>
      </div>
    )
  }
}
export default Main
