export const numTo2 = num => String(num).padStart(2, '0')

export const tryP = async prom => {
  try {
    const res = prom instanceof Promise
      ? await prom
      : await prom()

    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

export const getPicSize = item => {
  if (item instanceof HTMLImageElement) {
    return {
      w: item.width,
      h: item.height
    }
  }

  return {
    w: item.videoWidth,
    h: item.videoHeight
  }
}

export const arr = iter => new Proxy({}, {
  get(_, key) {
    if (key in Array.prototype) {
      const value = Array.prototype[key]
      
      if (typeof value === 'function') {
        return (...args) => Array.prototype[key].apply(iter, args)
      }
      
      return value
    }
    
    return iter[key]
  }
})

export const convertBytes = n => {
  if (n === 0) return "0 bytes"
  const k = Math.floor((Math.log10(n) / 3))
  const rank = 'KMGT'[k - 1]
  const count = (n / Math.pow(1000, k)).toFixed(2).replace(/.00$/, '')
  return count + ' ' + (rank ? rank + 'B' : 'bytes')
}

export const formatSeconds = seconds => {
  const hours = numTo2(Math.floor(seconds / 3600))
  const minutes = numTo2(Math.floor((seconds % 3600) / 60))
  return `${+hours ? hours + ':' : ''}${minutes}:${numTo2(Math.floor(seconds))}`
}