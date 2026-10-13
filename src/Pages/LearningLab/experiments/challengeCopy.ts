const pt = {
  title: 'Seu olhar de designer está afiado?',
  text: 'Compare duas composições e escolha a que resolve melhor o objetivo. Não é uma prova: a explicação faz parte da descoberta.',
  questions: [
    {
      title: 'Qual versão deixa mais clara a ação principal?',
      options: [
        'Três ações com o mesmo destaque',
        'Uma ação principal e duas alternativas',
      ],
      correct: 1,
      explanation:
        'Quando todas as ações têm o mesmo peso, fica mais difícil decidir. Uma ação principal cria um ponto de partida; as alternativas continuam disponíveis.',
    },
    {
      title: 'Qual versão agrupa melhor o campo e seu rótulo?',
      options: [
        'Rótulo próximo do campo correspondente',
        'Rótulos separados dos campos por muito espaço',
      ],
      correct: 0,
      explanation:
        'A proximidade ajuda a perceber o que pertence ao mesmo grupo. Espaço é útil, mas colocá-lo entre rótulo e campo pode enfraquecer essa relação.',
    },
    {
      title: 'Qual versão facilita perceber o resultado de um clique?',
      options: ['O botão permanece igual', 'A ação confirma que foi concluída'],
      correct: 1,
      explanation:
        'Uma confirmação tira a dúvida sobre o que aconteceu. Feedback pode combinar texto, estado do botão e um aviso acessível; não precisa depender só da cor.',
    },
  ],
  action: 'Continuar',
  other: 'Ver detalhes',
  label: 'Sua ideia',
  field: 'Um projeto novo',
  before: 'Criar projeto',
  after: 'Projeto criado',
  choose: 'Escolha uma versão para revelar o porquê.',
  correct: 'Boa leitura da interface!',
  incorrect: 'Vale olhar por outro ângulo.',
  next: 'Próxima decisão',
  finish: 'Ver meu resultado',
  restart: 'Experimentar de novo',
  resultTitle: 'Três decisões que você já enxerga diferente.',
  resultText: 'Decisões alinhadas ao objetivo',
  resultHint:
    'Leve esse olhar para a bancada. Experimente as opções e observe o que chama atenção primeiro.',
  progress: 'Decisão',
  of: 'de',
}
const en: typeof pt = {
  title: 'How sharp is your designer’s eye?',
  text: 'Compare two compositions and choose the one that better meets the goal. It is not an exam: the explanation is part of the discovery.',
  questions: [
    {
      title: 'Which version makes the main action clearer?',
      options: [
        'Three equally prominent actions',
        'One primary action and two alternatives',
      ],
      correct: 1,
      explanation:
        'When every action carries the same weight, deciding becomes harder. One main action creates a starting point while alternatives stay available.',
    },
    {
      title: 'Which version better groups a field and its label?',
      options: [
        'A label close to its corresponding field',
        'Labels separated from fields by a large gap',
      ],
      correct: 0,
      explanation:
        'Proximity helps us see what belongs together. Space is useful, but placing it between a label and field can weaken that relationship.',
    },
    {
      title: 'Which version makes a click’s outcome easier to see?',
      options: [
        'The button stays unchanged',
        'The action confirms it has been completed',
      ],
      correct: 1,
      explanation:
        'Confirmation removes doubt about what happened. Feedback can combine text, button state and an accessible notice; it does not need to rely on color alone.',
    },
  ],
  action: 'Continue',
  other: 'View details',
  label: 'Your idea',
  field: 'A new project',
  before: 'Create project',
  after: 'Project created',
  choose: 'Choose a version to reveal why.',
  correct: 'You read the interface well!',
  incorrect: 'Try another angle.',
  next: 'Next decision',
  finish: 'See my result',
  restart: 'Try again',
  resultTitle: 'Three decisions you can now see differently.',
  resultText: 'Decisions aligned with the goal',
  resultHint:
    'Take this perspective to the workbench. Try its options and notice what catches your attention first.',
  progress: 'Decision',
  of: 'of',
}
export const challengeCopy = { pt, en }
export type ChallengeCopy = typeof pt
