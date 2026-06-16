import { State, $, $$, app, moreOptsChk, pictures, albums, albumPics, imgViewer } from "./const.js"
import { updateImgViewSize } from "./imgViewer.js"
import { changeScreen } from "./navigation.js"

export const onWindowResize = () => {
  app.style.setProperty('--windowW', window.innerWidth)
  app.style.setProperty('--windowH', window.innerHeight)

  if (!State.imgOpen) return

  const imgViewerImg = $('#imgViewerImg')
  const imgViewerMinImg = $('#imgViewerMinImg')
  const initWidth = imgViewer.style.getPropertyValue('--initWidth')
  const initHeight = imgViewer.style.getPropertyValue('--initHeight')
  updateImgViewSize(initWidth, initHeight, imgViewerImg, imgViewerMinImg)
}

export const onAppScroll = () => {
  const currScroll = Math.round(app.scrollTop)
  const isMainTop = currScroll === 220
  const isTop = currScroll === 0
  const pointerEvents = isMainTop || isTop ? "auto" : "none"
  const overflow = isMainTop ? "auto" : "hidden"
  const action = isTop ? "add" : "remove"
  app.classList[action]('appHeaderOpen')
  app.style.setProperty('--curr-scroll', currScroll)
  //appHeaderInfo.style.bottom = (220 - currScroll) / 2 + "px"
  //appHeaderInfo.style.opacity = 1 - (currScroll / 110)
  pictures.style.pointerEvents = pointerEvents
  albums.style.pointerEvents = pointerEvents
  albumPics.style.pointerEvents = pointerEvents
  pictures.style.overflow = overflow
  albums.style.overflow = overflow
  albumPics.style.overflow = overflow
}

export const onMainClick = event => {
  moreOptsChk.checked = false
}

$$('button, label').forEach(btn => {
  btn.addEventListener('pointerdown', () => {
    btn.classList.add('hover')
  })

  btn.addEventListener('pointerup', () => {
    btn.classList.remove('hover')
  })

  btn.addEventListener('pointerleave', () => {
    btn.classList.remove('hover')
  })
})

$$('input[type=radio]').forEach(input => {
  const { id, name } = input
  const sibligs = document.getElementsByName(name)

  input.addEventListener('change', () => changeScreen(sibligs, input, name, id))
})