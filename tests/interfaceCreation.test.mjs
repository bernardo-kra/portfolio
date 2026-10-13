import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildPage,
  defaultSections,
  moveSection,
} from '../src/Pages/LearningLab/experiments/builderModel.ts'
import {
  defaultPattern,
  patternSvg,
} from '../src/Pages/LearningLab/experiments/patternModel.ts'

test('block reordering preserves content and rejects invalid drag indices', () => {
  const reordered = moveSection(defaultSections, 0, 3)
  assert.deepEqual(reordered, ['story', 'features', 'action', 'hero'])
  assert.deepEqual(defaultSections, ['hero', 'story', 'features', 'action'])
  assert.equal(moveSection(defaultSections, NaN, 2), defaultSections)
  assert.equal(moveSection(defaultSections, 0, 4), defaultSections)
})

test('HTML export treats visitor text as content instead of markup', () => {
  const html = buildPage({
    title: '</title><script>alert(1)</script>',
    text: '<img src=x onerror="alert(2)">',
    action: '<svg onload=alert(3)>',
    sections: defaultSections,
    palette: 0,
    artwork: { icon: null, background: null },
    lang: 'pt',
  })
  assert.doesNotMatch(html, /<script\b|<img src=x|<svg onload/i)
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(2\)&quot;&gt;/)
  assert.match(html, /default-src 'none'/)
})

test('the exported page keeps selected order, language and embedded artwork', () => {
  const icon = 'data:image/svg+xml,%3Csvg%3E%3C%2Fsvg%3E'
  const html = buildPage({
    title: 'My project',
    text: 'Made here',
    action: 'Back',
    sections: ['features', 'hero'],
    palette: 1,
    artwork: { icon, background: icon },
    lang: 'en',
  })
  assert.match(html, /lang="en"/)
  assert.match(html, /--accent:#155e75/)
  assert.ok(
    html.indexOf('id="built-features"') < html.indexOf('id="built-hero"')
  )
  assert.ok(html.includes(icon))
  assert.doesNotMatch(html, /id="built-story"/)
})

test('generative artwork is reproducible and responds to variation and density', () => {
  const original = patternSvg(defaultPattern)
  assert.equal(patternSvg({ ...defaultPattern }), original)
  assert.notEqual(patternSvg({ ...defaultPattern, seed: 2 }), original)
  assert.equal(
    (patternSvg({ ...defaultPattern, density: 3 }).match(/<circle/g) || [])
      .length,
    9
  )
  assert.equal(
    (
      patternSvg({ ...defaultPattern, mode: 1, density: 4 }).match(/<path/g) ||
      []
    ).length,
    16
  )
})
