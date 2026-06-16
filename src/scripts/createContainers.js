import { $, cl, State, app, currYear, currDay, picturesTmpl, albumTmpl, pictures, albums, albumPics } from "./const.js"
import { tryP } from "./utils.js"
import { toggleMultipleSelection } from "./selection.js"

export const createPictureElement = ({ picture, albumPath, day, time, year }) => {
  const picturesElement = $(`.picturesSection[data-day="${day}"]`) ?? picturesTmpl.content.cloneNode(true)
  const isTemplate = picturesElement instanceof DocumentFragment
  const picturesSection = isTemplate ? picturesElement.firstElementChild : picturesElement
  const picturesHeader = $('header', picturesSection)
  const picturesDate = $('.picturesDate', picturesSection)
  const picturesCont = $('.picturesOfTheDate', picturesSection)
  const currCont = app.classList.contains('albumOpen') ? albumPics : picturesCont

  picturesSection.dataset.time = time
  picturesSection.dataset.day = day

  if (isTemplate) {
    const formatDate = year !== currYear
      ? day.slice(4)
      : day.slice(4, -4)

    picturesDate.innerText = day === currDay ? "Today" : formatDate
    toggleMultipleSelection(picturesHeader, () => picturesCont.children)
  }

  currCont.append(picture)
  pictures.append(picturesSection)
}

export const createAlbumElement = (absolutePath, albumNameStr) => {
  const albumCont = albumTmpl.content.cloneNode(true).firstElementChild
  const albumThumb = $('.albumThumb', albumCont)
  const albumLength = $('.albumLength', albumCont)
  const albumName = $('.albumName', albumCont)
  const albumThumbImg = new Image()

  albumName.innerText = albumNameStr
  albumThumb.append(albumThumbImg)
  albums.append(albumCont)

  const decodeThumb = State.imgs[absolutePath].then(async uri => {
    const picture = State.pics[absolutePath] ?? {}
    const { isVideo } = picture.dataset ?? {}

    albumThumbImg.fetchpriority = "high"
    albumThumbImg.decoding = "async"

    if (+isVideo) {
      const pictureImg = $('.pictureImg', picture)
      await tryP(pictureImg.decode())

      const { src: minURI } = pictureImg
      albumThumbImg.src = minURI
    }
    else albumThumbImg.src = uri

    await tryP(albumThumbImg.decode())
    const max = Math.max(albumThumbImg.width, albumThumbImg.height)

    if (max < 200) albumThumbImg.style.imageRendering = "pixelated"
  })

  return { albumCont, decodeThumb }
}
