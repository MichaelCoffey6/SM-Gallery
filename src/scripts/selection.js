import { $, $$, State, screens, app, albumPics, selectedCount, pictures, albums, imports, selectAll, showPictures, showAlbums, showImport } from "./const.js"
import { navigate } from "./navigation.js"

export const checkSelection = (container, once) => {
  const unselectedIcon = $('.unselectedIcon', container)
  unselectedIcon.style.scale = 0
  container.classList.add('selected')
  selectedCount.innerText = $$('.picture.selected, .albumCont.selected, .importPicture.selected').length

  if (!once) return

  if (app.classList.contains('albumOpen')) {
    const album = $('.albumCont.open')
    const picturesSelected = $$(`.picture.selected[data-album-path="${album.dataset.albumPath}"]`)
    const albumPictures = $$('.picture:not([hidden])')
    State.albumsPicturesSel.add(container)
    selectedCount.innerText = State.albumsPicturesSel.size

    if (picturesSelected.length !== albumPictures.length) return

    checkSelection(selectAll)

    return
  }

  if (showAlbums.checked) {
    const albumsSel = $$('.albumCont.selected')
    const visibleAlbums = $$('.albumCont:not([hidden])')

    if (visibleAlbums.length === albumsSel.length) {
      checkSelection(selectAll)
    }

    return
  }

  if (showImport.checked) {
    const importationSel = $$('.importPicture.selected')

    if ($$('.importPicture').length === importationSel.length) {
      checkSelection(selectAll)
    }

    return
  }

  const picturesSection = container.parentElement.parentElement
  const picturesCont = $('.picturesOfTheDate', picturesSection)
  const picturesSelected = $$('.picture.selected', picturesSection)

  if (picturesSelected.length !== picturesCont.children.length) return

  const picturesHeader = $('header', picturesSection)
  const allPicturesSel = $$('.picture.selected')
  checkSelection(picturesHeader)

  if (Object.keys(State.pics).length !== allPicturesSel.length) return

  checkSelection(selectAll)
}

export const uncheckSelection = (container, once) => {
  const unselectedIcon = $('.unselectedIcon', container)
  container.classList.remove('selected')
  unselectedIcon.style.scale = 1
  selectedCount.innerText = $$('.picture.selected, .albumCont.selected').length

  if (!once) return

  if (app.classList.contains('albumOpen')) {
    const album = $('.albumCont.open')
    const picturesSelected = $$(`.picture.selected[data-album-path="${album.dataset.albumPath}"]`)
    const albumPictures = $$('.picture:not([hidden])')
    State.albumsPicturesSel.delete(container)
    selectedCount.innerText = State.albumsPicturesSel.size

    if (picturesSelected.length === albumPictures.length) return

    uncheckSelection(selectAll)

    return
  }

  if (showAlbums.checked) {
    const albumsSel = $$('.albumCont.selected')
    const visibleAlbums = $$('.albumCont:not([hidden])')

    if (visibleAlbums.length !== albumsSel.length) {
      uncheckSelection(selectAll)
    }

    return
  }

  if (showImport.checked) {
    const importationSel = $$('.importPicture.selected')

    if ($$('.importPicture').length !== importationSel.length) {
      uncheckSelection(selectAll)
    }

    return
  }

  const picturesHeader = $('header', container.parentElement.parentElement)
  uncheckSelection(picturesHeader)
  uncheckSelection(selectAll)

}

