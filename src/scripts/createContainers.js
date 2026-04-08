import { $, cl, State, currYear, currDay, picturesTmpl, albumTmpl, pictures, albums } from "./const.js"
import { toggleMultipleSelection } from "./selection.js"

export const createPictureElement = ({ picture, albumPath, day, time, year }) => {
  const picturesElement = $(`.picturesSection[data-day="${day}"]`) ?? picturesTmpl.content.cloneNode(true)
  const isTemplate = picturesElement instanceof DocumentFragment
  const picturesSection = isTemplate ? picturesElement.firstElementChild : picturesElement
  const picturesHeader = $('header', picturesSection)
  const picturesDate = $('.picturesDate', picturesSection)
  const picturesCont = $('.picturesOfTheDate', picturesSection)

  picturesSection.dataset.time = time
  picturesSection.dataset.day = day

  if (isTemplate) {
    const year = +day.slice(-4)
    const formatDate = year !== currYear
      ? day.slice(4)
      : day.slice(4, -4)

    picturesDate.innerText = day === currDay ? "Today" : formatDate
    toggleMultipleSelection(picturesHeader, () => picturesCont.children)
  }

  picturesCont.append(picture)
  pictures.append(picturesSection)
}

export const createAlbumElement = (absolutePath, albumNameStr) => {
  const albumCont = albumTmpl.content.cloneNode(true).firstElementChild
  const albumThumb = $('.albumThumb', albumCont)
  const albumLength = $('.albumLength', albumCont)
  const albumName = $('.albumName', albumCont)
  const albumThumbImg = new Image()

  State.imgs[absolutePath].then(async uri => {
    const picture = State.pics[absolutePath] ?? {}
    const { isVideo } = picture.dataset ?? {}

    albumThumbImg.fetchpriority = "high"
    albumThumbImg.decoding = "async"

    if (+isVideo) {
      const pictureImg = $('.pictureImg', picture)
      await pictureImg.decode().catch(e => 0)

      const { src: minURI } = pictureImg
      albumThumbImg.src = minURI
    }
    else albumThumbImg.src = uri

    await albumThumbImg.decode().catch(e => 0)
    const max = Math.max(albumThumbImg.width, albumThumbImg.height)

    if (max < 200) albumThumbImg.style.imageRendering = "pixelated"
  })

  albumName.innerText = albumNameStr

  albumThumb.append(albumThumbImg)
  albums.append(albumCont)

  return albumCont
}
