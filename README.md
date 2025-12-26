# 🛍️ Sistema de Gestão para Boutique

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## 💡 Sobre o Projeto

O **Boutique Admin** nasceu da necessidade de substituir planilhas manuais e cadernos de anotação por uma solução digital eficiente e acessível para pequenas lojas de roupa.

O objetivo principal foi criar uma interface **intuitiva**, onde vendedores possam registrar vendas em segundos (PDV) e gerentes tenham visão total do negócio através de dashboards automatizados.

Diferente de sistemas genéricos, este projeto foca na agilidade do varejo de moda, controlando estoque, calculando comissões e gerando relatórios de desempenho sem complexidade.

### 🎯 O que o sistema resolve?
- **Fim dos erros de cálculo:** O carrinho soma e dá baixa no estoque automaticamente.
- **Controle de Caixa:** Relatórios mostram exatamente quanto entrou por Pix, Dinheiro ou Cartão.
- **Segurança:** Vendedores vendem, mas apenas Administradores podem excluir produtos ou alterar estoques.

---

## 🚀 Funcionalidades

- **🛒 Frente de Caixa (PDV):**
  - Busca rápida de produtos.
  - Carrinho de compras dinâmico.
  - Cálculo automático de troco e totais.
  - Baixa automática no estoque após a venda.

- **📦 Gestão de Estoque:**
  - Cadastro de produtos com custo, preço de venda e quantidade.
  - Alertas visuais de estoque baixo.
  - Proteção de rotas (apenas Admins podem excluir/editar).

- **📊 Dashboard & Relatórios:**
  - Gráficos de faturamento diário, semanal e mensal.
  - Ranking de melhores vendedores.
  - Indicadores de Ticket Médio e Quantidade de Peças.

- **🔐 Autenticação:**
  - Sistema de Login seguro.
  - Controle de acesso baseado em cargos (Vendedor vs Admin).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as melhores práticas do ecossistema React:

- **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Estilização:** CSS Moderno (Responsivo) + Lucide Icons
- **Deploy:** Netlify



## ⚙️ Como rodar localmente

1. Clone o projeto:
```bash
git clone [https://github.com/AkaGabws/Sistema-boutique.git](https://github.com/AkaGabws/Sistema-boutique.git)
```

2. Entre na pasta
```bash
cd Sistema-boutique
```

3. Instale as dependências:
```bash
npm install
```

4. Configurar as variáveis de ambiente: crie um arquivo ```.env``` e adicione suas chaves do Supabase

5. Rode o servidor
```bash
npm run dev
```
---

Desenvolvido Por Gabriel Marques
