# Guia de Deploy do Planka no Railway

Este guia passo a passo ajudará você a colocar seu Planka no ar usando o Railway.app e explica como fazer atualizações no código posteriormente.

## 1. Preparar o Repositório Git

Como você clonou o repositório oficial, você não tem permissão para enviar alterações (push) diretamente para ele. Você precisa do seu próprio repositório.

1.  Crie um **novo repositório** no seu GitHub (pode ser privado) chamado `meu-planka` (ou o nome que preferir).
2.  No terminal (dentro da pasta do projeto), mude a origem remota para o seu novo repositório:
    ```powershell
    # Remova a conexão com o repositório original
    git remote remove origin

    # Adicione o seu novo repositório (substitua USUARIO pelo seu usuário do GitHub)
    git remote add origin https://github.com/SVTestes/kanban-vision.git

    # Adicione os arquivos e faça o primeiro commit
    git add .
    git commit -m "Deploy inicial no Railway"

    # Envie para o GitHub
    git push -u origin master
    ```

## 2. Criar o Projeto no Railway

1.  Acesse [railway.app](https://railway.app/) e faça login (recomendo usar o login com GitHub).
2.  Clique em **+ New Project** > **Deploy from GitHub repo**.
3.  Selecione o repositório `meu-planka` que você acabou de criar.
4.  Clique em **Deploy Now**.
    *   *Nota: O deploy inicial vai falhar ou ficar incompleto porque faltam as variáveis de ambiente e o banco de dados, mas isso é normal.*

## 3. Adicionar o Banco de Dados (PostgreSQL)

1.  No painel do seu projeto no Railway, clique em **+ New** (ou botão direito na área vazia).
2.  Escolha **Database** > **PostgreSQL**.
3.  O Railway irá adicionar um container de banco de dados. Aguarde ele iniciar.

## 4. Configurar as Variáveis de Ambiente

1.  Clique no cartão do seu serviço **app/web** (o Planka, não o PostgreSQL).
2.  Vá na aba **Variables**.
3.  Adicione as seguintes variáveis:

    *   `DATABASE_URL`: **Importante!** Em vez de colar o valor, digite `${{PostgreSQL.DATABASE_URL}}`. O Railway vai autocompletar e linkar dinamicamente.
    *   `Port`: `1337` (Isso diz ao Railway qual porta o Planka usa).
    *   `SECRET_KEY`: Invente uma senha longa e segura (qualquer texto aleatório).
    *   `BASE_URL`: O Railway gera um domínio para você (ex: `https://meu-planka-production.up.railway.app`).
        *   Vá na aba **Settings** > **Networking** do serviço.
        *   Clique em **Generate Domain**.
        *   Copie esse domínio e cole no valor da variável `BASE_URL` (inclua `https://`).

    **Resumo das Variáveis Necessárias:**
    ```text
    DATABASE_URL = ${{PostgreSQL.DATABASE_URL}}
    PORT = 1337
    SECRET_KEY = (sua chave secreta)
    BASE_URL = https://seu-dominio-gerado.up.railway.app
    ```

4.  O Railway deve reiniciar o deploy automaticamente assim que você salvar as variáveis.

## 5. Primeiro Acesso

1.  Aguarde o deploy terminar (ficar verde).
2.  Acesse a URL gerada (o `BASE_URL`).
3.  Clique em **Sign Up** para criar sua conta de administrador.

---

## Como Atualizar o Código (Seu Fluxo de Trabalho)

Você perguntou: *"adicionar uma função nova por aqui e atualizar na railway é possivel?"*
**Sim!** O processo é este:

1.  **Edite Localmente**: Faça suas alterações no código no seu computador.
    *   Pode testar usando `docker compose up` se quiser ver rodando antes.

2.  **Salve e Envie**:
    No seu terminal:
    ```powershell
    git add .
    git commit -m "Adicionando nova função X"
    git push origin master
    ```

3.  **Deploy Automático**:
    *   O Railway "escuta" o seu GitHub. Assim que você der o `git push`, ele detecta a mudança.
    *   Ele baixa o código novo, constrói tudo de novo e substitui a versão antiga.
    *   O banco de dados **não** é apagado (os dados ficam seguros no serviço do PostgreSQL).

## Dicas Importantes

*   **Persistência de Dados**: Como usamos o serviço de banco do Railway, você pode fazer deploys à vontade que seus cartões e usuários não somem.
*   **Imagens (S3/Bucket)**:
    *   Por padrão, imagens salvas no disco local do container são perdidas a cada deploy (a menos que use um Volume).
    *   **Recomendado:** Crie um **Bucket** no Railway.
    *   Vá nas variáveis do Planka e configure:
        *   `S3_ENDPOINT`: Endpoint do bucket (ex: `s3.us-west-1.amazonaws.com` ou o host do MinIO privado).
        *   `S3_BUCKET`: Nome do bucket.
        *   `S3_REGION`: Região (us-east-1, etc).
        *   `S3_ACCESS_KEY_ID` e `S3_SECRET_ACCESS_KEY`: Suas credenciais.
        *   `S3_FORCE_PATH_STYLE`: `true`.
    *   *Dica: Ao usar o Bucket, você pode excluir o Volume de arquivos (`/app/data`) se não tiver arquivos antigos nele.*
