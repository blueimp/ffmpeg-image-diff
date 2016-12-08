#!/usr/bin/env node

'use strict'

process.chdir(__dirname)

// Throw for any unhandled rejections in Promise chains:
process.on('unhandledRejection', function (reason) { throw reason })

const assert = require('assert')
const imgDiff = require('../index')

const refImg = 'lenna.png'
const cmpImg = 'lenna-edit.png'

function test (outImg, options) {
  return imgDiff(refImg, cmpImg, outImg, options)
    .then((result) => {
      assert.ok(result)
      if (options && options.ssim === false) {
        assert.deepEqual(result, {})
      } else {
        assert.strictEqual(typeof result.R, 'number')
        assert.strictEqual(typeof result.G, 'number')
        assert.strictEqual(typeof result.B, 'number')
        assert.strictEqual(typeof result.All, 'number')
      }
    })
}

test() // SSIM only
  .then(() => test('out.png')) // Default options (color: 'magenta')
  .then(() => test('out-color-yellow.png', {color: 'yellow'}))
  .then(() => test('out-color-cyan.png', {color: 'cyan'}))
  .then(() => test('out-color-red.png', {color: 'red'}))
  .then(() => test('out-color-green.png', {color: 'green'}))
  .then(() => test('out-color-blue.png', {color: 'blue'}))
  .then(() => test('out-color-empty.png', {color: ''}))
  .then(() => test('out-similarity-1.png', {similarity: 1}))
  .then(() => test('out-blend-0.png', {blend: 0}))
  .then(() => test('out-opacity-0.png', {opacity: 0}))
  .then(() => test('out-opacity-1.png', {opacity: 1}))
  .then(() => test('out-ssim-false.png', {ssim: false}))
