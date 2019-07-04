import React from 'react'
import $ from '../components/dom'
import './styles/dom'
class Main extends React.Component {
  constructor () {
    super()
    this.clicked = false
  }
  componentDidMount () {
    this.registerEvent()
  }
  registerEvent () {
    /**
     * event test
     */
    $('.abc').one('click', function (e) {
      console.log(this, e, 'click')
    })
    // const func = (e) => {
    //   console.log(this, e.target, 'click')
    //   $(document).off('click', func)
    // }
    // $(document).on('click', func)
    // $('.d').on('abc', (e) => {
    //   alert('.d abc event is trigger')
    //   // $('.d').off('abc')
    // })
    // $('.d').on('click', (e) => {
    //   alert('.d is clicked')
    //   $('.d').off('click')
    // })
    // // $('.d .abc').on('click', (e) => {
    // //   alert('.abc is clicked')
    // // })
    // $('.f').click(() => {
    //   alert('.f is clicked')
    //   $('.d').trigger('click')
    //   $('.d').trigger('abc', 2, '2')
    // })
    $('.ff').click(function (e) {
      console.log(e, this, '.ff click')
    })
  }
  toggle () {
    !this.clicked ? $('.g').fadeOut(1000) : $('.g').fadeIn(1000)
    this.clicked = !this.clicked
  }
  render () {
    return (
      <div className='dom box'>
        <h3>dom测试</h3>
        <div
          className='content'
        >
          <div id='box_010'></div>
          <button
            onClick={() => {
              $('#box_010').append('<input >').find('input').val('222')
            }}
          >添加一个input</button>
          <button
            onClick={() => {
              alert($('#box_010').find('input').val())
            }}
          >获取input的value</button>
        </div>
        <h3>Event 测试</h3>
        <div
          className='content'
        >
          <div className='d'>
            d
            <div className='abc'>abc</div>
          </div>
          <div className='f'>trigger d click</div>
          <div
            className='ff'
          >
            <div>
              测试click
            </div>
          </div>
        </div>
        <h3>fadeIn fadeOut 测试</h3>
        <div
          className='content'
        >
          <div
            className='g'
            style={{
              width: 100,
              height: 100,
              background: 'red'
            }}
          ></div>
          <button onClick={this.toggle.bind(this)}>测试</button>
        </div>
        <h3>width height outerHeight outerWidth测试</h3>
        <div className='content'>
          <button
            onClick={() => {
              $('.info').text(`
                width + padding + border ${$('.h').outerWidth()}
                height + padding + border ${$('.h').outerHeight()}
                width + padding + border + margin ${$('.h').outerWidth(true)}
                height + padding + border + margin ${$('.h').outerHeight(true)}
                content width ${$('.h').width()}
                content height ${$('.h').height()}
              `)
            }}
          >获取宽高信息</button>
          <div
            className='h'
            style={{
              // boxSizing: 'border-box',
              boxSizing: 'content-box',
              display: 'none',
              height: 100,
              margin: '10px 8px 12px',
              padding: 10,
              border: '1px solid #000',
              background: 'red'
            }}
          >
            <div>abc</div>
            <div>def</div>
          </div>
          <span className='info'></span>
        </div>
        <h3>样式测试</h3>
        <span className='text1' style={{marginRight: 10}}>测试字体</span>
        <span className='text2'>测试字体</span>
        <br />
        <button
          onClick={() => {
            $('.text1').css({
              color: 'red'
            })
          }}
        >
          改变颜色
        </button>
        <button
          onClick={() => {
            $('.text2').css('font-size', '12px')
          }}
        >
          改变字体大小
        </button>
        <button
          onClick={() => {
            alert($('.text2').css('font-size'))
          }}
        >
          获取样式结果
        </button>
        <button
          onClick={() => {
            $('.text1, .text2').css({
              fontSize: '',
              color: ''
            })
          }}
        >
          还原
        </button>
        <h3>slideDown slideUp 测试</h3>
        <div className='content content11'>
          <button onClick={() => {
            $('.content11').find('.box_1').slideUp(1000, 'easeInOutBack', () => {
              // alert('slideUp ok')
            })
          }}>slideUp</button>
          <button onClick={() => {
            $('.content11').children('.box_1').slideDown(200)
          }}>slideDown</button>
          <div
            className='box_1'
            style={{
              // width: 100,
              // height: 100,
              background: 'red'
              // margin: 10,
              // pdding: 10,
              // border: '1px solid #000'
              // display: 'none'
            }}
          >
            <div>
              <div>刻字管理</div>
              <div>刻字管理</div>
              <div>刻字管理</div>
              <div>刻字管理</div>
              <div>刻字管理</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Main
