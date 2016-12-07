'use strict'

/*
 * An image diffing library using FFmpeg.
 * Creates an image showing perceptual differences and returns SSIM data.
 *
 * Tested with FFmpeg versions 3.0 (Linux) and 3.2 (OSX).
 *
 * For documentation on the image filters used, please see
 * https://ffmpeg.org/ffmpeg-filters.html
 *
 * On the definition of SSIM, please see
 * https://en.wikipedia.org/wiki/Structural_similarity
 *
 * Copyright 2016, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://www.opensource.org/licenses/MIT
 */

function ffmpegImageDiff (refImg, cmpImg, args) {
  return new Promise((resolve, reject) => {
    require('child_process').execFile(
      'ffmpeg',
      [
        '-loglevel',
        'error',
        '-i',
        refImg,
        '-i',
        cmpImg
      ].concat(args),
      function (error, stdout, stderr) {
        if (error) {
          return reject(error)
        }
        // SSIM log output has the following format:
        // n:1 R:x.xxxxxx G:x.xxxxxx B:x.xxxxxx All:x.xxxxxx (xx.xxxxxx)
        // We only keep the R, G, B and All values and turn them into an object:
        resolve(stdout.split(' ').slice(1, -1).reduce((obj, val) => {
          const tupel = val.split(':')
          obj[tupel[0]] = parseFloat(tupel[1])
          return obj
        }, {}))
      }
    ).on('error', reject)
  })
}

module.exports = function (refImg, cmpImg, outImg, opts) {
  if (!outImg) {
    // Resolve with the SSIM stats without creating a differential image:
    return ffmpegImageDiff(refImg, cmpImg, [
      '-filter_complex',
      'ssim=stats_file=-',
      '-f',
      'null',
      '-'
    ])
  }
  const options = {
    ssim: true,       // true or false
    similarity: 0.01, // 1.0 - 0.01
    blend: 1.0,       // 1.0 - 0.0
    opacity: 0.1,     // 1.0 - 0.0
    color: 'pink'     // pink, yellow, green, blue, '', or FFmpeg colorbalance
  }
  if (opts) Object.assign(options, opts)
  const ssim = options.ssim
    ? 'ssim=stats_file=-[ssim];[ssim][1]'
    : ''
  const colorkey = 'format=rgba,colorkey=white' +
    `:similarity=${options.similarity}:blend=${options.blend}`
  let colorbalance = 'colorbalance='
  switch (options.color) {
    case 'pink':
      colorbalance += `rs=1:gs=-1:bs=1:rm=1:gm=-1:bm=1:rh=1:gh=-1:bh=1`
      break
    case 'yellow':
      colorbalance += `rs=1:gs=1:bs=-1:rm=1:gm=1:bm=-1:rh=1:gh=1:bh=-1`
      break
    case 'green':
      colorbalance += `rs=-1:gs=1:bs=-1:rm=-1:gm=1:bm=-1:rh=-1:gh=1:bh=-1`
      break
    case 'blue':
      colorbalance += `rs=-1:gs=-1:bs=1:rm=-1:gm=-1:bm=1:rh=-1:gh=-1:bh=1`
      break
    default:
      colorbalance += options.color
  }
  // Create a differential image with transparent background.
  // The differences are highlighted with the given colorbalance:
  const diff = `blend=all_mode=phoenix,${colorkey},${colorbalance}[diff];`
  // Use the reference file as background with the given opacity:
  const bg = options.opacity < 1
    ? `format=rgba,colorchannelmixer=aa=${options.opacity}[bg];[bg]`
    : ''
  // Overlay the background with the diff:
  const overlay = `[0]${bg}[diff]overlay=format=rgb`
  // Create a differential image with the given arguments:
  return ffmpegImageDiff(refImg, cmpImg, [
    '-filter_complex',
    `${ssim}${diff}${overlay}`,
    '-y',
    outImg
  ])
}
