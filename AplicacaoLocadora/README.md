# Sistema de Locadora de Veículos - Programação III

Este é um projeto de um sistema de gerenciamento para uma locadora de veículos, desenvolvido para a disciplina de Programação III do curso de Análise e Desenvolvimento de Sistemas do IFRS - Câmpus Feliz.

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
    *  **HTML5
    *  **Tailwind CSS (via CDN)**: Framework CSS para estilização.
    *  **JavaScript (Vanilla)**: Manipulação do DOM e comunicação com o backend.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados em sua máquina:

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [NPM](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
* [XAMPP](https://www.apachefriends.org/index.html)


## Configuração do Ambiente

Siga estes passos para configurar o ambiente de desenvolvimento pela primeira vez.

### 1. Banco de Dados com XAMPP

1.  Abra o **Painel de Controle do XAMPP** e inicie os módulos **Apache** e **MySQL**.
2.  Clique no botão **"Admin"** ao lado do MySQL para abrir o `phpMyAdmin`.
3.  Crie um novo banco de dados com o nome exato: `locadora_ads`.
    > **Nota:** Não é necessário criar as tabelas. O backend fará isso automaticamente na primeira execução.

### 2. Backend (Servidor Node.js)

1.  Clone este repositório para uma pasta de sua preferência (ex: `C:\Users\SeuUsuario\Documents\GitHub\AplicacaoLocadora`).
2.  Abra um terminal e navegue até a pasta do projeto que você acabou de clonar.
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


### 2. Acessar a Aplicação

1.  Instale a extensão Live Server no VS CODE
2.  Acesse a aplicação via Live Server no arquivo index.html

A aplicação estará totalmente funcional.

## Funcionalidades Implementadas

O sistema permite o gerenciamento completo (CRUD - Criar, Ler, Editar, Deletar) das seguintes entidades:

*  **Clientes**: Cadastro e listagem de clientes.
*  **Carros**: Cadastro e listagem de veículos da frota, com controle de status (Disponível ou Alugado).
*  **Locações**: Registro de novas locações, associando um cliente a um carro disponível.

---
**Autor:** Jean Arnhold