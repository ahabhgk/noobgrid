/* eslint-disable no-param-reassign */
const drop = document.querySelector('.drop')
const barLinksWrap = document.querySelector('.bar-links-wrap')
const logo = document.querySelector('.logo')
const navMain = document.querySelector('.nav-main')
const linkHeight = document.querySelector('.bar-links').offsetHeight
const navHeight = document.querySelector('.nav-main>div').offsetHeight * 2
const linkNum = document.querySelectorAll('.bar-links').length
const navNum = document.querySelectorAll('.nav-main a').length

function dropper(height, it, num) {
  let isHidden = true
  function dropIt() {
    if (isHidden) {
      it.style.height = `${height * num}px`
      isHidden = false
    } else {
      it.style.height = '0px'
      isHidden = true
    }
  }
  return dropIt
}

drop.addEventListener('touchstart', dropper(linkHeight, barLinksWrap, linkNum))
logo.addEventListener('touchstart', dropper(navHeight, navMain, navNum))
