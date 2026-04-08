import { State, $, $$, cl, app, appHeaderText, mainHeader, imgViewer, videoControls, navigationBar, addFavoriteBtn, selectedCount, selectAll, moreOptsChk, pictures, albums, albumPics, imports, imgViewerSlider, imgSubOpts } from "./const.js"
import { sortPicsByDate } from "./sortGallery.js"
import { changeViewerSection } from "./viewerScroll.js"
import { closeSelectionMode } from "./selection.js"
import { onPictureClose } from "./imgViewer.js"

export const closeAlbum = () => {
  appHeaderText.innerText = "Albums"
  app.classList.remove('albumOpen')
  $('.albumCont.open')?.classList.remove('open')

  app.scrollTo({
    top: 220,
    behavior: app.scrollTop ? 'instant' : 'smooth'
  })

  for (const picture of $$('.picture')) {
    const { day } = picture.dataset
    const { imgGroupId } = $('.pictureImg', picture).dataset
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement
    const picByDateCont = $(`.picturesSection[data-day="${day}"] .picturesOfTheDate`)
    picture.hidden = viewPicture.hidden = false
    picByDateCont.append(picture)
  }

  sortPicsByDate()
}

export const onBackPage = () => {
  if (navigation.canGoBack) {
    navigation.back()
  }
}

export const onPopState = (event) => {
  const inTransition = app.classList.contains('inTransition')
  const imgOpen = app.classList.contains('imgView')
  const albumOpen = app.classList.contains('albumOpen')

  moreOptsChk.checked = false

  if (app.classList.contains('imports')) {
    app.classList.remove('imports')

    for (const pictureImg of $$('.importPicture .pictureImg')) {
      const { imgGroupId } = pictureImg.dataset
      const picture = $(`.picture[data-img-group-id="${imgGroupId}"]`)
      picture.append(pictureImg)
    }

    return
  }

  if (State.details.visible) {
    State.details.visible = false
    changeViewerSection(imgViewerSlider, true)
    return
  }

  if (State.selectionMode) {
    closeSelectionMode()
    return
  }

  if (inTransition && albumOpen) {
    closeAlbum()
    return
  }

  if (imgOpen) {
    onPictureClose()
    return
  }

  if (albumOpen) {
    closeAlbum()
  }
}