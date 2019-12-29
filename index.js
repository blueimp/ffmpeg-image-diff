/*
 * An image diffing library using FFmpeg.
 * Creates an image showing perceptual differences and returns SSIM data.
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
 * https://opensource.org/licenses/MIT
 */

'use strict'

/**
 * @typedef {object} Options Image diffing options
 * @property {boolean} [ssim=true] Set to `false` to disable SSIM calculation
 * @property {number} [similarity=0.01] Threshold to identify image differences
 * @property {number} [blend=1.0] Blend percentage for the differential pixels
 * @property {number} [opacity=0.1] Opacity of the reference image as backdrop
 * @property {string} [color=magenta] Color balance of the differential pixels
 */

/**
 * @typedef {object} Result
 * @property {number} [R] Red color differences
 * @property {number} [G] Green color differences
 * @property {number} [B] blue color differences
 * @property {number} [All] All color differences
 */

const execFile = require('util').promisify(require('child_process').execFile)

/**
 * Compares two images, creates diff and returns differences as SSIM stats.
 *
 * @param {string} refImg File path to reference image
 * @param {string} cmpImg File path to comparison image
 * @param {Array} args ffmpeg arguments
 * @returns {Promise<Result>} Resolves with the image comparison result
 */
function ffmpeg(refImg, cmpImg, args) {
  return execFile(
    'ffmpeg',
    ['-loglevel', 'error', '-i', refImg, '-i', cmpImg].concat(args)
  ).then(function(result) {
    // SSIM log output has the following format:
    // n:1 R:x.xxxxxx G:x.xxxxxx B:x.xxxxxx All:x.xxxxxx (xx.xxxxxx)
    // We only keep the R, G, B and All values and turn them into an object:
    return result.stdout
      .split(' ')
      .slice(1, -1)
      .reduce(function(obj, val) {
        const tupel = val.split(':')
        obj[tupel[0]] = parseFloat(tupel[1])
        return obj
      }, {})
  })
}

/**
 * Compares two images, creates diff img and returns differences as SSIM stats.
 *
 * @param {string} refImg File path to reference image
 * @param {string} cmpImg File path to comparison image
 * @param {string} [outImg] File path to output image
 * @param {Options} [options] Image diffing options
 * @returns {Promise<Result>} Resolves with the image comparison result
 */
function imageDiff(refImg, cmpImg, outImg, options) {
  if (!outImg) {
    // Resolve with the SSIM stats without creating a differential image:
    return ffmpeg(refImg, cmpImg, [
      '-filter_complex',
      'ssim=stats_file=-',
      '-f',
      'null',
      '-'
    ])
  }
  const opts = Object.assign(
    {
      ssim: true, // true or false
      similarity: 0.01, // 1.0 - 0.01
      blend: 1.0, // 1.0 - 0.0
      opacity: 0.1, // 1.0 - 0.0
      color: 'magenta' // magenta, yellow, cyan, red green, blue or ''
    },
    options
  )
  const ssim = opts.ssim ? 'ssim=stats_file=-[ssim];[ssim][1]' : ''
  const colorkey =
    'format=rgba,colorkey=white' +
    `:similarity=${opts.similarity}:blend=${opts.blend}`
  let colorbalance = 'colorbalance='
  switch (opts.color) {
    case 'magenta':
      colorbalance += `rs=1:gs=-1:bs=1:rm=1:gm=-1:bm=1:rh=1:gh=-1:bh=1`
      break
    case 'yellow':
      colorbalance += `rs=1:gs=1:bs=-1:rm=1:gm=1:bm=-1:rh=1:gh=1:bh=-1`
      break
    case 'cyan':
      colorbalance += `rs=-1:gs=1:bs=1:rm=-1:gm=1:bm=1:rh=-1:gh=1:bh=1`
      break
    case 'red':
      colorbalance += `rs=1:gs=-1:bs=-1:rm=1:gm=-1:bm=-1:rh=1:gh=-1:bh=-1`
      break
    case 'green':
      colorbalance += `rs=-1:gs=1:bs=-1:rm=-1:gm=1:bm=-1:rh=-1:gh=1:bh=-1`
      break
    case 'blue':
      colorbalance += `rs=-1:gs=-1:bs=1:rm=-1:gm=-1:bm=1:rh=-1:gh=-1:bh=1`
      break
    default:
      colorbalance += opts.color
  }
  // Create a differential image with transparent background.
  // The differences are highlighted with the given colorbalance:
  const diff = `blend=all_mode=phoenix,${colorkey},${colorbalance}[diff];`
  // Use the reference file as background with the given opacity:
  const bg =
    opts.opacity < 1
      ? `format=rgba,colorchannelmixer=aa=${opts.opacity}[bg];[bg]`
      : ''
  // Overlay the background with the diff:
  const overlay = `[0]${bg}[diff]overlay=format=rgb`
  // Create a differential image with the given arguments:
  return ffmpeg(refImg, cmpImg, [
    '-filter_complex',
    `${ssim}${diff}${overlay}`,
    '-y',
    outImg
  ])
}

module.exports = imageDiff
