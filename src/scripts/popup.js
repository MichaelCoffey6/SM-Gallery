import { $ } from "./const.js"

export const confirmation = (popupFixed, fileType) => {
  const { promise, resolve, reject } = Promise.withResolvers()
  const fileTypeCont = $('.fileTypeCont', popupFixed)
  const acceptBtn = $('.acceptBtn', popupFixed)
  const cancelBtn = $('.cancelBtn', popupFixed)

  fileTypeCont.innerText = fileType

  popupFixed.hidden = false
  acceptBtn.onclick = resolve
  cancelBtn.onclick = reject

  return promise
}