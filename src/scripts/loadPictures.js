import { State, $, $$, cl, sortDesChk, albums, imports, imgViewerScroll, favoritesName, canvas, canvasCtx, importsName, pauseProp, playProp, mutedProp, app, albumPics, currAlbumThumb, selectAll, appHeaderText, sortAscChk, sortByDateChk, pictureTmpl, pictures, importedFiles } from "./const.js"
import { MIMETYPES, FILETYPES } from "./types.js"
import { tryP, getPicSize } from "./utils.js"
import { sortAlbums, sortPicsByDate, sortPicsByName } from "./sortGallery.js"
import { checkSelection, uncheckSelection, toggleSelection } from "./selection.js"
import { createPictureElement, createAlbumElement } from "./createContainers.js"
import { updateImgViewSize, onPictureClick, onViewerClick } from "./imgViewer.js"
import { navigate } from "./navigation.js"

export const getMinImg = async (img, mimetype) => {
  const { w: initWidth, h: initHeight } = getPicSize(img)
  const max = Math.max(initWidth, initHeight)

  if (
    MIMETYPES.svg.includes(mimetype) ||
    MIMETYPES.gif.includes(mimetype) ||
    (img instanceof HTMLImageElement && max < 400)
  ) return {
    initWidth,
    initHeight,
    max
  }

  const scale = max / 400
  const [width, height] = max > 400
    ? [
      Math.round(initWidth / scale),
      Math.round(initHeight / scale)
    ] : [
      initWidth,
      initHeight
    ]

  if (img instanceof HTMLVideoElement) {
    await new Promise(resolve => {
      img.addEventListener('timeupdate', resolve, { once: true })
      img.currentTime = Math.round(img.duration / 2)
      setTimeout(resolve, 500)
    })

    canvas.width = width
    canvas.height = height
    canvasCtx.fillStyle = "#000000"
    canvasCtx.fillRect(0, 0, width, height)
    canvasCtx.drawImage(img, 0, 0, width, height)

    img.currentTime = 0
  } else {
    canvas.width = width
    canvas.height = height
    canvasCtx.drawImage(img, 0, 0, width, height)
  }

  return {
    minURI: canvas.toDataURL('image/png'),
    initWidth,
    initHeight,
    max
  }
}

export const onAlbumClick = (albumCont, albumPath, absolutePath, hidePicture) => {
  if (
    State.selectionMode &&
    !app.classList.contains('albumOpen')
  ) return

  $('.albumCont.open')?.classList.remove('open')
  albumCont.classList.add('open')
  appHeaderText.innerText = albumCont.dataset.albumName

  const { sortByOpt, sortOrderOpt } = State.albumsOpts[albumPath]
  const ascending = sortOrderOpt === sortAscChk
  sortByOpt.checked = true
  sortOrderOpt.checked = true

  for (const picture of $$('.picture')) {
    const pictureImg = $('.pictureImg', picture)
    const imgGroupId = picture.dataset.imgGroupId
    const viewPicture = $(`.imgViewerImg[data-img-group-id="${imgGroupId}"]`).parentElement
    picture.hidden = viewPicture.hidden = hidePicture(picture, pictureImg)
    albumPics.append(picture)
  }

  if (sortByOpt === sortByDateChk) sortPicsByDate(ascending)
  else sortPicsByName(ascending)

  State.imgs[absolutePath].then(async uri => {
    currAlbumThumb.src = uri

    await currAlbumThumb.decode().catch(e => 0)
    const max = Math.max(currAlbumThumb.width, currAlbumThumb.height)

    if (max < 200) currAlbumThumb.style.imageRendering = "pixelated"
  })

  const albumsSelected = $$(`.albumCont.selected`)
  const visibleAlbums = $$('.albumCont:not([hidden])')

  if (albumsSelected.length !== visibleAlbums.length)
    uncheckSelection(selectAll)
  else checkSelection(selectAll)


  if (app.classList.contains('albumOpen')) return

  app.classList.add('albumOpen')
  app.scrollTop = 220
  navigate({ page: 'album' })
}

