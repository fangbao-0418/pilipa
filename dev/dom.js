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
      width + padding + border ${$('.h').outerWidth()}
      height + padding + border ${$('.h').outerHeight()}
      content + padding + border + margin ${$('.h').outerHeight(true)}
      contentHeight ${$('.h').height()}
    `)
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
          style={{margin: '10px 0 12px', padding: 10, border: '1px solid #000'}}
        >
          <div>abc</div>
          <div>def</div>
        </div>
        <div className='abc'>b</div>
        <div className='d'>d</div>
        <div className='f'>trigger d click</div>
        <button onClick={this.toggle.bind(this)}>测试</button>
        <span className='info'></span>
      </div>
    )
  }
}
export default Main
