const pt = {
  title: 'Uma interação também tem ritmo.',
  text: 'O mesmo movimento pode parecer pesado, ágil ou elástico. Escolha uma trajetória e compare a sensação.',
  modes: ['Deslizar', 'Saltar', 'Revelar'],
  mode: 'Tipo de movimento',
  curves: ['Linear', 'Suave', 'Elástica'],
  curve: 'Curva de movimento',
  duration: 'Duração',
  play: 'Testar movimento',
  save: 'Baixar animação CSS',
  hint: 'O movimento só começa quando você pede. Experimente uma duração curta e depois uma mais longa.',
  reduced:
    'Seu dispositivo pede menos movimento. Mostramos o estado final sem animação.',
  status: 'Movimento executado. Troque uma escolha e compare novamente.',
  saved: 'Animação baixada em movimento.css.',
  stage: 'Prévia do movimento',
  observations: [
    'Linear: a velocidade fica constante. Observe como a parada parece mais brusca.',
    'Suave: a chegada desacelera. Uma opção para transições que precisam parecer mais discretas.',
    'Elástica: a curva ultrapassa o destino antes de se acomodar. Use com intenção para não distrair.',
  ],
}
const en: typeof pt = {
  title: 'An interaction has a rhythm, too.',
  text: 'The same movement can feel heavy, quick or elastic. Choose a path and compare how it feels.',
  modes: ['Slide', 'Jump', 'Reveal'],
  mode: 'Movement type',
  curves: ['Linear', 'Smooth', 'Elastic'],
  curve: 'Movement curve',
  duration: 'Duration',
  play: 'Try the motion',
  save: 'Download animation CSS',
  hint: 'Motion only starts when you ask. Try a short duration and then a longer one.',
  reduced:
    'Your device requests less motion. We show the final state without animation.',
  status: 'Motion played. Change a choice and compare again.',
  saved: 'Animation downloaded as movimento.css.',
  stage: 'Motion preview',
  observations: [
    'Linear: the speed stays constant. Notice how the stop feels more abrupt.',
    'Smooth: the arrival slows down. An option for transitions that need to feel more subtle.',
    'Elastic: the curve goes beyond its destination before settling. Use it intentionally to avoid distraction.',
  ],
}
export const motionCopy = { pt, en }
