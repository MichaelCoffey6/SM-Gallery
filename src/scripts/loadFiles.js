import { State, $, cl, importsName, zipInp, duplicateConfirmation, zipFileTmpl } from "./const.js"
import { MIMETYPES, FILETYPES } from "./types.js"
import { tryP } from "./utils.js"
import { confirmation } from "./popup.js"
import { loadPictures } from "./loadPictures.js"

const fileWorker = new Worker('./src/scripts/testFileWorker.js')

const useFileWorker = async file => {
  const { promise, resolve } = Promise.withResolvers()
  fileWorker.onmessage = ({ data }) => resolve(data)
  fileWorker.postMessage(file)
  
  const entries = await promise
  entries.forEach(([, fileObj]) => fileObj.async = async () => fileObj.uint)
  
  return entries
}

export const loadFiles = () => {
  for (const file of zipInp.files) {
    if (!file) continue
    loadZip(file, true)
  }
}

export const loadZip = async (file, isImported) => {
  const { name, type, lastModifiedDate, lastModified = Date.now() } = file

  if (!Object.values(MIMETYPES).flat().includes(type)) {
    alert(`Invalid file: mimetype ${type} isn't valid`)
    cl(name)
    return
  }

  const popupFixed = duplicateConfirmation.parentElement

  if (MIMETYPES.zip.includes(type)) {
    const hasImported = Object.values(State.pics)
      .filter(({ dataset }) =>
        new RegExp(`^${name} \\([0-9]+\\)$`).test(dataset.albumPath) ||
        dataset.albumPath === name
      )
      .reduce((arr, { dataset }) => {
        const { albumPath } = dataset
        !arr.includes(albumPath) && arr.push(albumPath)
        return arr
      }, [])


    if (hasImported.length) {
      const [ , cancel ] = await tryP(confirmation(popupFixed, 'file'))
      popupFixed.hidden = true
      zipInp.value = ""
      
      if (cancel) return
    }
    
    /*const data = await file.bytes()
    const zip = await JSZip.loadAsync(await data)*/
    const folderEntries = await useFileWorker(file)//Object.entries(zip.files)
    const zipFileCont = zipFileTmpl.content.cloneNode(true).firstElementChild

    zipFileCont.addEventListener('click', () => {
      if (State.selectionMode) return

      $('[for=showAlbums]').click()

      const { albumPath, albumName } = zipFileCont.dataset
      const albumCont = $(`.albumCont[data-album-path="${albumPath}"]`)
      albumCont.dispatchEvent(new Event('click'))
    })

    zipInp.value = ""
    loadPictures(folderEntries, hasImported.length ? `${name} (${hasImported.length})` : name, isImported, zipFileCont)
    State.prevInpSectionGallery.click()
    return
  }
  
  const data = await file.bytes()
  
  const hasImported = Object.values(State.files).some(([uint]) =>
    uint.every((byte, i) => byte === data[i])
  )

  if (hasImported) {
    const [fileType] = Object.entries(FILETYPES).find(([, types]) => types.includes(type))
    const [ , cancel ] = await tryP(confirmation(popupFixed, fileType))
    popupFixed.hidden = true
    zipInp.value = ""
    
    if (cancel) return
  }

  zipInp.value = ""

  const fakeZipEntries = [[
    name, {
      name,
      date: 'lastModifiedDate' in file ? lastModifiedDate : new Date(lastModified),
      async: async () => data
    }
  ]]

  loadPictures(fakeZipEntries, importsName, isImported)
  State.prevInpSectionGallery.click()
}
