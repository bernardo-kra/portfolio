# Revisão de UX

Atualização Neon Bay: a rota `/experimental3d` agora usa um terminal de espionagem steampunk em SVG/CSS, com missão de sintonia e interceptação. As referências abaixo à cena antiga (vídeo, portal, energia e sinais) são históricas. O diagnóstico e o roteiro atual de validação estão em [Experimental3D/README.md](./src/Pages/Experimental3D/README.md).

## Direção

O site apresenta a trajetória profissional e um laboratório de estudos. Os textos devem levar a evidências reais: experiência, código, demonstrações e currículo. Não usar depoimentos fictícios, métricas sem fonte ou promessas de resultado.

## Páginas revisadas

| Rota | Ajustes |
| --- | --- |
| `/` | Laboratório de estudos, apresentação profissional e faixa de competências. |
| `/portfolio` | Hierarquia de conteúdo, trajetória, estudos, currículo e contato direto. |
| `/agency` | Forma: agência conceitual com direção visual verde, menu móvel, galeria filtrável, detalhes em diálogo e notas expansíveis. |
| `/landing` | Estudo de interface identificado como tal, evidências reais, FAQ e contato sem falso sucesso de envio. |
| `/pomodoro` | Orientação inicial, layout mais compacto, atalhos que respeitam campos e botões, restauração de dados e ciclos vinculados à tarefa selecionada. |
| `/generative` | Controles explícitos, pausa real, modo imersivo, ajuda, resolução limitada e animação interrompida em aba oculta. |
| `/experimental3d` | Pausa da cena, controles rotulados, faixa reutilizável com estado do portal e navegação para outros estudos. |
| `/admin/chat` | Permissão derivada do usuário atual e saída de navegação nos estados de acesso restrito ou indisponibilidade. |
| Demais caminhos | Página 404 com alternativas de navegação, em vez de mostrar silenciosamente a home. |

## Componentes compartilhados

- `Ribbon`: faixas com tons diferentes, pausa por botão, hover ou foco e respeito a movimento reduzido. A cópia decorativa fica oculta de leitores de tela.
- `StudyGuide`: contexto do estudo, próximo experimento e acesso ao código.
- Textos podem ser selecionados e copiados. Botões compartilhados possuem indicação de foco pelo teclado.

## Comportamentos importantes

- O formulário da landing prepara um email no aplicativo do visitante. Não envia mensagens pela API e não informa que houve entrega. Há alternativas por email direto e LinkedIn.
- Ao reabrir o Pomodoro, os dados salvos são carregados antes da gravação inicial. O cronômetro volta pausado, preservando o tempo restante.
- Um ciclo sem tarefa vinculada não é atribuído automaticamente à primeira tarefa da lista.
- As faixas não foram adicionadas à área de foco do Pomodoro nem sobre a arte generativa.
- A antiga rota de demonstração `/custom`, sem conteúdo próprio, agora segue o tratamento 404.

## Verificação

Compilação, TypeScript e lint foram executados. A revisão de código e as respostas HTTP locais não substituem testes de interação no navegador.

Antes de publicar, conferir manualmente:

1. Navegação entre páginas, âncoras e download do currículo.
2. Todas as páginas em 360 px, 768 px e desktop, nos temas disponíveis.
3. Faixas: pausa, retomada, teclado e preferência de movimento reduzido.
4. Landing: campos inválidos, abertura do rascunho e alternativas quando não há aplicativo de email.
5. Pomodoro: criar duas tarefas, selecionar a segunda, completar um ciclo e confirmar que apenas ela recebeu crédito. Recarregar e conferir tarefas, ciclos e tempo restante.
6. Arte generativa: pausar, mudar configurações, alternar de aba e entrar/sair do modo imersivo com Esc.
7. Dock: pausar vídeo e efeitos, alternar portal, energia e sinal.
8. Administração: visitante, usuário comum, administrador e backend indisponível. Não é necessário criar usuários reais para revisar as páginas públicas.

Login, entrega de mensagens e serviços externos precisam de validação própria com um ambiente de backend de teste. Esta revisão começou localmente; a preparação da publicação está registrada ao final.

## Rodada Forma e responsividade

### Correções no código

- O componente Container referenciava uma classe inexistente; agora utiliza a classe realmente declarada no CSS Module.
- Cards do laboratório: filhos da grade podem encolher, altura acompanha o conteúdo, cabeçalhos e etiquetas quebram linha. Prévia por hover fica desabilitada em toque.
- Portfólio: grade de estudos em duas colunas, uma no celular; menu passa à versão compacta em tablet. Experiências expandidas deixam de ter limite rígido de 800 px.
- Landing: respostas expandidas do FAQ não são limitadas a 300 px.
- Pomodoro: abas com identificação acessível e navegação por setas, Home e End; tarefas, playlist, estatísticas e botões acomodam conteúdo longo.
- Chat: modais usam a altura disponível; a área de mensagens rola sem empurrar o campo de escrita para fora do painel. A lista de conversas não exige largura mínima de 280 px.
- Autenticação: formulário de cadastro em uma coluna em telas pequenas e modal com altura limitada pelo viewport dinâmico.
- Arte generativa: painel inferior no celular e controles roláveis em telas baixas.
- Dock: controles com quebra de linha, espaço superior reservado e botões de ação com altura mínima.
- Guias entre estudos: largura considera as margens externas, evitando exceder o viewport.

