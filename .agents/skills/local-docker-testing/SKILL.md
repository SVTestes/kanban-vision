---
name: Local Docker Testing Policy
description: Diretrizes obrigatórias para testar código localmente no Docker antes de enviar para o GitHub.
---

# Contexto e Objetivo
Para evitar que código não testado ou com problemas seja enviado acidentalmente para produção (Railway/GitHub), esta skill define a regra de que o padrão de desenvolvimento deve sempre ser focado em testar localmente primeiro.

# Instruções Restritas para a IA (Obrigatórias)

1. **PROIBIDO FAZER PUSH AUTOMÁTICO:**
   - O comando `git push` **SÓ PODE SER EXECUTADO** se o usuário usar palavras explícitas pedindo para enviar. O comportamento padrão na conclusão de uma tarefa deve ser apenas salvar/comitar.

2. **REINÍCIO AUTOMÁTICO DO DOCKER (OBRIGATÓRIO):**
   - **Sempre que você terminar de alterar ou atualizar o código**, você DEVE executar autonomamente o comando de restart do Docker (`docker compose -f docker-compose-dev.yml restart` ou equivalente) na sua própria sessão de terminal (usando a tool de run_command com SafeToAutoRun=true), **SEM PRECISAR PERGUNTAR AO USUÁRIO**.

3. **Validação do Usuário e Lembrete Ativo:**
   - Após executar o comando de reiniciar o Docker, notifique o usuário: *"A alteração foi feita e o docker foi reiniciado. Por favor teste localmente. Quando estiver tudo certo, me avise para eu subir pro GitHub"*.
   - Apenas realize o deploy (Push) quando o usuário confirmar o sucesso do teste.
