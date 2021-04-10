# InstaNode-bot

(apenas para estudo)

É uma automação de navegador, utilizando a biblioteca puppeteer, com o intuito de atrair mais seguidores para o seu perfil do instagram. Ela é ideal para quem quer conquistar seus primeiros 1000 seguidores para dar um ótimo "start" no seus objetivos com o Instagram.

---
## Dicas de uso:

- No arquivo `/bot-insta/config/profiles.json` (você verá ele com mais detalhes na próxima seção) adicione o usuário dos 7 perfis mais influentes que recebem seguidores diariamente.

- Adicione o usuário dos perfis por ordem de influência, do maior para o menor.

- Adicione o usuário dos perfis que tenham relação com o seu público alvo.

- Não é recomendado que você deixe ele executando por mais de 16 horas por dia, para evitar bloqueio de algumas ações do seu perfil do Instagram.

---
## Instalação

1- Antes de tudo, tenha o [Nodejs](https://nodejs.org) instalado na sua máquina.

2- Abra o terminal e dê o comando: `git clone https://github.com/UhCardoso/InstaNode-bot.git`

3- Digite o comando: `cd InstaNode-bot`

4- Digite o comando: `npm install` e aguarde a instalação das dependências.

5- Veja na próxima seção as intruções de configuração.

---
## Intruções de configuração

- No arquivo de caminho `/bot-insta/config/auth-info.json`, digite as suas credencias de login da sua conta no Instagram:

![alt text](https://thumbs2.imgbox.com/d6/d3/xNSPUk73_t.png)

- No arquivo de caminho `/bot-insta/config/profiles.json`, digite o username de cada um dos 7 perfis que serão alvos das raspagem de seguidores:

![alt text](https://thumbs2.imgbox.com/58/35/EN0t9piV_t.png)

- Com a raiz do projeto aberta no terminal, de o comando `npm start` para executar a automação.

*OBS: Caso ocorra um erro, tente instalar o navegador Chromium manualmente.*

---
## Features

### 1- Login

Primeiro o bot irá verificar se você está usando ele pela primeira vez. Se for a primeira vez, ele irá fazer o preenchimento dos dados na tela de login do Instagram, e salvará um arquivo de cookie na raíz do projeto: 

![alt text](https://s4.gifyu.com/images/logine0c5771d1a36a5bb.gif)

### 2- Parar de seguir perfis anteriores

Ao reiniciar o Browser, o bot irá se conectar automanticamente na sua conta do Instagram a partir dos dados que ficaram salvos no arquivo de cookie. E em seguida deixará de seguir 5 pessoas no seu perfil, para evitar o excesso de perfis sendo seguidos pelo seu Instagram.

![alt text](https://s4.gifyu.com/images/parar-seguir.gif)

### 3- Seguir novos perfis

-3 Ele irá para a primeira página que você configurou nos arquivos do `profiles.json` e seguirá 11 pessoas. Caso já tenha seguido as pessoas antes, ele irá para o segundo perfil alvo, fazendo isso sucessivamente até percorrer os 7 perfis alvos ou até seguir 11 perfis no loop atual.

![alt text](https://s4.gifyu.com/images/seguir.gif)

Seguindo as pessoas que têm interesse no assunto que você aborda, a tendência é que elas te sigam de volta. *Não é usado compra de seguidores* e nem a *ação de usar contas de terceiros para seguir seu perfil* sem o concentimento deles. 

- Cada loop acontecerá de 20 em 20 minutos, seguindo no maximo 11 perfis em cada.

---
***(A melhoria das funcinalidades atuais e novas features estão em desenvolvimento)***