### Cobertura e limites

Build, TypeScript, lint e respostas HTTP locais foram verificados. As referências de CSS Modules foram auditadas em 86 componentes. Isso verifica código e integração, não comprova a aparência nem o comportamento no navegador.

O navegador integrado não iniciou por uma falha do ambiente. A inspeção visual e interativa continua pendente, inclusive para confirmar que nenhum conteúdo está cortado.

Matriz para a próxima conferência:

| Tela | Rotas e estados |
| --- | --- |
| 320, 360 e 390 px | Todas as rotas, cards, menus abertos, formulários, textos longos e botões. |
| 768 e 1024 px | Mudança de colunas, navegação compacta e painéis de configuração. |
| 1440 e 1920 px | Largura máxima, alinhamentos, imagens e espaços entre seções. |
| 844 × 390 px | Modais, painéis e controles em orientação horizontal. |
| Zoom de 200% | Leitura, quebra de linha, foco e acesso às ações. |

Na Forma, testar os três filtros, os quatro diálogos, Esc, retorno de foco, menu móvel e as duas notas expansíveis. No Pomodoro, abrir as três abas e os modais de configuração. No chat, conferir lista, conversa e campo de mensagem com backend de teste. Repetir as rotas que oferecem temas nos modos claro e escuro.

### Código legado observado

ReplyModal e Confetti importam arquivos CSS ausentes, mas não são usados pelas rotas atuais. AdvancedProfilePhoto também tem uma referência de classe ausente e pertence ao hero antigo. Esses componentes foram preservados; uma limpeza separada pode removê-los após confirmar que não serão reutilizados.

## Microinterações

- Copiar email nos contatos do portfólio, landing e Forma: confirmação após a cópia realmente concluir. Se a permissão for negada ou o recurso não existir, um campo selecionável permite copiar manualmente.
- Botões e links recebem feedback de luminosidade durante o clique ou toque, sem deslocar o layout. O modo de alto contraste usa contorno do sistema.
- Rotas carregadas sob demanda têm um estado de carregamento acessível, sem progresso fictício ou espera artificial. Após oito segundos, aparece uma orientação para aguardar ou voltar ao laboratório.
- Tarefas excluídas podem ser restauradas em ordem inversa, com seus dados e progresso. Não há prazo para desfazer enquanto a página permanece aberta. Sair da página ou recarregar encerra esse histórico de recuperação; tarefas já restauradas continuam no armazenamento local.
- Desfazer restaura a seleção da tarefa apenas se ela era ativa e nenhuma outra estiver selecionada. Não inicia o cronômetro.

Testes automatizados da lógica de tarefas: `npm run test:tasks`. Seis cenários cobrem exclusão, restauração, múltiplas exclusões, identificador ausente, prevenção de duplicatas e recuperação em lista vazia.

Conferência manual pendente:

1. Copiar o email e colar em um editor; repetir com permissão de área de transferência bloqueada.
2. Navegar com rede lenta e cache desativado para ver o estado de carregamento; verificar que páginas já carregadas não recebem atraso artificial.
3. Excluir duas tarefas e desfazer duas vezes; conferir progresso, seleção ativa e persistência após recarregar.
4. Conferir clique/toque, navegação por teclado, leitor de tela e modo de alto contraste.

## Preparação da publicação — 21/09/2026

- Instalação reproduzível com `npm ci` e `npm --prefix backend ci`.
- `npm run build:full`, `npm run lint` e os seis testes de `npm run test:tasks` passaram.
- O preview do build respondeu nas rotas públicas, na rota administrativa e no fallback. Isso verifica a entrega dos arquivos, não autenticação nem renderização visual.
- Currículo e imagens locais foram incluídos no build. Os arquivos de configuração `.env.local` e `backend/config.env` permanecem fora do Git.
- O npm informou zero vulnerabilidades no frontend e oito moderadas no backend. Nenhuma atualização automática de dependências foi aplicada nesta publicação.
- Corrigidos o contêiner de rolagem que retinha a posição ao entrar no portfólio e a quebra da etiqueta “Produtividade” nos cards.
- A inspeção visual e os testes manuais descritos acima continuam pendentes por falha do navegador integrado.

A publicação segue `DEPLOYMENT.md`: envio para `main` e workflow existente do GitHub Pages. Para desfazer, use `git revert` no commit desta entrega e publique a reversão, preservando o histórico.
