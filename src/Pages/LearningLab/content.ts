const pt = {
  back: 'Voltar ao laboratório',
  skip: 'Pular para o conteúdo',
  menu: 'Abrir navegação',
  closeMenu: 'Fechar navegação',
  navigation: 'Navegação da página',
  nav: ['O conceito', 'Playground', 'A bancada', 'Dúvidas'],
  try: 'Mexer na interface',
  breadcrumb: 'LAB / DESIGN EM CONSTRUÇÃO',
  heroTag: '#PORTRÁSDOSPIXELS',
  heroTitle: ['Bastidores de', 'uma interface.'],
  heroText:
    'Por que esse botão tem essa cor? Por que esse título chama atenção? Toda tela tem escolhas. Aqui você pode mexer nelas e descobrir o que muda.',
  heroAction: 'Entrar no playground',
  aboutTag: 'NADA AQUI É POR ACASO.',
  aboutTitle: 'Bonito é o começo. Fazer sentido é o desafio.',
  aboutText:
    'Uma interface é feita de pequenas decisões que trabalham juntas: o contraste orienta o olhar, a tipografia define o tom e o espaço ajuda a entender o que importa.',
  aboutSecond:
    'Este é um pedaço do meu processo de criação aberto para você. Explore as decisões e teste diferentes combinações em uma interface de verdade, sem precisar escrever código.',
  benefits: [
    'Hierarquia visual',
    'Tipografia',
    'Contraste',
    'Responsividade',
    'Feedback de interação',
  ],
  preview: 'UMA TELA, MUITAS DECISÕES',
  previewTitle: 'O detalhe muda tudo.',
  previewCode: [
    '01 / o que merece atenção?',
    '02 / o que pode respirar?',
    '03 / o que acontece ao clicar?',
  ],
  noteTitle: 'Pode mexer. É para isso.',
  noteText:
    'Na bancada, você escolhe a paleta, muda a tipografia e revela a estrutura por trás da composição.',
  tracksTag: 'ABRINDO A CAIXA DE FERRAMENTAS',
  tracksTitle: 'Seis escolhas. Outra experiência.',
  tracksText:
    'O que parece um detalhe pode mudar a forma como você lê, entende e usa uma tela.',
  filters: ['Todas as decisões', 'Visual', 'Estrutura', 'Interação'],
  tracks: [
    {
      title: 'Cor com intenção',
      text: 'Uma cor pode destacar uma ação. Muitas cores competindo podem esconder todas elas.',
      tags: ['Paleta', 'Contraste', 'Foco'],
      detail:
        'Troque a paleta na bancada e observe a ação principal. O contraste entre texto e botão também aparece em números: a referência para texto comum é 4,5:1.',
    },
    {
      title: 'A voz das letras',
      text: 'O mesmo texto pode parecer divertido, direto ou editorial. A tipografia muda o tom.',
      tags: ['Tipografia', 'Personalidade', 'Leitura'],
      detail:
        'Alterne entre expressiva, direta e editorial. Repare nas quebras de linha e na personalidade do título. Os controles continuam com uma fonte simples para facilitar a leitura.',
    },
    {
      title: 'Espaço para entender',
      text: 'O espaço aproxima o que pertence ao mesmo grupo e separa o que precisa respirar.',
      tags: ['Espaçamento', 'Ritmo', 'Agrupamento'],
      detail:
        'Compare a densidade compacta com a arejada. A quantidade de conteúdo permanece igual; o espaço muda o ritmo de leitura e o tamanho da composição.',
    },
    {
      title: 'Forma também comunica',
      text: 'Cantos retos, arredondados ou em cápsula dão pistas diferentes sobre uma ação.',
      tags: ['Forma', 'Consistência', 'Componentes'],
      detail:
        'Mude os cantos na bancada. Cartões, etiquetas e botões compartilham a mesma escolha para que a composição continue coerente.',
    },
    {
      title: 'A estrutura aparece',
      text: 'Retire a decoração por um instante. A hierarquia ainda precisa fazer sentido.',
      tags: ['Wireframe', 'Hierarquia', 'Acessibilidade'],
      detail:
        'Ative o modo estrutura para enxergar os blocos. Use Tab para visitar os controles e a ação da prévia: o foco visível também faz parte da interface.',
    },
    {
      title: 'Um clique pede resposta',
      text: 'Uma ação precisa deixar claro o que aconteceu. Feedback fecha a conversa com quem usa.',
      tags: ['Estados', 'Feedback', 'Experiência'],
      detail:
        'Clique na ação principal da prévia. Ela muda de estado e confirma o resultado. Reinicie a prévia para repetir; nada é enviado ou contratado.',
    },
  ],
  trackAction: 'Entender a escolha',
  challengeLabel: 'OLHE PARA ISSO NA BANCADA',
  ctaTag: 'AGORA É A SUA VEZ DE DECIDIR.',
  ctaTitle: 'A mesma ideia. Muitas interfaces.',
  ctaText:
    'Mude uma escolha de cada vez. Observe o resultado. É assim que uma composição começa a ganhar intenção.',
  faqTag: 'O QUE FICA NOS BASTIDORES',
  faqTitle: 'Algumas respostas antes de mexer.',
  questions: [
    {
      title: 'Isso mostra como você trabalha?',
      text: 'É uma demonstração de decisões que fazem parte do desenvolvimento de interfaces: hierarquia, consistência, leitura, adaptação e feedback. A bancada simplifica essas escolhas para você experimentar.',
    },
    {
      title: 'Posso estragar alguma coisa?',
      text: 'Pode testar à vontade. Desenhos, escolhas e progresso ficam apenas na memória desta página. Ao sair ou recarregar, tudo recomeça. Na pixel art, você pode desfazer e refazer; na bancada, restaurar a composição inicial.',
    },
    {
      title: 'O contraste garante acessibilidade?',
      text: 'Não sozinho. O indicador calcula apenas o contraste do texto sobre o botão principal. Acessibilidade também envolve navegação por teclado, semântica, foco, conteúdo e testes com diferentes pessoas e tecnologias.',
    },
    {
      title: 'Posso levar minha combinação?',
      text: 'Sim! Baixe o ícone e o fundo em SVG, salve a animação e as variáveis em CSS ou combine suas criações no construtor e exporte uma página HTML independente. O HTML abre no navegador e já incorpora seu ícone e fundo.',
    },
  ],
  footerTitle: 'Uma boa interface começa com boas perguntas.',
  footerText: 'Um experimento sobre as escolhas por trás de uma tela.',
}

