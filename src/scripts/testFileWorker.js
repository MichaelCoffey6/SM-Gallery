importScripts('./jszip.js')

self.addEventListener('message', async ({ data: file }) => {
  try {
    const data = await file.bytes()
    const zip = await JSZip.loadAsync(data)
    const entries = await Promise.all(
      Object.entries(zip.files).map(async ([path, fileObj]) => {
        const { date, name } = fileObj
        const uint = await fileObj.async('uint8array')
        
        return [ 
          path, 
          { uint, date, name } 
        ]
      })
    )
    
    self.postMessage(entries)
  } catch (e) {
    self.postMessage(e.message)
  }
})