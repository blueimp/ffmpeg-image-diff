'use strict'

/* global describe, it */

const assert = require('assert')
const imgDiff = require('.')

const referenceImage = 'samples/lenna.png'
const comparisonImage = 'samples/lenna-edit.png'

describe('image diff', function () {
  this.slow(300)

  it('no output image', async function () {
    this.slow(150)
    const result = await imgDiff(referenceImage, comparisonImage)
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('default', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/default.png'
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color yellow', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-yellow.png',
      { color: 'yellow' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color cyan', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-cyan.png',
      { color: 'cyan' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color red', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-red.png',
      { color: 'red' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color green', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-green.png',
      { color: 'green' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color blue', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-blue.png',
      { color: 'blue' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('color empty', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/color-empty.png',
      { color: '' }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('similarity 1', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/similarity-1.png',
      { similarity: 1 }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('blend 0', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/blend-0.png',
      { blend: 0 }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('opacity 0', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/opacity-0.png',
      { opacity: 0 }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('opacity 1', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/opacity-1.png',
      { opacity: 1 }
    )
    assert.strictEqual(typeof result.R, 'number')
    assert.strictEqual(typeof result.G, 'number')
    assert.strictEqual(typeof result.B, 'number')
    assert.strictEqual(typeof result.All, 'number')
  })

  it('ssim false', async function () {
    const result = await imgDiff(
      referenceImage,
      comparisonImage,
      'output/ssim-false.png',
      { ssim: false }
    )
    assert.strictEqual(result.constructor, Object)
    assert.strictEqual(Object.entries(result).length, 0)
  })
})
