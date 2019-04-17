class Carousel extends HTMLElement {
  constructor() {
    super()
    this.width = this.getAttribute('width') || '100%'
    this.height = this.getAttribute('height')
    this.mode = this.getAttribute('mode') || 'shallow'
    this.hasDots = this.getAttribute('has-dots') === 'true' || false
    this.hasArrows = this.getAttribute('has-arrows') === 'true' || false
    this.time = Number(this.getAttribute('time')) || 3000
    this.images = JSON.parse(this.innerText)
    this.imgLength = this.images.length
    this.innerText = ''
    this.setAttribute('index', '0')
    this.timer = null

    this.shadow = this.attachShadow({ mode: 'open' })
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('wrapper')

    this.imgWrapper = document.createElement('div')
    this.imgWrapper.classList.add('img-wrapper')
    this.wrapper.appendChild(this.imgWrapper)

    if (this.hasArrows) {
      const prevBtn = document.createElement('button')
      prevBtn.type = 'button'
      prevBtn.classList.add('btn')
      prevBtn.classList.add('prev')
      prevBtn.innerText = '←'
      const nextBtn = document.createElement('button')
      nextBtn.type = 'button'
      nextBtn.classList.add('btn')
      nextBtn.classList.add('next')
      nextBtn.innerText = '→'
      this.wrapper.appendChild(prevBtn)
      this.wrapper.appendChild(nextBtn)
    }

    if (this.hasDots) {
      const dotUl = document.createElement('ul')
      dotUl.classList.add('dotUl')
      for (let i = 0; i < this.images.length; i++) {
        const dot = document.createElement('span')
        dot.classList.add('dot')
        dot.dataset.index = i
        if (i === 0) {
          dot.classList.add('active')
        }
        dotUl.appendChild(dot)
      }
      this.wrapper.appendChild(dotUl)
    }

    this.css = document.createElement('style')
    this.css.textContent = `
      * {
        margin: 0;
        padding: 0;
        border: none;
      }
      .wrapper {
        overflow: hidden;
        position: relative;
        width: ${this.width};
        height: ${this.height};
      }
      .img-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
      }
      .prev {
        left: 0;
      }
      .next {
        right: 0;
      }
      .dotUl {
        display: flex;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translate(-50%);
        z-index: 1;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #F0FFFF;
        margin: 0 8px;
        cursor: pointer;
      }
      .dot:hover {
        background: #778899;
      }
      .active {
        background: #778899;
      }`
  }

  static get observedAttributes() { return ['index'] }

  connectedCallback() {
    this.load(this.mode)
    this.bindEvent()
    this.setTimer()
  }

  attributeChangedCallback() {
    this.updataImage(this.mode)
  }

  load(mode) {
    let load
    if (mode === 'shallow') {
      load = () => {
        this.css.textContent += `
        .img-wrapper {
          background-image: url(${this.images[this.getAttribute('index')]});
          background-position: center;
          background-size: cover;
          transition: opacity .5s ease-in;
          opacity: 1;
        }
        .btn {
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
          width: 8%;
          height: 25%;
          font-size: 0;
          background: transparent;
          z-index: 1;
          outline: none;
          cursor: pointer;
        }
        .btn:hover {
          font-size: 100%;
          background: rgba(119, 136, 153, 0.5);
        }`
        this.shadow.appendChild(this.css)
        this.shadow.appendChild(this.wrapper)
      }
    } else if (mode === 'scroll' || mode === 'stage') {
      load = () => {
        this.images.forEach((img, i) => {
          const div = document.createElement('div')
          div.classList.add('img')
          div.style.backgroundImage = `url(${img})`
          if (i === this.images.length - 1) div.classList.add('left')
          else if (i === 0) div.classList.add('now')
          else if (i === 1) div.classList.add('right')
          this.imgWrapper.appendChild(div)
        })
        this.css.textContent += `
          .img {
            position: absolute;
            background-position: center;
            background-size: cover;
            z-index: -2;
            transform: translate(0);
            transition: all .3s ease-in;
          }
          .btn {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            width: 8%;
            font-size: 0;
            background: transparent;
            z-index: 1;
            outline: none;
            cursor: pointer;
          }`
        if (mode === 'scroll') {
          this.css.textContent += `
            .img {
              width: 100%;
              height: 100%;
              top: 0;
            }
            .right {
              transform: translate(100%);
              z-index: -1;
            }
            .left {
              transform: translate(-100%);
              z-index: -1;
            }
            .now {
              z-index: 0;
            }
            .btn {
              height: 25%;
            }
            .btn:hover {
              font-size: 100%;
              background: rgba(119, 136, 153, 0.5);
            }`
        } else if (mode === 'stage') {
          this.css.textContent += `
            .img {
              width: 80%;
              height: 80%;
              bottom: 4%;
              border-radius: 8px;
              box-shadow: 20px 0 20px -20px #000, -20px 0 20px -20px #000;
            }
            .right {
              transform: translate(25%);
              z-index: -1;
            }
            .left {
              transform: translate(0);
              z-index: -1;
            }
            .now {
              height: 100%;
              bottom: 0;
              transform: translate(12.5%);
              z-index: 0;
            }
            .btn {
              height: 100%;
            }`
        }
        this.shadow.appendChild(this.css)
        this.shadow.appendChild(this.wrapper)
      }
    } else {
      load = () => {
        throw new Error('Mode selection error: Can only select shallow, scroll, stage or default mode')
      }
    }
    return load()
  }

  getClass(eleClass) {
    const getTheEleByClass = function (eleClass, root) {
      const nodes = root.children
      const len = root.children.length
      let ele
      for (let i = 0; i < len; i++) {
        if (nodes[i].classList.contains(eleClass)) {
          ele = nodes[i]
          break
        }
        if (nodes[i].children.length > 0) {
          ele = getTheEleByClass(eleClass, nodes[i]) || ele
        }
      }
      return ele
    }
    return getTheEleByClass(eleClass, this.wrapper)
  }

  updataImage(mode) {
    let updataImage
    if (mode === 'shallow') {
      updataImage = () => {
        // 读取 index 值，更新图片
        this.imgWrapper.style.opacity = 0
        setTimeout(() => {
          this.imgWrapper.style.backgroundImage = `url(${this.images[this.getAttribute('index')]})`
          this.imgWrapper.style.opacity = 1
        }, 500)
        // 更改 dot
        if (this.hasDots) {
          this.getClass('active').classList.remove('active')
          Array.from(this.getClass('dotUl').children)[this.getAttribute('index')].classList.add('active')
        }
      }
    } else if (mode === 'scroll' || mode === 'stage') {
      updataImage = () => {
        const now = this.getClass('now')
        const left = this.getClass('left')
        const right = this.getClass('right')
        const num = Number(this.getAttribute('index'))
        now.classList.remove('now')
        left.classList.remove('left')
        right.classList.remove('right')
        const nodeArr = Array.from(now.parentNode.children)

        nodeArr[num].classList.add('now')
        if (num === 0) {
          nodeArr[nodeArr.length - 1].classList.add('left')
          nodeArr[1].classList.add('right')
        } else if (num === nodeArr.length - 1) {
          nodeArr[nodeArr.length - 2].classList.add('left')
          nodeArr[0].classList.add('right')
        } else {
          nodeArr[num - 1].classList.add('left')
          nodeArr[num + 1].classList.add('right')
        }
        // 更改 dot
        if (this.hasDots) {
          this.getClass('active').classList.remove('active')
          Array.from(this.getClass('dotUl').children)[this.getAttribute('index')].classList.add('active')
        }
      }
    }
    return updataImage()
  }

  clickDot(event) {
    // 更改 index 属性的 值
    if (event.path[0].classList.contains('dot')) this.setAttribute('index', event.path[0].dataset.index)
  }

  prevOne() {
    let index = Number(this.getAttribute('index'))
    if (index === 0) {
      index = this.imgLength - 1
    } else {
      index -= 1
    }
    this.setAttribute('index', index)
  }

  nextOne() {
    let index = Number(this.getAttribute('index'))
    if (index === this.imgLength - 1) {
      index = 0
    } else {
      index += 1
    }
    this.setAttribute('index', index)
  }

  setTimer() {
    this.timer = setInterval(() => {
      this.nextOne()
    }, this.time)
  }

  clearTimer() {
    clearInterval(this.timer)
  }

  bindEvent() {
    this.wrapper.addEventListener('mouseenter', this.clearTimer.bind(this))
    this.wrapper.addEventListener('mouseleave', this.setTimer.bind(this))
    if (this.hasDots) {
      this.getClass('dotUl').addEventListener('click', this.clickDot.bind(this))
    }
    if (this.hasArrows) {
      this.getClass('next').addEventListener('click', this.nextOne.bind(this))
      this.getClass('prev').addEventListener('click', this.prevOne.bind(this))
    }
  }
}

customElements.define('h-carousel', Carousel)
