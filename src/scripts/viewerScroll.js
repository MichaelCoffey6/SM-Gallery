import { addScrollSnap } from "./addScrollSnap.js"

import { State, $, $$, app, addFavoriteBtn, imgViewerScroll, imgViewerSlider, videoControls, mainHeader, mainHeaderTitle, imgViewer, imgSubOpts, imgDetailsHeader } from "./const.js"
import { updateDetailsInfo } from "./imgViewer.js"
import { onVideoFocus } from "./videoPlayer.js"
import { navigate } from "./navigation.js"

export const onViewerPointerDown = () => State.verticalScroll = false

export const onViewerHorizontalSnap = (newMainView, prevMainView) => {
  $('#imgViewerMinImg')?.removeAttribute('id')
  $('#imgViewerImg')?.removeAttribute('id')

  const imgViewerImg = $('.imgViewerImg', newMainView)
  const imgViewerMinImg = $('.imgViewerMinImg', newMainView)
  imgViewerImg.id = "imgViewerImg"
  imgViewerMinImg.id = "imgViewerMinImg"

  const { imgGroupId, details, isVideo } = imgViewerImg.dataset
  const prevVideo = $('.imgViewerImg.video')
  const currPicture = $('.picture.view')
  const newPicture = $(`.picture[data-img-group-id="${imgGroupId}"]`)
  const newPictureImg = $('.pictureImg', newPicture)
  const currPreview = $('.pictureImg', currPicture)
  const newPreview = $('.pictureImg', newPicture)
  const action = newPictureImg.classList.contains('favorite') ? "add" : "remove"
  addFavoriteBtn.classList[action]('favorite')
  currPicture?.classList.remove('view')
  newPicture?.classList.add('view')
  currPreview.style.display = ""
  newPreview.style.display = "none"

  prevVideo?.proxy.pause?.()

  if (State.videoOpen = +isVideo) onVideoFocus(imgViewerImg, prevVideo)

  updateDetailsInfo(JSON.parse(details))
}

export const onViewerHorizontalSnapEnd = (newMainView, prevMainView, sameMainView) => {
  if (sameMainView) return

  if (prevMainView?.previousSibling)
    $('.imgViewerImg', prevMainView.previousSibling).style.display = "none"

  if (prevMainView?.nextSibling)
    $('.imgViewerImg', prevMainView.nextSibling).style.display = "none"

  if (newMainView.previousSibling)
    $('.imgViewerImg', newMainView.previousSibling).style.display = "block"

  if (newMainView.nextSibling)
    $('.imgViewerImg', newMainView.nextSibling).style.display = "block"

  $('.imgViewerImg', newMainView).style.display = "block"
}

export const onViewerScroll = () => {
  if (app.classList.contains('inTransition')) return

  const { innerHeight } = window
  const scrollBottom = imgViewer.scrollHeight - imgViewer.clientHeight
  const currScroll = Math.round(imgViewer.scrollTop)
  const opacityInverse = currScroll / 300
  const opacity = 1 - +opacityInverse.toFixed(2)

  if (!mainHeader.style.opacity) {
    const pointerEvents = opacity ? "auto" : "none"
    
    imgSubOpts.style.opacity = opacity
    imgSubOpts.style.pointerEvents = pointerEvents

    if (State.videoOpen) {
      videoControls.style.opacity = opacity
      videoControls.style.pointerEvents = pointerEvents
    }
  }
  //imgViewerImg.style.transform = opacity ? "translateY(" + ((innerHeight / 2) - ((innerHeight - currScroll) / 2)) + "px)" : ""

  if (currScroll < scrollBottom - 120) {
    mainHeader.style.backgroundColor = ""
    mainHeaderTitle.style.opacity = ""
    return
  }

  const detailsOpacity = (scrollBottom - 30 - currScroll) / 60
  imgDetailsHeader.style.opacity = detailsOpacity
  mainHeaderTitle.style.opacity = 1 - detailsOpacity
  mainHeader.style.backgroundColor = "#000"
}

export const onViewerVerticalSnapEnd = (_, a, isSameSection) => {
  const currScroll = Math.round(imgViewer.scrollTop)

  if (!isSameSection) {
    if (currScroll === 0) {
      history.back()
    } else {
      State.details.visible = true
      navigate({ details: true })
    }
  }

  const scrollBottom = imgViewer.scrollHeight - imgViewer.clientHeight
  const detailsOpacity = (scrollBottom - 30 - currScroll) / 60
  imgDetailsHeader.style.opacity = detailsOpacity
  mainHeaderTitle.style.opacity = 1 - detailsOpacity
  mainHeader.style.backgroundColor = currScroll ? "#000" : ""
}

export const viewerPictureConfig = {
  scrollCont: imgViewerScroll,
  initScrollChild: $('& > picture:not([hidden])', imgViewerScroll),
  mainScrollChildId: 'imgViewerMainView',
  onSnap: onViewerHorizontalSnap,
  onSnapEnd: onViewerHorizontalSnapEnd,
  getScrollChildren: () => Array.from($$('#imgViewerScroll > picture:not([hidden])')),
  evalException: () => State.details.visible || State.verticalScroll,
  onScroll: () => State.verticalScroll = false,
  onCancel: () => State.verticalScroll = true
}

const viewerSectionConfig = {
  vertical: true,
  scrollCont: imgViewer,
  initScrollChild: imgViewerSlider,
  onSnapEnd: onViewerVerticalSnapEnd,
  getScrollChildren: () => Array.from($$('#imgViewerSlider, #imgViewerInfo')),
  onCancel: () => State.verticalScroll = false
}

export const changeViewerSection = addScrollSnap(viewerSectionConfig)
export const changeViewerPicture = addScrollSnap(viewerPictureConfig)