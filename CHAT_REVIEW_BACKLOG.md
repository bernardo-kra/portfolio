# Revisão rigorosa — 5 de outubro de 2026

Pendências registradas para uma etapa posterior. A atualização em tempo real
é uma tarefa separada e não resolve automaticamente os pontos abaixo.

- [x] **Alta — limite do Google:** separar `/challenge` das tentativas de login.
      Abrir o modal cinco vezes consome o limite de autenticação, sem tentar entrar.
- [x] **Alta — duplicação:** adicionar um identificador de envio e deduplicação
      no backend. Se a mensagem for salva e a resposta se perder, tentar novamente
      pode criar outra mensagem.
- [x] **Média — rascunho após envio:** limpar o rascunho também se o componente
      for fechado ou a conversa mudar enquanto a requisição está em andamento.
- [x] **Média — leitura prematura:** marcar apenas mensagens realmente vistas.
      A consulta não confirma leitura; o histórico confirma somente os IDs
      visíveis com a aba em foco. Visitantes podem confirmar apenas respostas
      do proprietário na própria conversa.
- [ ] **Média — crescimento:** criar resumos por conversa e paginação por cursor.
      A lista atual baixa todo o histórico, com risco de exceder limites e repetir
      registros se novas mensagens chegarem durante a paginação por posição.
- [ ] **Média — menu:** implementar ou remover “Meu Perfil” e “Configurações”,
      que atualmente apenas fecham o menu.
- [ ] **Baixa — tradução:** usar a locale inglesa nas datas antigas da lista.

Reprodução: Chrome com dados simulados confirmou rascunho mantido após envio,
leitura antecipada e reenvio sem identificador. Rotas reais com Firebase
simulado confirmaram `429` na sexta preparação do Google. Os 49 testes então
existentes, lint e build passaram, mas não cobriam esses comportamentos.

## Etapa 1 — correções locais após a publicação

A versão `d653b77` foi publicada. As correções marcadas acima pertencem à etapa
seguinte: limite separado para preparar Google, identificador UUID
por envio com deduplicação por usuário em transação Firestore, e rascunho
compartilhado que é limpo mesmo após fechar a conversa. Uma tentativa repetida
com o mesmo ID e conteúdo retorna a mensagem original; conteúdo alterado com
esse ID recebe 409. Clientes antigos sem ID continuam compatíveis, mas não
têm deduplicação. Os demais itens seguem pendentes.