export const onFavoritesAlbumClick = () => {
  const favoritesAlbum = $(`.albumCont[data-album-path="${favoritesName}"]`)
  
  onAlbumClick(
    favoritesAlbum,
    favoritesName,
    favoritesName,
    (_, pictureImg) => !pictureImg.classList.contains('favorite')
  )
}

export const loadUint = async (uint, { file, picture, importPicture = null, time, day, fileName, albumPath }) => {
  const { name: path, date } = file
  const imgGroupId = crypto.randomUUID()
  const viewPicture = document.createElement('picture')
  const b64 = uint.toBase64()
  const min = date.getMinutes().toString().padStart(2, '0')
  const hour24 = date.getHours()
  const dayFormat = day.slice(4).split('').toSpliced(-5, 0, ',').join('')
  const ext = path.split('.').at(-1)
  const mimetype = MIMETYPES[ext].at(0) ?? "application/octet-stream"
  const uri = `data:${mimetype};base64,${b64}`
  const isVideo = +FILETYPES.video.includes(mimetype)
  const fileObj = new File([uint], fileName, { type: mimetype, lastModified: time })
  const minImg = new Image()
  const img = new Image()

  const bigImg = isVideo
    ? document.createElement('video')
    : new Image()

  const [hour, APM] = hour24 > 12
    ? [hour24 - 12, 'PM']
    : [hour24, 'AM']

  State.files[imgGroupId] = [uint, fileObj]
  img.classList.add('pictureImg')
  minImg.classList.add('imgViewerMinImg')
  bigImg.classList.add('imgViewerImg')
  minImg.style.display = "none"
  bigImg.style.display = "none"
  bigImg.src = uri

  if (importPicture) {
    importPicture.dataset.imgGroupId = imgGroupId
  }

  picture.dataset.isVideo = String(isVideo)
  picture.dataset.imgGroupId = imgGroupId
  img.dataset.imgGroupId = imgGroupId
  minImg.dataset.imgGroupId = imgGroupId
  bigImg.dataset.imgGroupId = imgGroupId
  bigImg.dataset.imgGroupId = imgGroupId
  bigImg.dataset.isVideo = String(isVideo)

  if (isVideo) {
    const videoProxy = new Proxy(bigImg, {
      get(_, prop) {
        const value = bigImg[prop]

        if (prop === playProp) {
          return () => {
            bigImg.classList.add('played')
            bigImg.play()
          }
        }

        if (prop === pauseProp) {
          return () => {
            bigImg.classList.remove('played')
            Object(bigImg).pause()
          }
        }

        return value instanceof Function
          ? (...args) => value.apply(bigImg, args)
          : value
      },

      set(_, prop, val) {
        if (prop === mutedProp) {
          bigImg.classList[val ? 'add' : 'remove']('muted')
        }


        bigImg[prop] = val
        return true
      }
    })

    const decoded = new Promise(resolve =>
      bigImg.oncanplaythrough = resolve
    )

    bigImg.proxy = videoProxy
    bigImg.decode = () => decoded
  }

  await tryP(bigImg.decode())

  const { minURI = uri, initWidth, initHeight, max } = await getMinImg(bigImg, mimetype)
  const aspectRatio = `${initWidth} / ${initHeight}`
  img.src = minImg.src = minURI

  const details = {
    date: `${dayFormat} ${hour}:${min} ${APM}`,
    size: `${initWidth}x${initHeight}`,
    length: uint.length,
    albumPath,
    fileName
  }
  
  const picAdditionalInfo = {
    img, 
    bigImg, 
    minImg,
    picture,
    viewPicture, 
    isVideo, 
    details, 
    initWidth, 
    initHeight
  }

  bigImg.dataset.details = JSON.stringify(details)

  if (max < 200) {
    bigImg.style.imageRendering = "pixelated"
    minImg.style.imageRendering = "pixelated"
    img.style.imageRendering = "pixelated"
  }

  picture.prepend(img)
  viewPicture.append(minImg, bigImg)
  imgViewerScroll.append(viewPicture)
  
  viewPicture.addEventListener('click', onViewerClick)
  picture.addEventListener('click', () => onPictureClick(picAdditionalInfo))

  toggleSelection(picture, pictures)
  updateImgViewSize(initWidth, initHeight, bigImg, minImg)

  return uri
}

