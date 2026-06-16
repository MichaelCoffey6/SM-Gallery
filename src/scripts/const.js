export const $ = (sel, ctx = document) => ctx.querySelector(sel)
export const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel)
export const cl = console.log

export const app = $('#app')
export const appHeaderText = $('#appHeaderText')
export const appMain = $('main')

export const showPictures = $('#showPictures')
export const showAlbums = $('#showAlbums')
export const showImport = $('#showImport')

export const videoIconTmpl = $('#videoIconTmpl')
export const zipFileTmpl = $('#zipFileTmpl')
export const pictureTmpl = $('#pictureTmpl')
export const picturesTmpl = $('#picturesTmpl')
export const albumTmpl = $('#albumTmpl')

export const sortPics = $('#sortPics')
export const sortByDateChk = $('#sortByDateChk')
export const sortAscChk = $('#sortAscChk')
export const sortDesChk = $('#sortDesChk')
export const sortAccept = $('#sortAccept')
export const sortCancel = $('#sortCancel')

export const duplicateConfirmation = $('#duplicateConfirmation')
export const deleteConfirmation = $('#deleteConfirmation')

export const imgViewer = $('#imgViewer')
export const imgViewerSlider = $('#imgViewerSlider')
export const imgViewerScroll = $('#imgViewerScroll')
export const imgViewerInfo = $('#imgViewerInfo')
export const imgDetails = $('#imgDetails')
export const imgDetailsHeader = $('#imgDetailsHeader')
export const imgDate = $('#imgDate')
export const imgName = $('#imgName')
export const imgSize = $('#imgSize')
export const imgPath = $('#imgPath')
export const imgLength = $('#imgLength')

export const mainHeader = $('#mainHeader')
export const mainHeaderTitle = $('#mainHeaderTitle')
export const selectedCount = $('#selectedCount')
export const currAlbumThumb = $('#currAlbumThumb')
export const selectAll = $('#selectAll')
export const backBtn = $('#backBtn')
export const moreOptsChk = $('#moreOptsChk')
export const editPicsBtn = $('#editPicsBtn')
export const sortPicsBtn = $('#sortPicsBtn')
export const detailsBtn = $('#detailsBtn')

export const videoControls = $('#videoControls')
export const videoTimeBar = $('#videoTimeBar')
export const videoNow = $('#videoNow')
export const videoNowBtn = $('#videoNowBtn')
export const videoCurrTime = $('#videoCurrTime')
export const videoDuration = $('#videoDuration')
export const videoMuteBtn = $('#videoMuteBtn')
export const videoBackBtn = $('#videoBackBtn')
export const videoPlayBtn = $('#videoPlayBtn')
export const videoAdvanceBtn = $('#videoAdvanceBtn')
export const picInPicBtn = $('#picInPicBtn')

export const imgSubOpts = $('#imgSubOpts')
export const addFavoriteBtn = $('#addFavoriteBtn')
export const deleteBtn = $('#deleteBtn')
export const shareBtn = $('#shareBtn')

export const pictures = $('#pictures')
export const albums = $('#albums')
export const albumPics = $('#albumPics')
export const imports = $('#imports')


export const importedFiles = $('#importedFiles')
export const zipInp = $('#zipInp')

export const navigationBar = $('#navigationBar')
export const deleteSelBtn = $('#deleteSelBtn')
export const shareSelBtn = $('#shareSelBtn')


export const https = "https:"
export const importsName = "@imports"
export const favoritesName = "@favorites"
export const mutedProp = "muted"
export const pauseProp = "pause"
export const playProp = "play"
export const reader = new FileReader()
export const currDate = new Date()
export const currDay = currDate.toDateString()
export const currYear = currDate.getFullYear()
export const canvas = document.createElement('canvas')
export const canvasCtx = canvas.getContext('2d')

export const screens = {
  [showPictures.id]: pictures,
  [showImport.id]: imports,
  [showAlbums.id]: {
    albums,
    albumPics
  },
}

export const State = {
  imgOpen: false,
  videoOpen: 0,
  appHeaderOpen: true,
  selectionMode: false,
  verticalScroll: false,
  loadingPictures: false,
  prevInpSection: showPictures,
  prevInpSectionGallery: showPictures,
  prevVideoCallbacks: [],
  detailsObserver: {},
  imgs: {
    [favoritesName]: Promise.resolve('./src/assets/favorite on.svg')
  },
  pics: {},
  files: {},
  albumsPicturesSel: new Set(),
  details: {
    visible: false,
    anim: true,
    exit: false
  },
  albumsOpts: {
    [favoritesName]: {
      sortByOpt: sortByDateChk,
      sortOrderOpt: sortDesChk
    }
  },
  pointerVideoTime: {
    pointerType: {},
    pointerDown: false,
    pointerStart: 0,
    pointerX: 0,
    duration: 0,
    newTimeX: 0,
    newTime: 0,
    video: null,
    videoTimeBarW: videoTimeBar.clientWidth
  }
}