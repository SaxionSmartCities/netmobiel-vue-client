export function resizeImage(base64image, width, height) {
  let img = new Image()
  img.src = base64image

  img.onload = () => {
    // Check if the image require resize at all
    if (img.height <= height && img.width <= width) {
      this.base64ResizedImage = base64image

      // TODO: Call method to do something with the resize image
    } else {
      // Make sure the width and height preserve the original aspect ratio and adjust if needed
      if (img.height > img.width) {
        width = Math.floor(height * (img.width / img.height))
      } else {
        height = Math.floor(width * (img.height / img.width))
      }

      let resizingCanvas = document.createElement('canvas')
      let resizingCanvasContext = resizingCanvas.getContext('2d')

      // Start with original image size
      resizingCanvas.width = img.width
      resizingCanvas.height = img.height

      // Draw the original image on the (temp) resizing canvas
      resizingCanvasContext.drawImage(
        img,
        0,
        0,
        resizingCanvas.width,
        resizingCanvas.height
      )

      let curImageDimensions = {
        width: Math.floor(img.width),
        height: Math.floor(img.height),
      }

      let halfImageDimensions = {
        width: null,
        height: null,
      }

      // Quickly reduce the dize by 50% each time in few iterations until the size is less then
      // 2x time the target size - the motivation for it, is to reduce the aliasing that would have been
      // created with direct reduction of very big image to small image
      while (curImageDimensions.width * 0.5 > width) {
        // Reduce the resizing canvas by half and refresh the image
        halfImageDimensions.width = Math.floor(curImageDimensions.width * 0.5)
        halfImageDimensions.height = Math.floor(curImageDimensions.height * 0.5)

        resizingCanvasContext.drawImage(
          resizingCanvas,
          0,
          0,
          curImageDimensions.width,
          curImageDimensions.height,
          0,
          0,
          halfImageDimensions.width,
          halfImageDimensions.height
        )

        curImageDimensions.width = halfImageDimensions.width
        curImageDimensions.height = halfImageDimensions.height
      }

      // Now do final resize for the resizingCanvas to meet the dimension requirments
      // directly to the output canvas, that will output the final image
      let outputCanvas = document.createElement('canvas')
      let outputCanvasContext = outputCanvas.getContext('2d')

      outputCanvas.width = width
      outputCanvas.height = height

      outputCanvasContext.drawImage(
        resizingCanvas,
        0,
        0,
        curImageDimensions.width,
        curImageDimensions.height,
        0,
        0,
        width,
        height
      )

      // output the canvas pixels as an image. params: format, quality
      this.base64ResizedImage = outputCanvas.toDataURL('image/jpeg', 0.85)

      // TODO: Call method to do something with the resize image
    }
  }
}

function getImageSize(imageURL, callback) {
  // Create image object to ascertain dimensions.
  var image = new Image()

  // Get image data when loaded.
  image.onload = function() {
    // No callback? Show error.
    if (!callback) {
      console.log(
        'Error getting image size: no callback. Image URL: ' + imageURL
      )

      // Yes, invoke callback with image size.
    } else {
      callback(this.naturalWidth, this.naturalHeight)
    }
  }

  // Load image.
  image.src = imageURL
}

// const dataURItoBlob = dataURI => {
//   const bytes =
//     dataURI.split(',')[0].indexOf('base64') >= 0
//       ? atob(dataURI.split(',')[1])
//       : unescape(dataURI.split(',')[1])
//   const mime = dataURI
//     .split(',')[0]
//     .split(':')[1]
//     .split(';')[0]
//   const max = bytes.length
//   const ia = new Uint8Array(max)
//   for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i)
//   return new Blob([ia], { type: mime })
// }
//
// export const resizeImage = ({ file, maxSize }) => {
//   const reader = new FileReader()
//   const image = new Image()
//   const canvas = document.createElement('canvas')
//
//   const resize = () => {
//     let { width, height } = image
//
//     if (width > height) {
//       if (width > maxSize) {
//         height *= maxSize / width
//         width = maxSize
//       }
//     } else if (height > maxSize) {
//       width *= maxSize / height
//       height = maxSize
//     }
//
//     canvas.width = width
//     canvas.height = height
//     canvas.getContext('2d').drawImage(image, 0, 0, width, height)
//
//     const dataUrl = canvas.toDataURL('image/jpeg')
//
//     return dataURItoBlob(dataUrl)
//   }
//
//   return new Promise((ok, no) => {
//     if (!file.type.match(/image.*/)) {
//       no(new Error('Not an image'))
//       return
//     }
//
//     reader.onload = readerEvent => {
//       image.onload = () => ok(resize())
//       image.src = readerEvent.target.result
//     }
//
//     reader.readAsDataURL(file)
//   })
// }
