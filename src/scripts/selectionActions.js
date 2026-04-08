import { State, $, $$, https, deleteConfirmation } from "./const.js"
import { FILETYPES } from "./types.js"
import { arr, tryP } from "./utils.js"
import { deletePictureData } from "./deletePictureData.js"
import { confirmation } from "./popup.js"

export const shareSelection = () => {
  navigation.back()

  if (location.protocol !== https) {
    alert('The protocol of this page doesn\'t support the Web Share API.')
    return
  }

  if (!('share' in navigator)) {
    alert('Your browser doesn\'t support the Web Share API.')
    return
  }

  const files = arr($$('.picture.selected, .albumCont.selected, .importFile.selected, .importPicture.selected')).map(container => {
    if (container.classList.contains('albumCont') || container.classList.contains('importFile')) {
      const { albumPath } = container.dataset
      const picturesCont = arr($$(`.picture[data-album-path="${albumPath}"]`))

      return picturesCont.map(({ dataset }) => {
        const { imgGroupId } = dataset
        const [, fileObj] = State.files[imgGroupId]
        return fileObj
      })
    }

    if (container.classList.contains('picture') || container.classList.contains('importPicture')) {
      const { imgGroupId } = container.dataset
      const [, fileObj] = State.files[imgGroupId]
      return fileObj
    }
  }).flat()

  if (!navigator.canShare({ files })) {
    alert('Your system doesn\'t support sharing these files.')
    return
  }

  navigator.share({
    files,
    title: `${files.length} files`
  })
}

export const deleteSelection = async () => {
  let fileType = 'item(s)'
  const albumsSel = $$('.albumCont.selected, .importFile.selected')
  const popupFixed = deleteConfirmation.parentElement
  const lengthCont = $('.lengthCont', deleteConfirmation)
  const fileTypeCont = $('.fileTypeCont', deleteConfirmation)

  const picturesSelected = arr($$('.picture.selected, .albumCont.selected, .importFile.selected, .importPicture.selected')).map(container => {
    if (container.classList.contains('albumCont') || container.classList.contains('importFile')) {
      const { albumPath } = container.dataset
      const picturesCont = $$(`.picture[data-album-path="${albumPath}"]`)
      return Array.from(picturesCont)
    }

    if (container.classList.contains('picture') || container.classList.contains('importPicture')) {
      const { imgGroupId } = container.dataset
      return $(`.picture[data-img-group-id="${imgGroupId}"]`)
    }
  }).flat()

  const isSameType = picturesSelected.reduce((arr, { dataset }) => {
    const { imgGroupId } = dataset
    const [, fileObj] = State.files[imgGroupId]
    const [fileType] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type))

    !arr.includes(fileType) && arr.push(fileType)
    return arr
  }, []).length === 1

  if (isSameType) {
    const [picture] = picturesSelected
    const { imgGroupId } = picture.dataset
    const [, fileObj] = State.files[imgGroupId]
    const [formatType] = Object.entries(FILETYPES).find(([, types]) => types.includes(fileObj.type))
    fileType = `${formatType}(s)`
  }

  lengthCont.innerText = picturesSelected.length
  fileTypeCont.innerText = fileType
  popupFixed.hidden = false

  /*try {
    await confirmation(popupFixed, fileType)
  } catch {
    return
  } finally {
    navigation.back()
    popupFixed.hidden = true
  }*/
  
  const [ , cancel ] = await tryP(confirmation(popupFixed, fileType))
  navigation.back()
  popupFixed.hidden = true
  
  if (cancel) return

  if (albumsSel.length) {
    albumsSel.forEach(album => {
      if (album.classList.contains('importFile')) {
        const { albumPath } = album.dataset
        const albumCont = $(`.albumCont[data-album-path="${albumPath}"]`)
        albumCont.remove()
      }

      album.remove()
    })
  }

  picturesSelected.forEach(deletePictureData)
  
  $$('.picturesSection').forEach(picturesSection => {
    const picturesOfTheDate = $('.picturesOfTheDate', picturesSection)
    if (!picturesOfTheDate.children.length) picturesSection.remove()
  })
}