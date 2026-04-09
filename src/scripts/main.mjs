import { 
  $, $$, cl, State,
  app, 
  appMain,
  sortAccept, 
  sortCancel, 
  pictures,
  albums,
  imports,
  albumPics,
  navigationBar,
  addFavoriteBtn,
  backBtn,
  videoNowBtn,
  videoMuteBtn,
  videoBackBtn,
  videoPlayBtn,
  videoAdvanceBtn,
  picInPicBtn,
  editPicsBtn,
  sortPicsBtn,
  detailsBtn,
  shareSelBtn,
  deleteSelBtn,
  shareBtn,
  deleteBtn,
  imgViewer,
  imgViewerScroll,
  zipInp,
  showImport,
} from "./const.js"
//(
import { FILETYPES, MIMETYPES, POINTERTYPES, } from "./types.js"
import { loadFiles, loadZip } from "./loadFiles.js"
import { loadPictures, createFavoritesAlbum } from "./loadPictures.js"
import { sharePicture, deletePicture, toggleFavoritePicture } from "./pictureActions.js"
import { shareSelection, deleteSelection } from "./selectionActions.js"
import { openSortOpts, onSortAccept, onSortCancel } from "./sortGallery.js"
import { createAlbumElement } from "./createContainers.js"
import { onPointerUp, onPointerMove, onVideoJumpTime, onVideoMuted, onPiP, onExitPiP, onVideoJumpTimeStart, onVideoPlayPause } from "./videoPlayer.js"
import { onPictureClick, openDetails } from "./imgViewer.js"
import { toggleSelection, openSelectionMode } from "./selection.js"
import { onViewerScroll, changeViewerSection, onViewerPointerDown } from "./viewerScroll.js"
import { onWindowResize, onMainClick, onAppScroll } from "./generalEvents.js"
import { onPopState, onBackPage } from "./backMode.js"
import { changeImportSection } from "./navigation.js"
import { testPictures } from "./test/testPictures.js"

window.addEventListener('resize', onWindowResize)
window.addEventListener('popstate', onPopState)
window.addEventListener('touchmove', onPointerMove)
window.addEventListener('touchend', onPointerUp)
window.addEventListener('leavepictureinpicture', onExitPiP)
//)

app.addEventListener('scroll', onAppScroll, { passive: true })

appMain.addEventListener('click', onMainClick)

showImport.addEventListener('change', changeImportSection)

backBtn.addEventListener('click', onBackPage)

videoNowBtn.addEventListener('pointerdown', onVideoJumpTimeStart)
videoMuteBtn.addEventListener('click', onVideoMuted)
videoBackBtn.addEventListener('click', onVideoJumpTime)
videoPlayBtn.addEventListener('click', onVideoPlayPause)
videoAdvanceBtn.addEventListener('click', onVideoJumpTime)
picInPicBtn.addEventListener('click', onPiP)

detailsBtn.addEventListener('click', openDetails)
editPicsBtn.addEventListener('click', openSelectionMode)
sortPicsBtn.addEventListener('click', openSortOpts)

sortAccept.addEventListener('click', onSortAccept)
sortCancel.addEventListener('click', onSortCancel)

zipInp.addEventListener('change', loadFiles)

imgViewer.addEventListener('scroll', onViewerScroll)
imgViewerScroll.addEventListener('pointerdown', onViewerPointerDown)

addFavoriteBtn.addEventListener('click', toggleFavoritePicture)
deleteBtn.addEventListener('click', deletePicture)
shareBtn.addEventListener('click', sharePicture)

deleteSelBtn.addEventListener('click', deleteSelection)
shareSelBtn.addEventListener('click', shareSelection)





















//await document.fonts.ready

createFavoritesAlbum()

app.scrollTop = 220
app.style.setProperty('--windowW', window.innerWidth)
app.style.setProperty('--windowH', window.innerHeight)
navigationBar.style.setProperty('--navigation-bar-height', navigationBar.clientHeight)

const [zipTest, videoTest] = await Promise.all([
  fetch('../src/scripts/test/appTest.zip').then(res => res.blob()),
  fetch('../src/scripts/test/Vanny.mp4').then(res => res.blob())
])

const testEntries = Object.entries(testPictures)
loadPictures(testEntries, '@zip')
loadZip(Object.assign(videoTest, { name: 'Vanny.mp4' }))
loadZip(Object.assign(zipTest, { name: 'zipTest.zip' }))