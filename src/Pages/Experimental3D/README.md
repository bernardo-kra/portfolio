# Neon Bay

Ficção interativa em `/experimental3d`. A URL histórica foi preservada; não há motor 3D nem conexão com sistemas de espionagem reais.

## Diagnóstico da versão anterior

A inspeção do código encontrou fontes de trabalho contínuo:

- Vídeo de 2.040.978 bytes reproduzido em loop com filtros, mesmo sem interação.
- Camadas grandes com blur, blend, partículas e gradientes animados.
- Listener de mouse que consultava a geometria e alterava variáveis de diversos fundos a cada movimento.
- Painel flutuante, luzes pulsantes e faixa em movimento simultâneos.

São causas prováveis de custo de composição e pintura. Não houve medição de FPS, GPU ou perfil de CPU: o navegador integrado não iniciou por falha do ambiente.

## Experiência cinematográfica

Escolher setor → varrer → sintonizar → interceptar → ler o arquivo.

- Três mensagens fictícias formam uma pequena história.
- Qualidade calculada pela distância da frequência: `max(0, 100 - distância * 8)`. A interceptação exige varredura e qualidade de pelo menos 84%.
- Sintonia assistida opcional, navegação por teclado, foco encaminhado ao receptor e à mensagem e estado anunciado para leitores de tela.
- Mapa SVG local com radar rotativo, mira por setor, camadas de planta/sinais e rota de extração revelada ao completar a missão.
- Osciloscópio calculado a partir da frequência e da qualidade do sinal, instrumento de cobre e painel de fragmentos cifrados.
- Varredura e interceptação têm três etapas de 650 ms cada. São sequências narrativas simuladas, não processamento de uma rede real. Podem ser abortadas ou concluídas imediatamente. Trocar de alvo cancela a operação anterior.
- Apenas um timeout de etapa fica ativo durante uma operação. Ele é limpo ao sair, trocar de alvo, abortar ou ocultar a aba. A retomada reinicia a espera da etapa atual. Callbacks antigos são rejeitados pelo identificador e pela etapa.
- Radar e osciloscópio usam animações CSS de transform. Não há vídeo, biblioteca 3D, loop JavaScript por frame ou efeitos de blur. Movimento pode ser pausado; com movimento reduzido, as sequências concluem sem espera. O movimento para quando a aba fica oculta.
- Som sintetizado curto, desligado por padrão e ativado por ação explícita. O contexto de áudio é encerrado ao sair da rota.
- Modo imersivo recolhe introdução e rodapé; o botão de saída e Esc restauram a composição.
- Terminal local: `scan`, `tune 88`, `assist`, `intercept`, `target b02`, `cancel`, `reset` e `help`. Entradas não são executadas como JavaScript nem enviadas ao backend.
- Estado em memória: sair da rota, recarregar ou reiniciar limpa a missão. Alterar o idioma não reinicia o progresso.
- O vídeo antigo foi preservado em public, mas não é referenciado pela página. Portanto continua no pacote de publicação, sem ser solicitado por esta rota.

## Organização

- `consoleState.ts`: regras puras, setores e histórico limitado às quatro últimas ações.
- `copy.ts`: conteúdo PT/EN carregado junto da rota.
- `cinematicCopy.ts`: rótulos e sequências cinematográficas PT/EN.
- `commands.ts`: parser restrito da linha de comando.
- `useConsoleAudio.ts`: sons sintetizados sob demanda.
- `components/SectorMap.tsx`: mapa e pontos selecionáveis.
- `components/SignalScope.tsx`: forma de onda determinística em SVG.
- `index.tsx`: composição, receptor e acessibilidade.
- `styles.module.css`: tema escuro isolado e breakpoints.

Os quatro componentes da cena anterior e suas traduções sem uso foram removidos; podem ser recuperados pelo histórico do Git.

## Validação

`npm run build`, `npm run lint`, `npm run test:neon` e `npm run test:tasks`.

Os testes Neon Bay cobrem regras de sintonia, missão, histórico, sequências, cancelamento, callbacks desatualizados, comandos e renderização estática do mapa. A regressão de `cinema.paused` é coberta renderizando os três setores com radar ativo e pausado, sem propriedades de tradução vindas da página.

O teste de renderização usa React e Vite em memória; ele detecta falhas de composição, mas não substitui a inspeção visual no navegador. O navegador integrado continua sem iniciar neste ambiente.

Conferência visual e interativa pendente:

1. 320, 390, 768, 1024 e 1440 px; paisagem e zoom de 200%.
2. Completar a missão manualmente e com sintonia assistida.
3. Usar apenas teclado; conferir foco após varrer, sintonizar, selecionar e interceptar.
4. Reabrir arquivos, trocar idioma, reiniciar e sair/voltar à rota.
5. Preferência de movimento reduzido, efeito desligado e aba oculta.
6. No painel Network, confirmar ausência do MP4; no profiler, comparar pintura e CPU em repouso com a versão anterior.
7. Abortar varreduras, trocar de alvo durante uma operação, concluir sem animação e usar os comandos locais.
8. Ativar/desativar som, entrar/sair do modo imersivo e testar Esc.
