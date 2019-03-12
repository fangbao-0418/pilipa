import ClassNames from 'classnames'
import $ from 'jquery'
import React from 'react'
import { getCapital } from '../_util'
export interface T {
  index?: number
  title: string
  key: any
  capital?: string[]
}
export interface MyProps {
  data: any[]
  className?: string
  style?: React.CSSProperties
  filter?: boolean
  callBack?: (item: T) => void
  onChange?: (item: T) => void
  setFields?: {key: string, title: string}
  prePend?: object
  title?: string
  defaultValue?: any
  visible?: boolean
  type?: 'click' | 'hover'
  initCapital?: (item: any) => string[]
  delay?: number
  disabled?: boolean
  animation?: boolean
}

export interface MyStates {
  visible: boolean
  data: T[]
  dataTmp: T[]
  title?: string
  selectedIndex: number
  filterVal: string
}
export default class extends React.Component<MyProps, MyStates> {
  public isDestroy = false
  public pageNum = 20
  public t: any
  public allData: T[] = []
  public defaultCls = 'pilipa-dropdown'
  public defaultPage = 1
  public selectedIndex = -1
  public seleted = false
  public event: any
  public filterVal: string = ''
  public type = this.props.type !== undefined ? this.props.type : 'hover'
  public constructor (props: MyProps) {
    super(props)
    this.handleAllData(this.props)
    this.state = {
      visible: this.props.visible,
      title: this.props.title || this.getDefaultValue() || '',
      data: this.allData.slice(0, this.pageNum * this.defaultPage),
      dataTmp: this.allData,
      selectedIndex: this.selectedIndex,
      filterVal: ''
    }
  }
  public componentWillReceiveProps (props: MyProps) {
    if (props.data instanceof Array) {
      this.handleAllData(props)
      const res = this.filterData()
      this.setState({
        title: props.title || this.getDefaultValue(props),
        data: res.slice(0, this.pageNum * this.defaultPage),
        dataTmp: res
      })
    }
  }
  public componentDidMount () {
    this.initEvent()
  }
  public componentWillUnmount () {
    this.isDestroy = true
    if (this.t) {
      clearTimeout(this.t)
    }
  }
  public initEvent () {
    if (this.props.disabled) {
      return
    }
    const $dropdowm = $(this.refs.dropdown)
    const { button } = this.refs
    if (this.type === 'click') {
      $(button).click(() => {
        this.handleEnter()
      })
      $(document).on('click', (event) => {
        if($dropdowm.find(event.target).length === 0) {
          this.handleLeave()
        }
      })
    } else {
      $(button).hover(() => {
        this.handleEnter()
      }, (e) => {
        this.handleLeave()
      })
    }
    $(document).keydown((event) => {
      this.onKeyDown(event)
    })
    $(document).keyup(() => {
      if (this.event) {
        this.event.returnValue = false
      }
    })
  }
  public getDefaultValue (props?: MyProps) {
    props = props || this.props
    let value = ''
    const title = props.setFields ? props.setFields.title : 'title'
    try {
      value = props.defaultValue[title]
    } catch(e) {}
    return value
  }
  public onKeyDown (event: any) {
    this.event = event
    const $dropdown = $(this.refs.dropdown)
    const keyCode = event.keyCode
    let { selectedIndex } = this.state
    const $items = $dropdown.find('.results .items')
    const $lis = $items.find('li')
    const { data } = this.state
    if ($lis.length === 0 || $lis.eq(selectedIndex).length === 0) {
      return
    }
    const scrollTop = $items.scrollTop()
    const itemsHeight = $items.height()
    let liOffsetTop = 0
    switch (keyCode) {
    // 回车
    case 13:
      $lis.eq(this.state.selectedIndex).trigger('click')
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
  public handleAllData (props: MyProps) {
    let { data } = props
    const { defaultValue } = this.props
    data = data || []
    const { key, title } = props.setFields || {key: 'key', title: 'title'}
    const selectTitle = props.title
    data = props.prePend === undefined ? data : [props.prePend].concat(data)
    this.allData = []
    const value = this.state ?
    this.state.title : (props.title ? props.title : (defaultValue ? defaultValue[title] : ''))
    this.defaultPage = 1
    this.selectedIndex = -1
    data.map((item, index) => {
      let initCapital: string[] = []
      if (this.props.initCapital) {
        initCapital = this.props.initCapital(item) instanceof Array ? this.props.initCapital(item) : []
      }
      const capital = initCapital.concat(getCapital(item[title]))
      const newItem: T = {
        key: item[key],
        title: item[title],
        capital
      }
      if (value === item[title]) {
        this.defaultPage = index === 0 ? 1 : Math.ceil((index + 1) / this.pageNum)
        this.selectedIndex = index
      }
      this.allData[index] = newItem
    })
  }
  // 滚动到选中的位置
  public scrollToSelectedPos () {
    const $dropdowm = $(this.refs.dropdown)
    const $items = $dropdowm.find('.results .items')
    this.state.dataTmp.find((item, index) => {
      if (this.state.title === item.title) {
        this.selectedIndex = index
        this.defaultPage = this.selectedIndex <= 0 ? 1 : Math.ceil((this.selectedIndex + 1) / this.pageNum)
        return true
      }
    })
    if (this.selectedIndex < 0) {
      $items.scrollTop(0)
      return
    }
    this.setState({
      data: this.state.dataTmp.slice(0, this.defaultPage * this.pageNum),
      selectedIndex: this.selectedIndex
    }, () => {
      if ($items.find('li').length === 0) {
        return
      }
      try {
        const scrollTop = $items.find('li').eq(this.selectedIndex)[0].offsetTop
        console.log($items.find('li').eq(this.selectedIndex)[0].offsetTop)
        $items.scrollTop(scrollTop - $items.find('li').eq(this.selectedIndex)[0].clientHeight * 3)
      } catch (e) {
        this.selectedIndex = 0
        const scrollTop = $items.find('li').eq(this.selectedIndex)[0].offsetTop
        console.log($items.find('li').eq(this.selectedIndex)[0].offsetTop)
        $items.scrollTop(scrollTop - $items.find('li').eq(this.selectedIndex)[0].clientHeight * 3)
      }
    })
  }
  public handleEnter () {
    if (this.props.disabled) {
      return
    }
    if (this.t) {
      clearTimeout(this.t)
    }
    let { results } = this.refs
    const { button } = this.refs
    $(button).find('.btn-right i').removeClass('pilipa-dropdown-arrow-down pilipa-dropdown-arrow-active')
    $(button).find('.btn-right i').addClass('pilipa-dropdown-arrow-up')
    $(button).find('.btn-right i').addClass('pilipa-dropdown-arrow-active')
    if (results) {
      this.scrollToSelectedPos()
      $(results).removeClass('custom-slide-up-leave')
      $(results).one('mouseover', () => {
        if (this.t) {
          clearTimeout(this.t)
        }
      })
      $(results).one('mouseleave', () => {
        this.handleLeave()
      })
      return
    }
    this.setState({
      visible: true
    }, () => {
      this.scrollToSelectedPos()
      results = this.refs.results
      $(results).removeClass('custom-slide-up-leave')
      $(results).addClass('custom-slide-up-enter')
      this.t = setTimeout(() => {
        $(results).removeClass('custom-slide-up-enter')
      }, 200)
      $(results).one('mouseover', () => {
        clearTimeout(this.t)
      })
      if (this.type === 'hover') {
        $(results).one('mouseleave', () => {
          this.handleLeave()
        })
      }
      this.onItemScroll()
    })
  }
  public onItemScroll () {
    const $dropdown = $(this.refs.dropdown)
    const results = this.refs.results
    // console.log($(results).children('.items'), 'itemScroll')
    $dropdown.find('.results .items').scroll((e) => {
      const scrollTop = e.target.scrollTop
      const h = $(results).find('ul').height()
      const ch = e.target.clientHeight
      // 显示区域离底部小于10px的时候
      // console.log(scrollTop + ch - h, h , scrollTop + ch > h - 10)
      if (scrollTop + ch > h - 10) {
        if (this.defaultPage < Math.ceil(this.state.dataTmp.length / this.pageNum)) {
          this.defaultPage += 1
          this.setState({
            data: this.state.dataTmp.slice(0, this.defaultPage * this.pageNum)
          })
        }
      }
    })
  }
  public handleLeave (delay = this.props.delay) {
    if (this.t) {
      clearTimeout(this.t)
    }
    delay = delay || 0
    const animation = this.props.animation !== undefined ? this.props.animation : true
    const { button, results } = this.refs
    if (!animation) {
      if (this.isDestroy) {
        return
      }
      this.handleAllData(this.props)
      this.seleted = false
      this.setState({
        visible: false,
        selectedIndex: this.selectedIndex,
        filterVal: '',
        data: this.allData.slice(0, this.pageNum * this.defaultPage),
        dataTmp: this.allData
      })
      return
    }
    this.t = setTimeout(() => {
      $(results).addClass('custom-slide-up-leave')
      $(button).find('.btn-right i').removeClass('pilipa-dropdown-arrow-up pilipa-dropdown-arrow-active')
      $(button).find('.btn-right i').addClass('pilipa-dropdown-arrow-down')
      $(button).find('.btn-right i').addClass('pilipa-dropdown-arrow-active')
      this.t = setTimeout(() => {
        if (this.isDestroy) {
          return
        }
        $(results).removeClass('custom-slide-up-leave')
        $(results).addClass('hidden')
        // this.defaultPage = this.selectedIndex <= 0 ? 1 : Math.ceil((this.selectedIndex + 1) / this.pageNum)
        this.handleAllData(this.props)
        this.seleted = false
        this.setState({
          visible: false,
          selectedIndex: this.selectedIndex,
          filterVal: '',
          data: this.allData.slice(0, this.pageNum * this.defaultPage),
          dataTmp: this.allData
        })
      }, 200)
    }, delay + 100)
  }
  public handleSelect (item: T, index: number) {
    item.index = index
    this.seleted = true
    this.selectedIndex = index
    const { callBack, onChange } = this.props
    this.setState({
      title: item.title,
      selectedIndex: index
    })
    this.defaultPage = index === 0 ? 1 : Math.ceil((index + 1) / this.pageNum)
    this.handleLeave(0)
    if (callBack) {
      setTimeout(() => {
        callBack(item)
      }, 301)
    }
    if (onChange) {
      setTimeout(() => {
        onChange(item)
      }, 301)
    }
  }
  public filterData () {
    const { allData } = this
    if (this.filterVal === '') {
      return allData
    }
    let pattern: RegExp = null
    try {
      pattern = new RegExp(this.filterVal, 'i')
    } catch (e) {
      pattern = new RegExp('', 'i')
    }
    const res = allData.filter((item: T, index): boolean => {
      if (pattern.test(item.title) || pattern.test(item.capital.join(','))) {
        return true
      }
    })
    return res || []
  }
  public handleChange (e: any) {
    clearTimeout(this.t)
    const $items = $(this.refs.results).find('.items')
    this.filterVal = e.target.value
    const { allData } = this
    const value: string = $(this.refs.input).val().toString()
    const res = this.filterData()
    $items.scrollTop(0)
    res.find((item, index) => {
      if (this.state.title === item.title) {
        this.selectedIndex = index
        return true
      }
    })
    this.defaultPage = 1
    this.setState({
      data: res.slice(0, this.pageNum),
      dataTmp: res,
      selectedIndex: -1,
      filterVal: this.filterVal
    })
  }
  public onMouseEnter (key: number) {
    if (this.seleted) {
      return
    }
    this.setState({
      selectedIndex: key
    })
  }
  public render () {
    const { className, style, filter } = this.props
    const { visible, data } = this.state
    let { title } = this.state
    title = title !== undefined ? title : this.allData.length && this.allData[0].title
    return (
      <div
        className={ClassNames(this.defaultCls, className, {
          disabled: this.props.disabled
        })}
        style={style}
        ref='dropdown'
      >
        <div className='costom-btn-group' ref='button'>
          <div className='btn-left'><span title={title}>{title}</span></div>
          <div className='btn-right'>
            <i className='fa fa-chevron-down' aria-hidden='true'></i>
          </div>
        </div>
        {
          visible && (
            <div
              className='results'
              ref='results'
              onMouseEnter={() => {
                clearTimeout(this.t)
              }}
              onMouseLeave={() => {
                if (this.type !== 'hover') {
                  return
                }
                this.handleLeave()
              }}
            >
              {
                filter &&
                <div className='input'>
                  <input
                    value={this.state.filterVal}
                    onChange={this.handleChange.bind(this)}
                    ref='input'
                  />
                </div>
              }
              { data.length === 0 && <p>未搜到结果</p> }
              <div className='items'>
                <ul>
                  {
                    data.length > 0 && (
                      data.map((item: T, key: number) => {
                        return (
                          <li
                            key={key}
                            className={ClassNames({
                              active: key === this.state.selectedIndex,
                              selected: key === this.selectedIndex
                            })}
                            title={item.title}
                            onClick={this.handleSelect.bind(this, item, key)}
                            onMouseEnter={this.onMouseEnter.bind(this, key)}
                          >
                            <span>{item.title}</span>
                          </li>
                        )
                      })
                    )
                  }
                </ul>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
