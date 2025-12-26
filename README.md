# 🛍️ Sistema de Gestão para Boutique

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

Um sistema completo de PDV (Ponto de Venda) e gestão de estoque desenvolvido para pequenas boutiques de roupa. O projeto visa substituir planilhas manuais por um controle digital eficiente, com relatórios financeiros em tempo real.

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
