# Neon Bay

Ficção interativa em `/experimental3d`. A URL histórica foi preservada; não há motor 3D nem conexão com sistemas de espionagem reais.

## Missão em três etapas

1. **Arquivo Asterion:** explorar quatro documentos em um servidor corporativo
   fictício. `RELAY_PROTOCOL.txt` contém a pista dos relés; selecionar
   `BLACK_TIDE.nb` e abrir o receptor inicia a etapa de sinais.
2. **Interceptação:** a planta e os instrumentos anteriores foram preservados.
   Recuperar os três setores libera o botão de controle de acesso; o usuário
   pode ler a última mensagem antes de continuar.
3. **Controle de acesso:** isolar a vigilância, ajustar os relés para A → C,
   B → A, C → B e abrir os portões em ordem com `088`, `104` e `116`.
   As chaves recuperadas ficam visíveis, sem exigir memorização. Erros indicam
   o requisito ausente e não retiram progresso. A matriz trava após o primeiro
   portão para preservar a alimentação da passagem.

Após os três portões, confirmar a extração exibe um relatório e a opção de
repetir. Reiniciar em qualquer etapa ou usar `reset` no terminal limpa todos os
estados, desmonta o receptor e inicia outra sessão no arquivo. Recarregar a
rota também recomeça; mudar de idioma preserva o progresso. A missão permanece
na mesma URL, com telas internas e transferência de foco entre etapas.

O gabinete usa CSS e a passagem usa SVG. Apenas os portões animam ao abrir,
respeitando movimento reduzido. Não há requisições para servidores fictícios,
execução de comandos externos ou armazenamento de credenciais.

Arquivos da missão: `missionState.ts` (regras e transições), `missionCopy.ts`
(PT/EN), `mission.module.css`, `components/GateCamera.tsx`, `index.tsx`
(orquestração) e `SignalConsole.tsx` (receptor anterior).

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
- `SignalConsole.tsx`: composição do receptor e acessibilidade.
- `styles.module.css`: tema escuro isolado e breakpoints.

Os quatro componentes da cena anterior e suas traduções sem uso foram removidos; podem ser recuperados pelo histórico do Git.

## Validação

`npm run build`, `npm run lint`, `npm run test:neon` e `npm run test:tasks`.

Os testes Neon Bay cobrem regras de sintonia, missão, histórico, sequências, cancelamento, callbacks desatualizados, comandos e renderização estática do mapa. A regressão de `cinema.paused` é coberta renderizando os três setores com radar ativo e pausado, sem propriedades de tradução vindas da página.

O teste de renderização usa React e Vite em memória; ele detecta falhas de composição, mas não substitui a inspeção visual no navegador. O navegador integrado continua sem iniciar neste ambiente.

### Validação da missão — 29/09/2026

Build, lint e 20 testes do Neon Bay passaram. Os novos testes cobrem requisitos
de avanço, códigos incorretos, ordem dos portões, bloqueio da matriz e dois
ciclos completos com reinício. A renderização inicial do arquivo também é coberta.

Foi possível executar Chrome headless com Playwright neste ambiente: missão
completa, feedback de erro, extração, reinício, troca para inglês e comando
`reset` verificados sem erros JavaScript. Layouts de arquivo e controle foram
checados entre 320 e 1440 px, sem transbordamento horizontal; capturas de desktop
e celular foram inspecionadas. Isso atualiza a limitação de navegador registrada
nas revisões anteriores. Leitor de tela e dispositivos físicos não foram testados.

A missão também foi concluída em inglês com animações habilitadas, cancelamento
e conclusão imediata de sequências. Relés e códigos foram operados pelo teclado;
o foco chegou à confirmação de extração. Trocar idioma manteve a matriz e o
isolamento, e reiniciar durante uma varredura cancelou a operação anterior.

Conferência visual e interativa pendente:

1. 320, 390, 768, 1024 e 1440 px; paisagem e zoom de 200%.
2. Completar a missão manualmente e com sintonia assistida.
3. Usar apenas teclado; conferir foco após varrer, sintonizar, selecionar e interceptar.
4. Reabrir arquivos, trocar idioma, reiniciar e sair/voltar à rota.
5. Preferência de movimento reduzido, efeito desligado e aba oculta.
6. No painel Network, confirmar ausência do MP4; no profiler, comparar pintura e CPU em repouso com a versão anterior.
7. Abortar varreduras, trocar de alvo durante uma operação, concluir sem animação e usar os comandos locais.
8. Ativar/desativar som, entrar/sair do modo imersivo e testar Esc.