export const loadPicture = ([path, file], zipName, albumNames, isImported, zipFileCont) => {
  const { date } = file
  const day = date.toDateString()
  const time = date.getTime()
  const year = date.getFullYear()
  const picture = pictureTmpl.content.cloneNode(true).firstElementChild
  const pathRoutes = path.split('/')
  const [albumName, fileName, albumPath] = pathRoutes.length > 1
    ? pathRoutes.slice(-2).concat(pathRoutes.slice(0, -1).join('/'))
    : [zipName, pathRoutes.at(0), zipName]

  const uintAdditionalInfo = {
    picture,
    file,
    fileName,
    albumPath,
    day,
    time
  }

  const absolutePath = `${zipName}/${path}`
  picture.dataset.absolutePath = absolutePath
  picture.dataset.albumPath = albumPath
  picture.dataset.day = day
  picture.dataset.time = time
  picture.dataset.name = fileName

  if (isImported && !zipFileCont) {
    const importPicture = pictureTmpl.content.cloneNode(true).firstElementChild
    uintAdditionalInfo.importPicture = importPicture
    importPicture.classList.add('importPicture')
    importPicture.classList.remove('picture')
    importedFiles.prepend(importPicture)
    toggleSelection(importPicture, imports)
  } else {
    const importName = $('span', zipFileCont)

    if (isImported && zipFileCont && !importName.innerText) {
      const pressTimeout = { id: 0 }
      const importPicture = $('.importPicture', zipFileCont)
      zipFileCont.dataset.absolutePath = absolutePath
      zipFileCont.dataset.albumPath = albumPath
      zipFileCont.dataset.albumName = albumName
      importName.innerText = zipName
      importedFiles.prepend(zipFileCont)
      toggleSelection(zipFileCont, imports, pressTimeout)
    }
  }

  const uintProm = file.async('uint8array').then(uint => loadUint(uint, uintAdditionalInfo))
  State.imgs[absolutePath] = uintProm
  State.pics[absolutePath] = picture

  createPictureElement({ picture, albumPath, day, time, year })

  const albumLength = $(`.albumCont[data-album-path="${albumPath}"] .albumLength`)

  if (albumName in albumNames) {
    albumLength.innerText = ++albumNames[albumName]
    return
  }

  if (albumName === importsName && albumLength) {
    albumLength.innerText = $$(`.picture[data-album-path="${importsName}"]`).length
    return
  }

  const albumCont = createAlbumElement(absolutePath, albumName)
  albumCont.dataset.albumPath = albumPath
  albumCont.dataset.albumName = albumName
  albumCont.dataset.absolutePath = absolutePath
  albumNames[albumName] = 1

  State.albumsOpts[albumPath] = {
    sortByOpt: sortByDateChk,
    sortOrderOpt: sortDesChk
  }

  albumCont.addEventListener('click', () => onAlbumClick(
    albumCont, 
    albumPath,
    absolutePath,
    picture => picture.dataset.albumPath !== albumPath
  ))

  toggleSelection(albumCont, albums)
}

export const loadPictures = async (picturesEntries, zipName, isImported, zipFileCont) => {
  const albumNames = {}

  const picturesSorted = picturesEntries.toSorted(([, file1], [, file2]) =>
    file2.date.getTime() - file1.date.getTime()
  )

  picturesSorted.forEach(entrie => loadPicture(entrie, zipName, albumNames, isImported, zipFileCont))


  pictures.replaceChildren.apply(
    pictures,
    Array.from(pictures.children).sort((section1, section2) =>
      section2.dataset.time - section1.dataset.time
    )
  )


  await Promise.all(Object.values(State.imgs))

  sortAlbums()
  sortPicsByDate()
}

export const createFavoritesAlbum = () => {
  const favoritesAlbum = createAlbumElement(favoritesName, favoritesName)
  favoritesAlbum.hidden = true
  favoritesAlbum.dataset.albumPath = favoritesName
  favoritesAlbum.dataset.albumName = favoritesName
  favoritesAlbum.dataset.absolutePath = favoritesName
  favoritesAlbum.addEventListener('click', onFavoritesAlbumClick)
  toggleSelection(favoritesAlbum, albums)
}