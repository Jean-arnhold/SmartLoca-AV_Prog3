# Sistema de Locadora de Veículos - Programação III

Este é um projeto full-stack de um sistema de gerenciamento para uma locadora de veículos, desenvolvido como avaliação (AV2) para a disciplina de Programação III do curso de Análise e Desenvolvimento de Sistemas do IFRS - Câmpus Feliz.

O sistema é composto por um backend em Node.js que serve uma API RESTful e um frontend em HTML, CSS e JavaScript para interação do usuário.

## Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias:

* **Backend**:
    * **Node.js**: Ambiente de execução JavaScript no servidor.
    *  **Express.js**: Framework para criação da API RESTful.
    * **Sequelize**: ORM (Object-Relational Mapper) para interagir com o banco de dados de forma orientada a objetos.
    *  **MySQL (MariaDB via XAMPP)**: Banco de dados relacional para armazenamento dos dados.
    * **Yup**: Biblioteca para validação de schemas e dados.

* **Frontend**:
    * HTML5
    *  **Tailwind CSS (via CDN)**: Framework CSS para estilização.
    *  **JavaScript (Vanilla)**: Manipulação do DOM e comunicação com o backend.

* **Ambiente**:
    * **XAMPP**: Pacote que provê o servidor Apache (para servir o frontend) e o banco de dados MySQL/MariaDB.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados em sua máquina:

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [NPM](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
* [XAMPP](https://www.apachefriends.org/index.html)
* Um cliente de Git, como o [GitHub Desktop](https://desktop.github.com/).

## Configuração do Ambiente

Siga estes passos para configurar o ambiente de desenvolvimento pela primeira vez.

### 1. Banco de Dados com XAMPP

1.  Abra o **Painel de Controle do XAMPP** e inicie os módulos **Apache** e **MySQL**.
2.  Clique no botão **"Admin"** ao lado do MySQL para abrir o `phpMyAdmin`.
3.  Crie um novo banco de dados com o nome exato: `locadora_ads`.
    > **Nota:** Não é necessário criar as tabelas. O backend fará isso automaticamente na primeira execução.

### 2. Backend (Servidor Node.js)

1.  Clone este repositório para uma pasta de sua preferência (ex: `C:\Users\SeuUsuario\Documents\GitHub\AplicacaoLocadora`).
2.  Abra um terminal (CMD, PowerShell, etc.) e navegue até a pasta do projeto que você acabou de clonar.
    ```bash
    cd C:\caminho\para\a\pasta\AplicacaoLocadora
    ```
3.  Dentro da pasta do projeto, crie o arquivo de configuração do banco de dados em `src/config/db.js` e garanta que ele tenha o seguinte conteúdo (com a senha em branco, padrão do XAMPP):
    ```javascript
    // src/config/db.js
    const { Sequelize } = require('sequelize');

    const sequelize = new Sequelize('locadora_ads', 'root', '', {
      host: 'localhost',
      dialect: 'mysql'
    });

    module.exports = sequelize;
    ```
4.  Instale todas as dependências do projeto com o seguinte comando:
    ```bash
    npm install
    ```

## Como Executar a Aplicação

Com o ambiente configurado, siga estes passos para rodar o sistema completo:

### 1. Iniciar o Backend

1.  No seu terminal, certifique-se de que você está na pasta raiz do projeto (a que contém o `package.json`).
2.  Execute o comando:
    ```bash
    npm start
    ```
3.  O terminal deve exibir uma mensagem de sucesso, indicando que o servidor está rodando na porta 3000 e conectado ao banco de dados.
    > **Deixe este terminal aberto!** Ele é o seu backend.

### 2. Servir o Frontend

1.  Copie a pasta inteira do projeto (`AplicacaoLocadora`) da sua pasta do GitHub.
2.  Cole essa pasta dentro do diretório `htdocs` da sua instalação do XAMPP (geralmente em `C:\xampp\htdocs`).
3.  Garanta que o **Apache** esteja rodando no painel do XAMPP.

### 3. Acessar a Aplicação

1.  Abra seu navegador de internet (Chrome, Firefox, etc.).
2.  Acesse o seguinte endereço:
    ```
    http://localhost/AplicacaoLocadora/pages/index.html
    ```
A aplicação full-stack estará totalmente funcional.

## Funcionalidades Implementadas

O sistema permite o gerenciamento completo (CRUD - Criar, Ler, Editar, Deletar) das seguintes entidades:

*  **Clientes**: Cadastro e listagem de clientes.
*  **Carros**: Cadastro e listagem de veículos da frota, com controle de status (Disponível, Alugado, Manutenção).
*  **Locações**: Registro de novas locações, associando um cliente a um carro disponível.

---
**Autor:** Jean Arnhold