# Conventional Commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/) para padronizar as mensagens de commit.

## Formato

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Tipos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, ponto e vírgula, etc; sem mudança de código
- **refactor**: Refatoração de código
- **perf**: Melhoria de performance
- **test**: Adicionando ou corrigindo testes
- **chore**: Atualização de tarefas que não afetam o código de produção

## Exemplos

```
feat: add user authentication system
fix: resolve navigation issue on mobile devices
docs: update README with installation instructions
style: format code according to prettier rules
refactor: simplify component structure
perf: optimize image loading
test: add unit tests for user service
chore: update dependencies
```

## Escopo (Opcional)

```
feat(auth): add login functionality
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

## Corpo (Opcional)

```
feat: add user authentication system

- Implement JWT token authentication
- Add login/logout functionality
- Create protected routes
- Add user profile management

Closes #123
```

## Rodapé (Opcional)

```
feat: add user authentication system

Closes #123
BREAKING CHANGE: API endpoints now require authentication
``` 