export const toggleMultipleSelection = (container, getPictures) => {
  const unselectedIcon = $('.unselectedIcon', container)

  container.addEventListener('click', () => {
    const allPicturesForEval = getPictures()

    if (container.classList.contains('selected')) {
      uncheckSelection(container)

      if (app.classList.contains('albumOpen')) {
        for (const picture of $$('.picture:not([hidden])')) {
          uncheckSelection(picture)
          State.albumsPicturesSel.delete(picture)
          selectedCount.innerText = State.albumsPicturesSel.size
        }

        return
      }

      for (const picture of allPicturesForEval) {
        uncheckSelection(picture)
      }

      const picturesHeaders = $$('.picturesSection header')
      const picturesHeadersSel = $$('.picturesSection header.selected')

      if (picturesHeadersSel.length !== picturesHeaders.length) {
        uncheckSelection(selectAll)
      }

      if (container !== selectAll) return

      for (const picturesHeader of picturesHeaders) {
        uncheckSelection(picturesHeader)
      }

      return
    }

    if (State.selectionMode) {
      checkSelection(container)

      if (app.classList.contains('albumOpen')) {
        for (const picture of $$('.picture:not([hidden])')) {
          checkSelection(picture)
          State.albumsPicturesSel.add(picture)
          selectedCount.innerText = State.albumsPicturesSel.size
        }

        return
      }

      for (const picture of allPicturesForEval) {
        checkSelection(picture)
      }

      const picturesHeaders = $$('.picturesSection header')
      const picturesHeadersSel = $$('.picturesSection header.selected')

      if (picturesHeadersSel.length === picturesHeaders.length) {
        checkSelection(selectAll)
      }

      if (container !== selectAll) return

      for (const picturesHeader of picturesHeaders) {
        checkSelection(picturesHeader)
      }

      return
    }
  })
}

export const toggleSelection = (container, section) => {
  const unselectedIcon = $('.unselectedIcon', container)
  let timeoutId = NaN

  container.addEventListener('pointerdown', () => {
    if (State.imgOpen) return

    const albumOpen = app.classList.contains('albumOpen')
    const isAlbumThumb = container.classList.contains('albumCont')

    if (albumOpen && isAlbumThumb) return

    if (container.classList.contains('selected')) {
      uncheckSelection(container, true)
      return
    }

    if (State.selectionMode) {
      checkSelection(container, true)
      return
    }

    timeoutId = setTimeout(() => {
      const currSection = albumOpen ? albumPics : section
      State.selectionMode = true
      app.classList.add('selectionMode')
      currSection.classList.add('selectionMode')

      navigate({ selectionMode: true })

      setTimeout(() => {
        app.classList.add('unselectionMode')
        currSection.classList.add('unselectionMode')
        checkSelection(container, true)
      }, 250)
    }, 1500)
  })

  container.addEventListener('pointerup', () => {
    clearTimeout(timeoutId)
  })

  container.addEventListener('pointerleave', () => {
    clearTimeout(timeoutId)
  })
}

export const closeSelectionMode = () => {
  State.albumsPicturesSel.clear()
  State.selectionMode = false
  app.style.pointerEvents = "none"
  app.classList.remove('unselectionMode')
  pictures.classList.remove('unselectionMode')
  albums.classList.remove('unselectionMode')
  albumPics.classList.remove('unselectionMode')
  imports.classList.remove('unselectionMode')

  $$('#selectAll, .picture, .picturesSection header, .albumCont, .importPicture, .importFile').forEach(container => {
    const unselectedIcon = $('.unselectedIcon', container)
    container.classList.remove('selected')
    unselectedIcon.style.scale = ""
  })

  setTimeout(() => {
    pictures.classList.remove('selectionMode')
    albums.classList.remove('selectionMode')
    albumPics.classList.remove('selectionMode')
    imports.classList.remove('selectionMode')
    app.classList.remove('selectionMode')
    app.style.pointerEvents = "auto"
    selectedCount.innerText = 0
  }, 300);
}

export const openSelectionMode = () => {
  const section = State.prevInpSection === showAlbums ? albums : screens[State.prevInpSection.id]
  const albumOpen = app.classList.contains('albumOpen')
  const currSection = albumOpen ? albumPics : section
  State.selectionMode = true
  app.classList.add('selectionMode')
  currSection.classList.add('selectionMode')

  navigate({ selectionMode: true })

  setTimeout(() => {
    app.classList.add('unselectionMode')
    currSection.classList.add('unselectionMode')
  }, 250)
}

toggleMultipleSelection(selectAll, (albumOpen) => {
  if (showPictures.checked) {
    return $$('section.selectionMode .picture')
  }

  if (showAlbums.checked && !app.classList.contains('albumOpen')) {
    return $$('.albumCont')
  }

  if (showImport.checked) {
    return $$('.importPicture')
  }
})