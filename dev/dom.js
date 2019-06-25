import React from 'react'
import $ from '../components/dom'
class Main extends React.Component {
  constructor () {
    super()
    this.clicked = false
  }
  componentDidMount () {
    /**
     * event test
     */
    $('.abc').one('click', (e) => {
      console.log(this, e, 'click')
    })
    const func = (e) => {
      console.log(this, e.target, 'click')
      $(document).off('click', func)
    }
    $(document).on('click', func)
    $('.f').click(() => {
      $('.d').trigger('click')
      $('.d').trigger('abc', 2, '2')
    })
    $('.d').on('abc', (e) => {
      console.log(e, 'abc')
    })
    $('.d').off('abc')
    /**
     * dom操作
     */
    $('.d').append('<input >').find('input').val('222')
    console.log($('input').val())
    var el = $('<div class="abc"/>')
    $('div, h3').append(el)
    $('.box').append(el)
    console.log($('.box').append($('<div>123333</div>')))
    console.log($('div').find('span'), 'find')
    $('div').addClass('abcedf 123').removeClass('abcedf 123')
    console.log($('div').parent(), 'parents')
    // console.log(decodeURIComponent($.param({
    //   a: {s: /\w/},
    //   b: {a: new Date(), c: null},
    //   c: {},
    //   d: null,
    //   f: 0,
    //   e: ''
    // })), 'param')
    $('.info').text(`
      元素 .h
      width + padding + border ${$('.h').outerWidth()}
      height + padding + border ${$('.h').outerHeight()}
      width + padding + border + margin ${$('.h').outerWidth(true)}
      height + padding + border + margin ${$('.h').outerHeight(true)}
      content width ${$('.h').width()}
      content height ${$('.h').height()}
    `)
    console.log($('.g').height(), '隐藏div高度')
  }
  toggle () {
    !this.clicked ? $('.abc').fadeOut() : $('.abc').fadeIn()
    this.clicked = !this.clicked
  }
  render () {
    return (
      <div className='box'>
        <div
          className='h'
          style={{
            // boxSizing: 'border-box',
            boxSizing: 'content-box',
            // display: 'none',
            height: 100,
            margin: '10px 8px 12px',
            padding: 10,
            border: '1px solid #000'
          }}
        >
          <div>abc</div>
          <div>def</div>
        </div>
        <div className='abc'>b</div>
        <div className='d'>d</div>
        <div className='f'>trigger d click</div>
        <div
          className='g'
          style={{
            width: 100,
            // height: 100,
            display: 'none'
          }}
        >隐藏盒子</div>
        <button onClick={this.toggle.bind(this)}>测试</button>
        <span className='info'></span>
        <button onClick={() => {
          $('.h').slideUp()
          // if ($('.h')) {
          //   $('.h').slideUp()
          // } else {
          //   $('.h').slideDown()
          // }
        }}>slideUp</button>
        <button onClick={() => {
          $('.h').slideDown()
          // if ($('.h')) {
          //   $('.h').slideUp()
          // } else {
          //   $('.h').slideDown()
          // }
        }}>slideDown</button>
      </div>
    )
  }
}
export default Main
