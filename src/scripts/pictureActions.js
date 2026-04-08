import { State, $, $$, https, favoritesName, addFavoriteBtn, deleteConfirmation } from "./const.js"
import { FILETYPES } from "./types.js"
import { tryP } from "./utils.js"
import { confirmation } from "./popup.js"
import { deletePictureData } from "./deletePictureData.js"

export const toggleFavoritePicture = () => {
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`)
  const img = $('.picture.view .pictureImg')
  img.classList.toggle('favorite')
  addFavoriteBtn.classList.toggle('favorite')

  const albumLength = $('.albumLength', favoritesAlbum)
  const favorites = $$('.pictureImg.favorite')
  albumLength.innerText = favorites.length

  favoritesAlbum.hidden = !(favorites.length > 0)
}

export const sharePicture = () => {
  if (location.protocol !== https) {
    alert('The protocol of this page doesn\'t support the Web Share API.')
    return
  }

  if (!('share' in navigator)) {
    alert('Your browser doesn\'t support the Web Share API.')
    return
  }

  const pictureImg = $('.picture.view .pictureImg')
  const { imgGroupId } = pictureImg.dataset
  const [, fileObj] = State.files[imgGroupId]
  const { name } = fileObj
  const files = [fileObj]

  if (!navigator.canShare({ files })) {
    alert('Your system doesn\'t support sharing these files.')
    return
  }

  navigator.share({ files, title: name })
}

export const deletePicture = async () => {
  const picture = $('.picture.view')
  const { imgGroupId } = picture.dataset
  const [, fileObj] = State.files[imgGroupId]
  const [fileType] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type))

  const popupFixed = deleteConfirmation.parentElement
  const lengthCont = $('.lengthCont', deleteConfirmation)
  const fileTypeCont = $('.fileTypeCont', deleteConfirmation)
  lengthCont.innerText = 1
  fileTypeCont.innerText = fileType
  popupFixed.hidden = false

  const [ , cancel ] = await tryP(confirmation(popupFixed, fileType))
  popupFixed.hidden = true
  
  if (cancel) return

  deletePictureData(picture)
}