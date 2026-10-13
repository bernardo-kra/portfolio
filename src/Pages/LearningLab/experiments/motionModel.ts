export const motionCurves = [
  'linear',
  'cubic-bezier(0.22, 1, 0.36, 1)',
  'cubic-bezier(0.34, 1.56, 0.64, 1)',
]
export const motionNames = ['slide', 'jump', 'reveal']
const keyframes = [
  'from { transform: translateX(0); } to { transform: translateX(180%); }',
  '0% { transform: translate(0, 0); } 50% { transform: translate(90%, -100%); } 100% { transform: translate(180%, 0); }',
  'from { opacity: 0; transform: scale(0.6) rotate(-12deg); } to { opacity: 1; transform: scale(1) rotate(0); }',
]
export function motionCss(mode: number, curve: number, duration: number) {
  return `.motion-demo {\n  animation: ${motionNames[mode]} ${duration}ms ${motionCurves[curve]} both;\n}\n\n@keyframes ${motionNames[mode]} {\n  ${keyframes[mode]}\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .motion-demo { animation: none; }\n}\n`
}
