import assert from 'node:assert/strict'
import test from 'node:test'
import {
  contrastRatio,
  defaultSettings,
  interfaceCss,
  interfaceVariables,
} from '../src/Pages/LearningLab/interfaceModel.ts'

test('contrast matches the black/white endpoints and is symmetric', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21)
  assert.equal(contrastRatio('#123456', '#123456'), 1)
  assert.equal(
    contrastRatio('#d93328', '#ffffff'),
    contrastRatio('#ffffff', '#d93328')
  )
})

test('a rounded 4.5 contrast result must not pass the actual threshold', () => {
  const ratio = contrastRatio('#777777', '#ffffff')
  assert.ok(Math.abs(ratio - 4.478089453577214) < 0.000001)
  assert.ok(ratio < 4.5)
})

test('visual choices are independent and export remains plain CSS', () => {
  const original = interfaceVariables(defaultSettings)
  const changed = interfaceVariables({
    ...defaultSettings,
    font: 2,
    shape: 0,
    density: 0,
  })
  assert.equal(changed['--preview-accent'], original['--preview-accent'])
  assert.equal(changed['--preview-radius'], '0px')
  assert.equal(changed['--preview-space'], '20px')
  assert.match(changed['--preview-font'], /Georgia/)
  assert.match(
    interfaceCss({ ...defaultSettings, palette: 1 }),
    /--preview-accent: #155e75;/
  )
  assert.equal(interfaceVariables(defaultSettings)['--preview-radius'], '20px')
})
