export const MIMETYPES = {
  png: ['image/png'],
  jpg: ['image/jpeg', 'image/jpg'],
  webp: ['image/webp'],
  avif: ['image/avif'],
  bmp: ['image/bmp', 'image/x-ms-bmp', 'image/x-bmp', 'image/x-bitmap'],
  gif: ['image/gif'],
  svg: ['image/svg+xml'],
  mp4: ['video/mp4', 'application/mp4'],
  webm: ['video/webm'],
  zip: ['application/zip', 'application/x-zip', 'application/x-zip-compressed']
}

export const FILETYPES = {
  image: [
    MIMETYPES.png,
    MIMETYPES.jpg,
    MIMETYPES.webp,
    MIMETYPES.bmp,
    MIMETYPES.avif,
    MIMETYPES.gif,
  ].flat(),
  video: [
    MIMETYPES.mp4,
    MIMETYPES.webm,
  ].flat()
}

export const POINTERTYPES = {
  mouse: 'mouse',
  touch: 'touch'
}