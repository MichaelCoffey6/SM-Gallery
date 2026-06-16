import { State, $, $$, cl, sortByDateChk, sortAscChk, pictures, favoritesName, importsName, app, sortPics, albums, albumPics, imgViewerScroll } from "./const.js"
import { arr } from "./utils.js"

export const sortImgViewerScroll = () => {
  $$('.pictureImg').forEach(({ dataset }) => {
    const { imgGroupId } = dataset
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement
    imgViewerScroll.append(viewPicture)
  })
}

export const sortPicsByName = ascending => {
  if (ascending) {
    albumPics.replaceChildren.apply(
      albumPics,
      Array.from(albumPics.children).sort((picture1, picture2) => {
        const { name: a } = picture1.dataset
        const { name: b } = picture2.dataset

        return a.normalize('NFD').localeCompare(
          b.normalize('NFD'),
          'es',
          { sensitivity: 'base' }
        )
      })
    )

    sortImgViewerScroll()
    return
  }

  albumPics.replaceChildren.apply(
    albumPics,
    Array.from(albumPics.children).sort((picture1, picture2) => {
      const { name: a } = picture2.dataset
      const { name: b } = picture1.dataset

      return a.normalize('NFD').localeCompare(
        b.normalize('NFD'),
        'es',
        { sensitivity: 'base' }
      )
    })
  )

  sortImgViewerScroll()
}

export const sortPicsByDate = ascending => {
  if (app.classList.contains('albumOpen')) {
    albumPics.replaceChildren.apply(
      albumPics,
      ascending
        ? Array.from(albumPics.children).sort((picture1, picture2) =>
          picture1.dataset.time - picture2.dataset.time
        )
        : Array.from(albumPics.children).sort((picture1, picture2) =>
          picture2.dataset.time - picture1.dataset.time
        )
    )

    sortImgViewerScroll()
    return
  }
  
  cl('sort')

  const picturesSections = arr($$('.picturesSection'))
  
  picturesSections.forEach(section => {
    const picturesOfTheDate = $('.picturesOfTheDate', section)

    picturesOfTheDate.replaceChildren.apply(
      picturesOfTheDate,
      ascending
        ? arr(picturesOfTheDate.children).toSorted((picture1, picture2) =>
          picture1.dataset.time - picture2.dataset.time
        )
        : arr(picturesOfTheDate.children).toSorted((picture1, picture2) =>
          picture2.dataset.time - picture1.dataset.time
        )
    )
  })
  
  pictures.replaceChildren.apply(
    pictures,
    ascending
      ? picturesSections.toSorted((section1, section2) =>
        section1.dataset.time - section2.dataset.time
      )
      : picturesSections.toSorted((section1, section2) =>
        section2.dataset.time - section1.dataset.time
      )
  )

  sortImgViewerScroll()
}

export const sortAlbums = () => {
  albums.replaceChildren.apply(
    albums,
    Array.from(albums.children).sort((album1, album2) => {
      const { albumName: a } = album2.dataset
      const { albumName: b } = album1.dataset

      return a.normalize('NFD').localeCompare(
        b.normalize('NFD'),
        'es',
        { sensitivity: 'base' }
      )
    })
  )

  const importsAlbum = $(`.albumCont[data-album-path="${importsName}"]`)
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`)

  if (importsAlbum) albums.prepend(importsAlbum)
  if (favoritesAlbum) albums.prepend(favoritesAlbum)
}

export const onSortAccept = () => {
  sortPics.parentElement.hidden = true

  const currAlbum = $('.albumCont.open')
  const currSortOpt = $('[name=sortBy]:checked')
  const currOrderOpt = $('[name=sortOrder]:checked')
  const ascending = currOrderOpt === sortAscChk
  const { albumPath } = currAlbum.dataset

  State.albumsOpts[albumPath].sortByOpt = currSortOpt
  State.albumsOpts[albumPath].sortOrderOpt = currOrderOpt

  if (currSortOpt === sortByDateChk) sortPicsByDate(ascending)
  else sortPicsByName(ascending)
}

export const onSortCancel = () => {
  const currAlbum = $('.albumCont.open')
  const { albumPath } = currAlbum.dataset

  sortPics.parentElement.hidden = true
  State.albumsOpts[albumPath].sortByOpt.checked = true
  State.albumsOpts[albumPath].sortOrderOpt.checked = true
}

export const openSortOpts = () => {
  const sortPicsCont = sortPics.parentElement
  const { hidden } = sortPicsCont
  sortPicsCont.hidden = !hidden
}