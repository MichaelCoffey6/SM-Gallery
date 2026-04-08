import { State, $, cl, videoTimeBar, videoBackBtn, videoDuration, videoCurrTime, videoNow, videoNowBtn } from "./const.js"
import { POINTERTYPES } from "./types.js"
import { formatSeconds } from "./utils.js"

export const onPointerMove = event => {
  const { touches, constructor } = event

  const {
    pointerType,
    pointerDown,
    pointerStart,
    pointerX,
    videoTimeBarW,
    duration,
    newTimeX: prevTimeX,
    video
  } = State.pointerVideoTime

  if (!pointerDown || pointerType !== constructor) return

  const { clientX } = pointerType === TouchEvent
    ? touches[0]
    : event

  const newTimeX = Math.max(0, pointerStart + (clientX - pointerX))
  const maxTimeX = Math.min(newTimeX, videoTimeBarW)
  const newTime = Math.min(Math.floor(duration / videoTimeBarW * newTimeX), duration)
  const newTimeP = Math.floor(100 / videoTimeBarW * maxTimeX)
  const nowFormat = formatSeconds(newTime)

  videoNow.style.width = `${newTimeP}%`
  videoNowBtn.style.left = `${newTimeP}%`
  videoCurrTime.innerText = nowFormat

  State.pointerVideoTime.newTimeX = maxTimeX
  State.pointerVideoTime.newTime = newTime
}

export const onPointerUp = ({ constructor }) => {
  const { pointerType, pointerDown, newTime } = State.pointerVideoTime

  if (!pointerDown || pointerType !== constructor) return

  State.pointerVideoTime.pointerDown = false
  State.pointerVideoTime.video.currentTime = newTime
}

export const onVideoJumpTimeStart = ({ pointerType, clientX }) => {
  const video = $('#imgViewerImg.video')
  const { pointerVideoTime } = State
  const { duration, currentTime } = video
  const videoTimeBarW = videoTimeBar.clientWidth
  pointerVideoTime.video = video
  pointerVideoTime.duration = duration
  pointerVideoTime.videoTimeBarW = videoTimeBarW
  pointerVideoTime.pointerX = clientX
  pointerVideoTime.pointerStart = videoTimeBarW / duration * video.currentTime
  pointerVideoTime.pointerDown = true
  pointerVideoTime.pointerType = pointerType === POINTERTYPES.touch ? TouchEvent : MouseEvent
}

export const onVideoMuted = () => {
  const video = $('#imgViewerImg.video')
  video.proxy.muted = !video.classList.contains('muted')
}

export const onExitPiP = ({ target: video }) => {
  video.proxy.pause()
}

export const onPiP = () => {
  const video = $('#imgViewerImg.video')

  if (!document.pictureInPictureEnabled) {
    alert('PiP not supported. Check browser compatibility for details.')
    return
  }

  if (document.pictureInPictureElement) {
    document.exitPictureInPicture()
    return
  }

  video.requestPictureInPicture()
}

export const onVideoProgress = ({ target: video }) => {
  if (State.pointerVideoTime.pointerDown) return

  const currentTime = Math.floor(video.currentTime)
  const timeNow = Math.floor(100 / video.duration * currentTime)
  const nowFormat = formatSeconds(currentTime)
  videoNow.style.width = `${timeNow}%`
  videoNowBtn.style.left = `${timeNow}%`
  videoCurrTime.innerText = nowFormat
}

export const onVideoEnd = ({ target: video }) => {
  video.classList.remove('played')
  video.currentTime = 0
}

export const onVideoJumpTime = ({ target }) => {
  const video = $('#imgViewerImg.video')

  if (target === videoBackBtn) {
    video.currentTime = video.currentTime - 5
    return
  }

  video.currentTime = video.currentTime + 5
}

export const onVideoPlayPause = () => {
  const video = $('#imgViewerImg.video')
  video.paused ? video.proxy.play() : video.proxy.pause()
}

export const onPlayPausePiP = ({ target: video }) => {
  video.paused ? video.proxy.pause() : video.proxy.play()
}

export const onVideoFocus = (video, prevVideo) => {
  prevVideo?.classList.remove('video')
  prevVideo?.removeEventListener('timeupdate', onVideoProgress)
  prevVideo?.removeEventListener('ended', onVideoEnd)
  prevVideo?.removeEventListener('play', onPlayPausePiP)
  prevVideo?.removeEventListener('pause', onPlayPausePiP)

  video.classList.add('video')
  video.addEventListener('timeupdate', onVideoProgress)
  video.addEventListener('ended', onVideoEnd)
  video.addEventListener('play', onPlayPausePiP)
  video.addEventListener('pause', onPlayPausePiP)

  videoDuration.innerText = formatSeconds(video.duration)
}