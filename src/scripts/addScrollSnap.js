export const addScrollSnap = config => {
  const {
    vertical,
    pointerCont,
    scrollCont,
    getScrollChildren,
    initScrollChild,
    mainScrollChildId = crypto.randomUUID(),
    onSnap = () => null,
    onSnapEnd = () => null,
    onScroll = () => null,
    evalException = () => false,
    onCancel = () => null
  } = config

  const SNAP_STATE = {
    hasScrollEnd: true,
    instant: true,
    sameScrollChild: false,
    prevScrollChild: null,
    nextScrollChild: null,
    scrollLeft: 0,
    scrollTop: 0,
    pointerInitX: 0,
    pointerInitY: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerDown: false,
    pointerType: {},
    instantScrollEnd: Promise.resolve()
  }

  const POINTER_TYPES = {
    mouse: 'mouse',
    touch: 'touch'
  }

  const CANCEL_EVENTS = {
    [TouchEvent.name]: () => new TouchEvent('touchend'),
    [MouseEvent.name]: () => new MouseEvent('mouseup')
  }
  
  const idAttr = "data-snap-id"
  
  const $ = sel => document.querySelector(sel)
  
  const checkPromiseStatus = prom => {
    const statusObj = { prom, pending: () => true }
    const changeStatus = () => statusObj.pending = () => false
    
    prom.then(changeStatus).catch(changeStatus)
    
    return statusObj
  }

  const changeMainScrollChild = (scrollChild, anim, onChange = () => null) => {
    const scrollChildren = getScrollChildren()
    const prevScrollChild = $(`[${idAttr}="${mainScrollChildId}"]`)
    const currIndex = scrollChildren.indexOf(scrollChild)
    const initScrollLeft = scrollCont.scrollWidth / scrollChildren.length * currIndex
    const initScrollTop = scrollCont.scrollHeight / scrollChildren.length * currIndex
    
    SNAP_STATE.sameScrollChild = false
    SNAP_STATE.prevScrollChild = prevScrollChild
    SNAP_STATE.nextScrollChild = scrollChild
    SNAP_STATE.pointerStartX = initScrollLeft
    SNAP_STATE.pointerStartY = initScrollTop
    SNAP_STATE.pointerInitX = initScrollLeft
    SNAP_STATE.pointerInitY = initScrollTop
    SNAP_STATE.scrollLeft = initScrollLeft
    SNAP_STATE.scrollTop = initScrollTop
    scrollCont.style.overflow = "hidden"
    scrollCont.style.overflowX = "hidden"
    scrollCont.style.overflowY = "hidden"
    
    prevScrollChild?.removeAttribute(idAttr)
    scrollChild.setAttribute(idAttr, mainScrollChildId)

    scrollCont.addEventListener('scrollend', onChange, { once: true })
    
    if (anim) {
      SNAP_STATE.instant = false
      
      scrollCont.scrollTo({
        top: initScrollTop,
        left: initScrollLeft,
        behavior: 'smooth'
      })
      
      return
    } 
    
    SNAP_STATE.instant = true
    scrollCont.scrollLeft = initScrollLeft
    scrollCont.scrollTop = initScrollTop
  }
  
  const cancelScroll = async (left, top) => {
    //SNAP_STATE.pointerInitX = pointerInitX
    //SNAP_STATE.pointerInitY = pointerInitY
    SNAP_STATE.sameScrollChild = true
    SNAP_STATE.instant = false
    
    const { pending, prom } = checkPromiseStatus(SNAP_STATE.instantScrollEnd)
    if (pending()) await prom
    
    scrollCont.addEventListener('scrollend', onScrollEnd, { once: true })

    scrollCont.scrollTo({
      left,
      top,
      behavior: 'smooth'
    })
  }
  
  const scrollToPrev = async mainScrollChild => {
    const scrollChildren = getScrollChildren()
    const currIndex = scrollChildren.indexOf(mainScrollChild)
    const prevScrollX = scrollCont.scrollWidth / scrollChildren.length * (currIndex - 1)
    const prevScrollY = scrollCont.scrollHeight / scrollChildren.length * (currIndex - 1)
    const prevScrollChild = scrollChildren[currIndex - 1]

    onSnap(prevScrollChild, mainScrollChild)

    SNAP_STATE.pointerInitX = prevScrollX
    SNAP_STATE.pointerInitY = prevScrollY
    SNAP_STATE.prevScrollChild = mainScrollChild
    SNAP_STATE.nextScrollChild = prevScrollChild
    SNAP_STATE.sameScrollChild = false
    SNAP_STATE.instant = false
    mainScrollChild?.removeAttribute(idAttr)
    prevScrollChild.setAttribute(idAttr, mainScrollChildId)
    
    const { pending, prom } = checkPromiseStatus(SNAP_STATE.instantScrollEnd)
    if (pending()) await prom
    
    scrollCont.addEventListener('scrollend', onScrollEnd, { once: true })

    scrollCont.scrollTo({
      left: prevScrollX,
      top: prevScrollY,
      behavior: 'smooth'
    })
  }
  
  const scrollToNext = async mainScrollChild => {
    const scrollChildren = getScrollChildren()
    const currIndex = scrollChildren.indexOf(mainScrollChild)
    const nextScrollX = scrollCont.scrollWidth / scrollChildren.length * (currIndex + 1)
    const nextScrollY = scrollCont.scrollHeight / scrollChildren.length * (currIndex + 1)
    const nextScrollChild = scrollChildren[currIndex + 1]

    onSnap(nextScrollChild, mainScrollChild)

    SNAP_STATE.pointerInitX = nextScrollX
    SNAP_STATE.pointerInitY = nextScrollY
    SNAP_STATE.prevScrollChild = mainScrollChild
    SNAP_STATE.nextScrollChild = nextScrollChild
    SNAP_STATE.sameScrollChild = false
    SNAP_STATE.instant = false
    mainScrollChild?.removeAttribute(idAttr)
    nextScrollChild.setAttribute(idAttr, mainScrollChildId)
    
    const scrollEndStatus = checkPromiseStatus(SNAP_STATE.instantScrollEnd)
    if (scrollEndStatus.pending()) await SNAP_STATE.instantScrollEnd
    
    scrollCont.addEventListener('scrollend', onScrollEnd, { once: true })
    
    scrollCont.scrollTo({
      left: nextScrollX,
      top: nextScrollY,
      behavior: 'smooth'
    })
  }
  
  const handleScrollTo = (currScroll, pointerInit) => {
    const { pointerInitX, pointerInitY } = SNAP_STATE
    const mainScrollChild = $(`[${idAttr}="${mainScrollChildId}"]`)
    
    const { x, y } = mainScrollChild.getBoundingClientRect()
    const currMainScroll = vertical ? y : x
    
    if (currScroll < pointerInit) {
      if (currMainScroll < 50) {
        cancelScroll(pointerInitX, pointerInitY)
        return
      }

      scrollToPrev(mainScrollChild)
      return
    }

    if (currMainScroll > -50) {
      cancelScroll(pointerInitX, pointerInitY)
      return
    }

    scrollToNext(mainScrollChild)
  }

  const onPointerDown = ({ pointerType, clientX, clientY }) => {
    const scrollChildren = getScrollChildren()

    if (scrollChildren.length === 1) return

    SNAP_STATE.pointerType = pointerType === POINTER_TYPES.touch ? TouchEvent : MouseEvent
    SNAP_STATE.pointerStartX = Math.round(clientX)
    SNAP_STATE.pointerStartY = Math.round(clientY)
    SNAP_STATE.pointerDown = true
    SNAP_STATE.hasScrollEnd = false
  }

  const onPointerMove = event => {
    const { touches, constructor } = event

    const {
      pointerInitX,
      pointerInitY,
      pointerStartX,
      pointerStartY,
      pointerType,
      pointerDown
    } = SNAP_STATE

    const { clientX, clientY } = pointerType === TouchEvent
      ? touches[0]
      : event

    const width = clientX - pointerStartX
    const height = clientY - pointerStartY
    const sin = width / Math.hypot(width, height)
    const angle90 = 360 / (2 * Math.PI) * Math.asin(sin)
    const angleAbs = Math.abs(angle90)
    
    const cancelPointer = () => {
      const cancelEvent = CANCEL_EVENTS[pointerType.name]()
      onPointerUp(cancelEvent)
      onCancel()
    }
    
    if (vertical) {
      if (angleAbs > 45) {
        cancelPointer()
        return
      }
    } else if (angleAbs < 45) {
      cancelPointer()
      return
    }
    
    if (evalException()) {
      cancelPointer()
      return
    }

    if (pointerType !== constructor || !pointerDown) {
      return
    }

    const remainingScrollLeft = scrollCont.scrollWidth - scrollCont.clientWidth
    const remainingScrollTop = scrollCont.scrollHeight - scrollCont.clientHeight
    const scrollLeftCalc = pointerInitX - (Math.round(clientX) - pointerStartX)
    const scrollTopCalc = pointerInitY - (Math.round(clientY) - pointerStartY)

    const scrollLeft = scrollLeftCalc < 0 ? 0
      : scrollLeftCalc > remainingScrollLeft ? remainingScrollLeft
        : scrollLeftCalc

    const scrollTop = scrollTopCalc < 0 ? 0
      : scrollTopCalc > remainingScrollTop ? remainingScrollTop
        : scrollTopCalc

    SNAP_STATE.instant = true
    SNAP_STATE.scrollLeft = scrollLeft
    SNAP_STATE.scrollTop = scrollTop
    
    SNAP_STATE.instantScrollEnd = new Promise(resolve => {
      scrollCont.addEventListener('scrollend', resolve, { once: true })
      setTimeout(resolve, 200)
    })
    
    if (vertical) scrollCont.scrollTop = scrollTop
    else scrollCont.scrollLeft = scrollLeft
    
    SNAP_STATE.instant = true
    
    onScroll()
  }

  const onPointerUp = ({ constructor }) => {
    const { 
      scrollLeft,
      scrollTop,
      pointerInitX,
      pointerInitY,
      pointerType, 
      pointerDown
    } = SNAP_STATE

    if (pointerType !== constructor || !pointerDown) return

    SNAP_STATE.pointerDown = false

    if (vertical) {
      handleScrollTo(scrollTop, pointerInitY)
      return
    }

    handleScrollTo(scrollLeft, pointerInitX)
  }

  const onScrollEnd = () => {
    const { 
      instant, 
      nextScrollChild,
      prevScrollChild,
      sameScrollChild, 
      hasScrollEnd
    } = SNAP_STATE
    
    if (instant) return
    
    //SNAP_STATE.hasScrollEnd = true
    onSnapEnd(nextScrollChild, prevScrollChild, sameScrollChild)
  }

  scrollCont.addEventListener('pointerdown', onPointerDown)
  scrollCont.addEventListener('touchmove', onPointerMove)
  scrollCont.addEventListener('touchend', onPointerUp)
  //scrollCont.addEventListener('scrollend', onScrollEnd)

  initScrollChild && changeMainScrollChild(initScrollChild)

  return changeMainScrollChild
}