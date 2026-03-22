---
name: Auto GitHub Sync
description: Instruções de como verificar e garantir que o código modificado localmente seja enviado (push) para o GitHub.
---

# Contexto e Objetivo
Muitas vezes, as tarefas e edições feitas pela IA são salvas localmente, mas não enviadas automaticamente para o repositório remoto (ex: GitHub, e consequentemente Railway ou Vercel). Esta skill instrui a IA a sempre lembrar de criar commits e enviar (fazer push) do código.

# Instruções para a IA
1. **Verificação de Status Local:** Ao receber um pedido do usuário perguntando "por que minhas mudanças não estão no ar/no GitHub", a primeira ação deve ser verificar o `git status` para ver se existem alterações locais não "comitadas".
2. **Alertar e Informar:** Explique brevemente ao usuário que as alterações foram salvas localmente, mas precisam de `git add .`, `git commit` e `git push`.
3. **Agir Rápido:** Ofereça-se para rodar os seguintes comandos `run_command` ou já os rode diretamente caso o usuário libere:
   - `git add .`
   - `git commit -m "chore: atualizações recentes aplicadas"`
   - `git push`
4. **Fechamento de Grandes Tarefas:** Sempre que concluir uma grande modificação (feature de ponta a ponta), lembre o usuário de que você pode comitar e fazer push das mudanças pra ele.
