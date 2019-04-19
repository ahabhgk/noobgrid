/* eslint-disable no-param-reassign */
const drop = document.querySelector('.drop')
const barLinksWrap = document.querySelector('.bar-links-wrap')
const logo = document.querySelector('.logo')
const navMain = document.querySelector('.nav-main')
const navHeight = document.querySelector('.nav-main>div').offsetHeight * 2
const navLength = document.querySelectorAll('.nav-main a').length * navHeight

function dropper(direction, length, it) {
  let isHidden = true
  function dropIt() {
    if (isHidden) {
      it.style[direction] = length
      isHidden = false
    } else {
      it.style[direction] = '0px'
      isHidden = true
    }
  }
  return dropIt
}

if (window.screen.width <= 414) {
  logo.addEventListener('touchstart', dropper('height', `${navLength}px`, navMain))
}
drop.addEventListener('touchstart', dropper('width', '70vw', barLinksWrap))

function stopMove() {
  let isMovable = true
  return function () {
    if (isMovable === true) {
      document.body.style.overflow = 'hidden'
      isMovable = false
    } else {
      document.body.style.overflow = 'auto'
      isMovable = true
    }
  }
}

drop.addEventListener('touchstart', stopMove())
