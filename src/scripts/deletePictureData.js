import { State, $, cl, app, imgViewerScroll } from "./const.js"
import { onViewerHorizontalSnap, changeViewerPicture } from "./viewerScroll.js"

export const deletePictureData = picture => {
  const { pics, imgs, files, albumsPicturesSel } = State
  const { imgGroupId, absolutePath } = picture.dataset
  const [, fileObj] = files[imgGroupId]
  const uintProm = imgs[absolutePath]
  const currPicture = pics[absolutePath]
  const importFile = $(`.importFile[data-img-group-id="${imgGroupId}"]`)
  const importPicture = $(`.importPicture[data-img-group-id="${imgGroupId}"]`)
  const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement
  const newMainView = viewPicture.previousSibling
  const prevMainView = viewPicture.nextSibling
  
  State.files = Object.fromEntries(
    Object.entries(files).filter(([, file]) => file !== fileObj)
  )

  State.imgs = Object.fromEntries(
    Object.entries(imgs).filter(([, uint]) => uint !== uintProm)
  )

  State.pics = Object.fromEntries(
    Object.entries(pics).filter(([, pic]) => pic !== picture)
  )

  importFile?.remove()
  importPicture?.remove()

  if (!app.classList.contains('imgView')) {
    picture.remove()
    viewPicture.remove()
    return
  }

  onViewerHorizontalSnap(newMainView, prevMainView)
  imgViewerScroll.style.pointerEvents = "none"

  changeViewerPicture(newMainView, true, () => {
    imgViewerScroll.style.pointerEvents = ""
    picture.remove()
    viewPicture.remove()
  })
}