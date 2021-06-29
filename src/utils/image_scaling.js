/* eslint-disable */
function resizeImage(base64image, width, height) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  const img = new Image()
  img.src = base64image

  canvas.width = width
  canvas.height = height

  ctx.drawImage(img, 0, 0, width, height)

  return canvas.toDataURL()
}

function getFileSize(base64) {
  //  If last chars of the base64 string is '==' then y = 2. else y = 1
  var stringLength = base64.length - 'data:image/png;base64,'.length
  var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
  return sizeInBytes / 1000
}

async function getImageDimensions(base64Image) {
  return new Promise(resolve => {
    var img = new Image()
    let height, width
    img.src = base64Image
    img.onload = function() {
      height = img.naturalHeight
      width = img.naturalWidth
      resolve({ height, width })
    }
  })
}

/*
 * This function scales an image down to a defined target size.
 * @param image: the base64 string of the image
 * @param target: is the target in kB
 */
export function scaleImageDown(image, target) {
  const originalFileSize = getFileSize(image)
  return new Promise(resolve => {
    getImageDimensions(image).then(({ height, width }) => {
      const resizeFactor = Math.ceil(originalFileSize / target)
      resolve(resizeImage(image, width / resizeFactor, height / resizeFactor))
    })
  })
}
