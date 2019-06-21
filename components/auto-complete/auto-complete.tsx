import classNames from 'classnames'
// import $ from 'jquery'
import React from 'react'
import { getCapital } from '../_util'
import $ from '../dom'
export interface T {
  title: string
  key?: any
  capital?: string[]
  index?: number
}
export interface MyProps {
  data: any[]
  onSelect?: (item: T) => void
  onChange?: (item: T) => void
  className?: string
  placeholder?: string
  style?: React.CSSProperties
  setFields?: {key: string, title: string}
  defaultValue?: any
  onPanelHide?: () => void
  initCapital?: (item: any) => string[]
  placement?: 'top' | 'bottom'
  select?: boolean
  disabled?: boolean
  animation?: boolean
}
export interface MyStates {
  data: T[]
  dataTmp: T[]
  page: number
  visible: boolean
  selectedIndex: number
  value: string
}

class AutoComplete extends React.Component<MyProps, MyStates> {
  public hover = false
  public pageNum = 20
  public allData: T[] = []
  public defaultCls = 'pilipa-auto-complete'
  public event: any
  public filterVal: string = ''
  public isDestroy = false
  public t: NodeJS.Timer | number
  public placement: 'top' | 'bottom' = this.props.placement === undefined ? 'bottom' : this.props.placement
  constructor (props: MyProps) {
    super(props)
    this.documentClickListener = this.documentClickListener.bind(this)
    this.handleAllData(this.props.data)
    this.state = {
      data: this.allData.slice(0, this.pageNum),
      dataTmp: this.allData,
      page: 1,
      visible: false,
      selectedIndex: -1,
      value: this.getDefaultValue()
    }
  }
  public componentWillReceiveProps (props: MyProps) {
    this.placement = props.placement === undefined ? 'bottom' : props.placement
    if (props.data instanceof Array) {
      this.handleAllData(props.data)
      this.setState({
        data: this.allData.slice(0, this.pageNum),
        dataTmp: this.allData,
        page: 1,
        value: this.getDefaultValue(props)
      })
    }
  }
  public componentDidMount () {
    $(this.refs.input).off('click')
    $(this.refs.input).click(() => {
      if (this.props.select) {
        $(this.refs.input).select()
      }
      if (this.state.visible) {
        return
      }
      this.searchShow()
    })
    $(document).keydown((event) => {
      this.onKeyDown(event)
    })
    $(document).keyup(() => {
      if (this.event) {
        this.event.returnValue = false
      }
    })
    document.addEventListener('click', this.documentClickListener)
  }
  public componentWillUnmount () {
    document.removeEventListener('click', this.documentClickListener)
    this.isDestroy = true
    if (this.t !== undefined) {
      clearTimeout(Number(this.t))
    }
  }
  public documentClickListener (e: any) {
    const input: any = this.refs.input
    const results: any = this.refs.results
    if (results) {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        if (this.props.onPanelHide) {
          this.props.onPanelHide()
        }
        const animation = this.props.animation !== undefined ? this.props.animation : true
        if (!animation) {
          this.hide()
          return
        }
        $(results).addClass('custom-slide-up-leave')
        this.t = setTimeout(() => {
          $(results).removeClass('custom-slide-up-leave')
          this.hide()
        }, 300)
      }
    }
  }
  public getDefaultValue (props: MyProps = this.props) {
    let value = ''
    const { defaultValue, setFields } = props
    if (typeof defaultValue !== 'object') {
      return defaultValue
    }
    value = setFields ? defaultValue[setFields.title] : defaultValue.title
    return value
  }
  public onKeyDown (event?: any) {
    this.event = event
    const $results = $(this.refs.results)
    const $items = $results.find('.items')
    const $lis = $results.find('.items li')
    const keyCode = event.keyCode
    const { data } = this.state
    let { selectedIndex } = this.state
    let liOffsetTop = 0
    const scrollTop = $items.scrollTop()
    const itemsHeight = $items.height()
    if ($lis.length === 0 || $lis.eq(selectedIndex).length === 0) {
      return
    }
    switch (keyCode) {
    // 回车
    case 13:
      selectedIndex = selectedIndex > -1 ? selectedIndex : 0
      $lis.eq(selectedIndex).trigger('click')
      break
    // ↑
    case 38:
      event.preventDefault()
      selectedIndex = selectedIndex <= 0 ? 0 : selectedIndex - 1
      liOffsetTop = $lis.eq(selectedIndex)[0].offsetTop
      if (scrollTop > liOffsetTop) {
        $items.scrollTop(liOffsetTop)
      }
      this.setState({
        selectedIndex
      })
      break
    // ↓
    case 40:
      event.preventDefault()
      selectedIndex = selectedIndex >= data.length - 1 ? data.length - 1 : selectedIndex + 1
      liOffsetTop = $lis.eq(selectedIndex)[0].offsetTop
      if (scrollTop + itemsHeight - $lis.eq(selectedIndex).height() < liOffsetTop) {
        $items.scrollTop(scrollTop + $lis.eq(selectedIndex)[0].clientHeight)
      }
      this.setState({
        selectedIndex
      })
      break
    }
  }
  public handleAllData (data: any[]) {
    const { key, title } = this.props.setFields || {key: 'key', title: 'title'}
    this.allData = []
    data.map((item, index) => {
      let initCapital: string[] = []
      if (this.props.initCapital) {
        initCapital = this.props.initCapital(item) instanceof Array ? this.props.initCapital(item) : []
      }
      const capital = initCapital.concat(getCapital<string>(item[title]))
      const newItem: T = {
        key: item[key],
        title: item[title],
        capital
      }
      this.allData[index] = newItem
    })
  }
  public searchChange (e: any) {
    const $items = $(this.refs.results).find('.items')
    const value = e.target.value || ''
    if (this.props.onChange) {
      // const title = this.props.setFields.title || 'title'
      this.props.onChange({
        title: value
      })
    }
    this.setState({
      value
    }, () => {
      $items.scrollTop(0)
      this.searchShow()
    })
  }
  public filterData () {
    const { allData } = this
    if (this.filterVal === '') {
      return this.allData
    }
    let pattern: RegExp = null
    try {
      pattern = new RegExp(this.filterVal, 'i')
    } catch (e) {
      pattern = new RegExp('', 'i')
    }
    const res = allData.filter((item: T): boolean => {
      if (pattern.test(item.title) || pattern.test(item.capital.join(','))) {
        return true
      }
    })
    return res || []
  }
  public searchShow () {
    const el = $(this.refs.input)
    this.filterVal = el.val().toString() || ''
    const res = this.filterData()
    this.setState({
      data: res.slice(0, this.pageNum),
      dataTmp: res,
      visible: true,
      page: 1,
      selectedIndex: -1
    }, () => {
      this.listenScroll()
      const results = this.refs.results
      const height = $(this.refs.input).outerHeight() + 8
      if (this.placement === 'bottom') {
        $(results).css({
          'transform-origin': height,
          'top': height
        })
      } else {
        $(results).css({
          bottom: height
        })
      }
      // $(results).addClass('custom-slide-up-enter')
      // this.t = setTimeout(() => {
      //   $(results).addClass('custom-slide-up-enter')
      // }, 300)
      // el.off('blur')
      // $(results).hover(() => {
      //   this.hover = true
      // }, () => {
      //   this.hover = false
      // })
      // el.blur(() => {
      //   if (this.props.onPanelHide) {
      //     this.props.onPanelHide()
      //   }
      //   if (!this.hover) {
      //     $(results).addClass('custom-slide-up-leave')
      //     this.t = setTimeout(() => {
      //       $(results).removeClass('custom-slide-up-leave')
      //       this.hide()
      //     }, 300)
      //   }
      // })
    })
  }
  public hide () {
    this.hover = false
    if (this.isDestroy) {
      return
    }
    this.setState({
      visible: false
    })
  }
  public handleSelect (item: T, index: number) {
    item.index = index
    this.setState({
      value: item.title
    })
    $(this.refs.input).val(item.title)
    const results = this.refs.results
    const { onSelect, onChange } = this.props
    $(results).addClass('custom-slide-up-leave')
    if (onSelect) {
      onSelect(item)
    }
    if (onChange) {
      onChange(item)
    }
    this.t = setTimeout(() => {
      $(results).removeClass('custom-slide-up-leave')
      this.hide()
      if (this.props.onPanelHide) {
        this.props.onPanelHide()
      }
    }, 300)
  }
  public listenScroll () {
    const results = this.refs.results
    // $(results).children('.items').off('scroll')
    $(results).children('.items').scroll((e) => {
      const scrollTop = e.target.scrollTop
      const h = $(results).find('ul').height()
      const ch = e.target.clientHeight
      if (scrollTop + ch > h - 10) {
        if (this.state.page < Math.ceil(this.state.dataTmp.length / this.pageNum)) {
          this.setState({
            page: this.state.page + 1,
            data: this.state.dataTmp.slice(0, this.pageNum * (this.state.page + 1))
          })
        }
      }
    })
  }
  public render () {
    const { data, value, visible } = this.state
    const { className, placeholder } = this.props
    return (
      <div
        ref='el'
        className={classNames(this.defaultCls, className)}
        style={this.props.style}
      >
        <input
          type='text'
          placeholder={placeholder}
          onChange={this.searchChange.bind(this)}
          ref='input'
          value={value}
          disabled={this.props.disabled}
        />
        {visible &&
          <div
            className={classNames('results', {
              top: this.placement === 'top',
              bottom: this.placement === 'bottom'
            })}
            ref='results'
          >
            {data.length === 0 && <p>未搜到结果</p>}
            <div className='items'>
              <ul>
                {
                  data && data.map((item, index) => {
                    return (
                      <li
                        onClick={this.handleSelect.bind(this, item, index)}
                        key={'auto-complete-' + index}
                        title={item.title}
                        className={classNames({
                          active: this.state.selectedIndex === index
                        })}
                        onMouseEnter={() => {
                          this.setState({
                            selectedIndex: index
                          })
                        }}
                      >
                        <span>{item.title}</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }
}
export default AutoComplete
