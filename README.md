# ⚔️ Ordem dos Turnos RPG (D&D 5e)

Um rastreador tático de iniciativa, turnos e combate feito para mestres de Dungeons & Dragons e RPGs de mesa. Leve, rápido e projetado para rodar lado a lado com o Roll20 ou em mesas presenciais.

![Status](https://img.shields.io/badge/status-pronto_para_jogar-success)
![Stack](https://img.shields.io/badge/stack-React_19_+_Vite-61dafb)
![Deploy](https://img.shields.io/badge/deploy-Render_Static_Site-blue)

---

## 🎯 Por que esse projeto existe?

No calor do combate em plataformas virtuais como Roll20, controlar turnos, dano, condições e iniciativa pode ser lento e truncado. Este projeto nasceu para resolver isso com:
1. **Zero fricção de backend ou banco:** 100% dos dados rodam no navegador via `localStorage`.
2. **Duplicação rápida de monstros:** Adicione facilmente "Goblins" em lote (ex: 4 cópias já numeradas e com iniciativa rolada).
3. **Grupo da Campanha Persistente:** Cadastre os personagens dos seus jogadores uma única vez e puxe-os para o combate com 1 clique.
4. **Atalhos no Teclado:** Avance turnos com a barra de espaço sem precisar caçar o botão com o mouse.
5. **Acompanhamento de Vida & Condições:** Botões rápidos de dano/cura (-5, -1, +1, +5) e todas as condições do D&D 5e (Cego, Envenenado, Caído, Concentrando, etc.).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)

### Passo a passo
```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```
O app abrirá instantaneamente em `http://localhost:5173/`.

---

## 🌐 Deploy Gratuito no Render (Static Site)

Como a aplicação é uma Single Page Application (SPA) estática sem servidor backend, ela pode ser hospedada gratuitamente no **Render** sem nenhum *cold start* (nunca dorme):

1. Conecte seu repositório no [Render.com](https://render.com/).
2. Crie um novo **Static Site**.
3. Preencha as configurações:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Clique em **Create Static Site**.

Pronto! Seu link estará disponível em segundos.

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
| :--- | :--- |
| `Espaço` ou `→` | Avança para o próximo turno do combate |
| `←` | Volta para o turno anterior |
| `N` | Abre o modal para adicionar combatente ou lote de monstros |
| `Esc` | Fecha qualquer modal aberto |

---

## 💾 Backup e Migração (Exportar / Importar)

Na barra superior do app, você encontra os botões de:
- **Download:** Baixa um arquivo `.json` com o seu grupo de campanha e encontro atual.
- **Upload:** Restaura o backup instantaneamente em outro computador, notebook ou celular.
