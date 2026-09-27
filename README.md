# Conjuga

Site institucional da **Conjuga**, desenvolvido com foco em performance, acessibilidade, SEO e experiência do usuário.

## 🚀 Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

---

# 📁 Estrutura do Projeto

```text
.
├── app/              Rotas da aplicação (App Router)
├── components/       Componentes reutilizáveis
├── content/          Conteúdo estruturado do site
├── docs/             Documentação estratégica e técnica do projeto
├── lib/              Utilitários
├── public/           Arquivos estáticos
├── styles/           Estilos globais
├── AGENTS.md         Guia para agentes de IA
└── README.md
```

---

# 📚 Documentação

Antes de realizar mudanças significativas, consulte a documentação do projeto. O código é a referência do comportamento implementado; os documentos canônicos definem as regras de negócio e posicionamento aprovadas.

A leitura recomendada é:

```text
docs/
├── 01-BUSINESS.md      Modelo de negócio
├── 02-PRINCIPLES.md    Princípios da empresa
├── 03-BRAND.md         Identidade da marca
├── 04-WEBSITE.md       Arquitetura do site
├── 05-COPY.md          Comunicação institucional
├── 06-ROADMAP.md       Evolução estratégica
├── README.md           Índice documental
├── project-state.md    Estado verificado da implementação
├── architecture/       Arquitetura técnica
├── development/        Instruções de desenvolvimento
├── decisions/          Registros de decisões (ADRs)
├── changelog/          Histórico de mudanças
└── releases/           Notas relacionadas a tags de versão
```

O arquivo **AGENTS.md** serve como ponto de entrada para agentes de Inteligência Artificial e referencia toda a documentação oficial do projeto.

Toda decisão de negócio, produto, design ou comunicação deve estar alinhada com esses documentos.

---

# 💻 Desenvolvimento

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

# 📦 Build

Gerar a versão de produção:

```bash
npm run build
```

Executar em produção:

```bash
npm start
```

---

# 🧭 Princípios do Projeto

Este projeto adota uma abordagem **Documentation First** para decisões de negócio e operação. Código e configurações são a fonte para confirmar o que está implementado.

Antes de implementar funcionalidades:

- consulte a documentação correspondente;
- evite duplicar regras ou decisões;
- mantenha cada tipo de informação em sua fonte apropriada;
- atualize a documentação quando houver mudanças relevantes.

Consulte [`docs/README.md`](docs/README.md) para o índice documental e [`AGENTS.md`](AGENTS.md) para o fluxo permanente de trabalho.

---

# 📄 Licença

Projeto proprietário.

Todos os direitos reservados.
