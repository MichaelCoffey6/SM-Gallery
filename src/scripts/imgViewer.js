import { State, $, app, imgViewerInfo, videoControls, addFavoriteBtn, imgViewer, imgSubOpts, mainHeader, navigationBar, imgDate, imgName, imgPath, imgLength, imgSize } from "./const.js"
import { convertBytes, tryP } from "./utils.js"
import { viewerPictureConfig, onViewerVerticalSnapEnd, changeViewerPicture, changeViewerSection } from "./viewerScroll.js"
import { navigate } from "./navigation.js"
import { onVideoFocus } from "./videoPlayer.js"

export const updateImgViewSize = (imageWidth, imageHeight, img, minImg) => {
  const {
    innerWidth: containerWidth,
    innerHeight: containerHeight
  } = window

  if (imageWidth / imageHeight > containerWidth / containerHeight) {
    img.style.width = "100%"
    img.style.height = ""

    if (minImg) {
      minImg.style.width = "100%"
      minImg.style.height = ""
    }
  } else {
    img.style.width = ""
    img.style.height = "100%"

    if (minImg) {
      minImg.style.width = ""
      minImg.style.height = "100%"
    }
  }
}

export const updateDetailsInfo = ({ date, length, size, albumPath, fileName }) => {
  imgDate.innerText = date
  imgName.innerText = fileName
  imgPath.innerText = albumPath
  imgLength.innerText = convertBytes(length)
  imgSize.innerText = size
}

export const openDetails = () => {
  changeViewerSection(imgViewerInfo, true, onViewerVerticalSnapEnd)
}

export const onViewerClick = () => {
  if (mainHeader.style.opacity) {
    mainHeader.addEventListener('transitionend', () => {
      videoControls.style.pointerEvents = ""
      mainHeader.style.pointerEvents = ""
      imgSubOpts.style.pointerEvents = "auto"
    }, { once: true })

    videoControls.style.opacity = ""
    mainHeader.style.opacity = ""
    imgSubOpts.style.opacity = "1"
    return
  }

  videoControls.style.opacity = "0"
  mainHeader.style.opacity = "0"
  imgSubOpts.style.opacity = "0"
  videoControls.style.pointerEvents = "none"
  mainHeader.style.pointerEvents = "none"
  imgSubOpts.style.pointerEvents = "none"
}

export const onPictureClose = async () => {
  const imgViewerImg = $('#imgViewerImg')
  const imgViewerMinImg = $('#imgViewerMinImg')
  const picture = $('.picture.view')
  const img = $('.pictureImg', picture)
  const viewPicture = $(`[data-snap-id="${viewerPictureConfig.mainScrollChildId}"]`)
  const prevVideo = $('.imgViewerImg.video')

  if (viewPicture.previousSibling) $('.imgViewerImg', viewPicture.previousSibling).style.display = "none"
  if (viewPicture.nextSibling) $('.imgViewerImg', viewPicture.nextSibling).style.display = "none"

  if (prevVideo) {
    if (!document.pictureInPictureElement) {
      prevVideo.proxy.pause()
      prevVideo.currentTime = 0
    }

    imgViewerImg.style.display = "none"
    imgViewerMinImg.style.display = "block"
  }

  app.scrollTop = 220
  app.classList.add('inTransition')
  addFavoriteBtn.classList.remove('favorite')

  videoControls.style.opacity = ""
  mainHeader.style.opacity = ""
  videoControls.style.pointerEvents = ""
  mainHeader.style.pointerEvents = ""

  await document.startViewTransition(() => {
    img.style.display = "block"
    imgViewerImg.style.display = "none"
    imgViewerMinImg.style.display = "none"
    imgViewer.style.opacity = 0
    navigationBar.style.opacity = 1
    imgSubOpts.style.opacity = 0
    imgSubOpts.style.pointerEvents = "none"
  }).finished

  //imgViewerImg.style.cssText = ""

  imgViewer.scrollTop = 0
  imgViewer.style.pointerEvents = ""
  imgSubOpts.style.pointerEvents = ""
  app.classList.remove('imgView')
  app.classList.remove('inTransition')
  picture.classList.remove('view')
  State.imgOpen = false
}

export const onPictureClick = async ({ 
  img, 
  bigImg, 
  minImg,
  picture,
  viewPicture, 
  isVideo, 
  details, 
  initWidth, 
  initHeight
}) => {
  if (State.selectionMode) return

  if (img.classList.contains('favorite')) {
    addFavoriteBtn.classList.add('favorite')
  }

  changeViewerPicture(viewPicture)

  const prevVideo = $('.imgViewerImg.video')
  $('.picture.view')?.classList.remove('view')
  $('#imgViewerImg')?.removeAttribute('id')
  $('#imgViewerMinImg')?.removeAttribute('id')

  if (viewPicture.previousSibling) $('.imgViewerImg', viewPicture.previousSibling).style.display = "block"
  if (viewPicture.nextSibling) $('.imgViewerImg', viewPicture.nextSibling).style.display = "block"

  if (isVideo) {
    onVideoFocus(bigImg, prevVideo)

    if (!document.pictureInPictureElement) {
      bigImg.proxy.pause()
      bigImg.currentTime = 0
    }
  }

  app.classList.add('imgView')
  picture.classList.add('view')
  bigImg.id = "imgViewerImg"
  minImg.id = "imgViewerMinImg"
  minImg.style.display = "none"

  imgViewer.style.setProperty('--initWidth', initWidth)
  imgViewer.style.setProperty('--initHeight', initHeight)
  imgViewer.style.pointerEvents = "auto"
  imgSubOpts.style.pointerEvents = "auto"
  State.imgOpen = true

  updateDetailsInfo(details)
  updateImgViewSize(initWidth, initHeight, bigImg, minImg)
  navigate({ view: true })

  await document.startViewTransition(() => {
    img.style.display = "none"
    minImg.style.display = "block"
    //imgViewerImg.style.display = "block"
    imgViewer.style.opacity = 1
    imgSubOpts.style.opacity = 1
    navigationBar.style.opacity = 0
  }).finished

  await tryP(bigImg.decode())

  minImg.style.display = "none"
  bigImg.style.display = "block"
}