const en: typeof pt = {
  back: 'Back to the lab',
  skip: 'Skip to content',
  menu: 'Open navigation',
  closeMenu: 'Close navigation',
  navigation: 'Page navigation',
  nav: ['The concept', 'Playground', 'The workbench', 'Questions'],
  try: 'Remix the interface',
  breadcrumb: 'LAB / DESIGN IN PROGRESS',
  heroTag: '#BEHINDTHEPIXELS',
  heroTitle: ['Behind', 'the interface.'],
  heroText:
    'Why is that button that color? Why does this heading stand out? Every screen is full of choices. Here you can change them and see what happens.',
  heroAction: 'Enter the playground',
  aboutTag: 'EVERY DETAIL IS A DECISION.',
  aboutTitle: 'Looking good is a start. Making sense is the challenge.',
  aboutText:
    'An interface is built from small decisions working together: contrast guides the eye, typography sets the tone and space helps you understand what matters.',
  aboutSecond:
    'This is a little of my creative process, open for you to explore. Discover the decisions and try different combinations in a real interface without writing code.',
  benefits: [
    'Visual hierarchy',
    'Typography',
    'Contrast',
    'Responsive design',
    'Interaction feedback',
  ],
  preview: 'ONE SCREEN, MANY DECISIONS',
  previewTitle: 'Details change everything.',
  previewCode: [
    '01 / what deserves attention?',
    '02 / what needs breathing room?',
    '03 / what happens after a click?',
  ],
  noteTitle: 'Go ahead. Change things.',
  noteText:
    'At the workbench, you choose the palette, change the type and reveal the structure behind the composition.',
  tracksTag: 'OPENING THE TOOLBOX',
  tracksTitle: 'Six choices. A different experience.',
  tracksText:
    'What looks like a detail can change the way you read, understand and use a screen.',
  filters: ['All decisions', 'Visual', 'Structure', 'Interaction'],
  tracks: [
    {
      title: 'Color with purpose',
      text: 'One color can highlight an action. Too many competing colors can hide every action.',
      tags: ['Palette', 'Contrast', 'Focus'],
      detail:
        'Switch palettes at the workbench and look at the main action. The contrast between the label and button is also shown as a number: the reference for regular text is 4.5:1.',
    },
    {
      title: 'The voice of type',
      text: 'The same words can feel playful, direct or editorial. Typography changes the tone.',
      tags: ['Typography', 'Personality', 'Reading'],
      detail:
        'Switch between expressive, direct and editorial. Notice the line breaks and the heading’s personality. Controls keep a simple font for easier reading.',
    },
    {
      title: 'Room to understand',
      text: 'Space brings related things together and separates what needs breathing room.',
      tags: ['Spacing', 'Rhythm', 'Grouping'],
      detail:
        'Compare compact and airy density. The amount of content stays the same; spacing changes the reading rhythm and the size of the composition.',
    },
    {
      title: 'Shape communicates',
      text: 'Sharp, rounded and pill-shaped corners give different cues about an action.',
      tags: ['Shape', 'Consistency', 'Components'],
      detail:
        'Change the corners at the workbench. Cards, labels and buttons share the same choice to keep the composition consistent.',
    },
    {
      title: 'Reveal the structure',
      text: 'Remove the decoration for a moment. The hierarchy still needs to make sense.',
      tags: ['Wireframe', 'Hierarchy', 'Accessibility'],
      detail:
        'Enable structure mode to see the blocks. Use Tab to visit the controls and the preview action: visible focus is part of the interface, too.',
    },
    {
      title: 'A click needs a reply',
      text: 'An action should make its outcome clear. Feedback completes the conversation.',
      tags: ['States', 'Feedback', 'Experience'],
      detail:
        'Click the preview’s main action. Its state changes to confirm the result. Reset the preview to repeat; nothing is sent or purchased.',
    },
  ],
  trackAction: 'Understand the choice',
  challengeLabel: 'LOOK FOR THIS AT THE WORKBENCH',
  ctaTag: 'NOW IT’S YOUR TURN TO DECIDE.',
  ctaTitle: 'The same idea. Many interfaces.',
  ctaText:
    'Change one choice at a time. Observe the result. This is how a composition starts to gain purpose.',
  faqTag: 'WHAT STAYS BEHIND THE SCENES',
  faqTitle: 'A few answers before you start.',
  questions: [
    {
      title: 'Does this show how you work?',
      text: 'It demonstrates decisions involved in building interfaces: hierarchy, consistency, reading, adaptation and feedback. The workbench simplifies these choices so you can try them.',
    },
    {
      title: 'Can I break anything?',
      text: 'Experiment freely. Drawings, choices and progress stay in this page’s memory. Leaving or refreshing starts over. Pixel art supports undo and redo; the workbench can restore its original composition.',
    },
    {
      title: 'Does contrast guarantee accessibility?',
      text: 'Not on its own. The indicator only calculates text contrast on the main button. Accessibility also involves keyboard navigation, semantics, focus, content and testing with different people and technologies.',
    },
    {
      title: 'Can I keep my combination?',
      text: 'Yes! Download the icon and background as SVG, save animation and variables as CSS, or combine your creations in the builder and export a standalone HTML page. It opens in your browser with your icon and background embedded.',
    },
  ],
  footerTitle: 'A good interface begins with good questions.',
  footerText: 'An experiment about the choices behind a screen.',
}

export type LearningCopy = typeof pt
export const learningCopy = { pt, en }
