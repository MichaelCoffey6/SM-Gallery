import { State, $, $$, app, showImport, showPictures, showAlbums, appHeaderText } from "./const.js"

const getParams = () => {
  const { search } = window.location
  return new URLSearchParams(search)
}

export const navigate = params => {
  const { origin, pathname } = window.location
  const { page, view, selectionMode, details } = params
  const currParams = getParams()
  const currPage = currParams.get('page')

  page && currParams.set('page', page)
  view && currParams.set('view', view)
  details && currParams.set('details', details)
  selectionMode && currParams.set('selectionMode', selectionMode)

  const newParams = currParams.size
    ? `?${currParams.toString()}`
    : ""

  const newURL = `${origin}${pathname}${newParams}`
  window.history.pushState({}, '', newURL)
}

export const changeImportSection = () => {
  if (!showImport.checked) {
    app.classList.add('imports')
    window.dispatchEvent(new Event('popstate'))
    return
  }

  for (const importPicture of $$('.importPicture')) {
    if (importPicture.parentElement.classList.contains('importFile')) continue

    const { imgGroupId } = importPicture.dataset
    const pictureImg = $(`.pictureImg[data-img-group-id="${imgGroupId}"]`)
    importPicture.append(pictureImg)
  }
}

export const changeScreen = (sibligs, input, name, id) => {
  if (name === showPictures.name) {
    const currentLabelSection = $(`label[for=${id}] span`)
    appHeaderText.innerText = currentLabelSection.innerText
    State.prevInpSection = input

    if (State.prevInpSection === showAlbums && app.classList.contains('albumOpen')) {
      window['navigation'].back()
    }

    if (input !== showImport) {
      State.prevInpSectionGallery = input
      changeImportSection()
    }
  }

  if (State.selectionMode) {
    window['navigation'].back()
  }

  sibligs.forEach(({ id, checked }) => {
    const label = $(`label[for=${id}]`)
    const action = checked ? "add" : "remove"
    label.classList[action]('checked')
  })
}