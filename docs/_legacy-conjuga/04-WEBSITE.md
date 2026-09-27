# WEBSITE.md

> Documento canônico da arquitetura do site da Conjuga.
>
> Define a estrutura da aplicação, o propósito de cada página, o fluxo de navegação, componentes reutilizáveis e diretrizes técnicas relacionadas à experiência do usuário.
>
> Este documento não contém copy institucional. Todo conteúdo textual pertence ao COPY.md.

---

# Objetivo do Site

O site da Conjuga deve:

- comunicar claramente o posicionamento da empresa;
- explicar como resolvemos problemas operacionais;
- apresentar nossas soluções e serviços;
- demonstrar credibilidade;
- educar potenciais clientes;
- gerar contatos qualificados.

O site não existe apenas para apresentar a empresa.

Ele deve ajudar o visitante a reconhecer problemas da própria operação, entender como a Conjuga pode ajudar e iniciar uma conversa.

---

# Jornada do Usuário

Todo visitante deve conseguir responder rapidamente:

1. O que a Conjuga faz?
2. Para quem?
3. Que problemas ajuda a resolver?
4. Como trabalha?
5. Por que confiar?
6. Como entrar em contato?

Toda página deve contribuir para responder uma ou mais dessas perguntas.

A jornada deve conduzir o visitante de:

**reconhecimento do problema → entendimento da abordagem → conhecimento das soluções → confiança → contato.**

---

# Estrutura do Site

## Home

Objetivo:

Comunicar imediatamente que a Conjuga é uma empresa de engenharia de software que ajuda empresas de serviços a organizar, automatizar e evoluir suas operações através de sistemas, automações, integrações e inteligência artificial aplicada quando fizer sentido.

A Home deve responder rapidamente:

- o que fazemos;
- para quem fazemos;
- quais problemas ajudamos a resolver;
- como trabalhamos;
- por que confiar na Conjuga;
- qual é o próximo passo.

Seções principais:

- Hero
- Serviços
- Como Trabalhamos
- Diferenciais
- CTA Final

A organização e a quantidade de seções podem evoluir conforme a estratégia da empresa, desde que a Home continue cumprindo seus objetivos principais: comunicar o posicionamento da Conjuga, apresentar as soluções, explicar a metodologia de trabalho e conduzir o visitante para uma conversa.

A Home possui proteção especial definida no AGENTS.md. Alterações estratégicas, editoriais ou visuais exigem autorização explícita.

---

## Serviços

Objetivo:

Explicar claramente as soluções que a Conjuga oferece e relacioná-las aos problemas que ajudam a resolver.

Cada serviço deve possuir, quando aplicável:

- descrição;
- benefícios;
- problemas resolvidos;
- processo;
- exemplos de aplicação;
- CTA.

A apresentação dos serviços deve priorizar o problema e o valor para o negócio, evitando transformar a página em um catálogo puramente técnico.

A inteligência artificial pode aparecer como capacidade aplicada dentro das soluções quando fizer sentido, sem obrigatoriamente ser apresentada como o centro da oferta.

---

## Projetos

Objetivo:

Demonstrar experiência através de projetos publicados.

Cada projeto deve conter, quando houver informação disponível:

- contexto;
- problema;
- solução;
- tecnologias utilizadas;
- resultados, quando possível.

Não devem ser inventados projetos, clientes, resultados ou depoimentos.

Quando ainda não houver cases publicados, a ausência deve ser tratada de forma transparente, sem criar conteúdo fictício para preencher a página.

---

## Blog

Objetivo:

Educar potenciais clientes, compartilhar conhecimento e fortalecer a presença orgânica do site.

Os artigos devem estar organizados por categorias quando houver volume suficiente para isso.

O conteúdo deve estar relacionado aos temas e problemas que fazem parte do posicionamento da Conjuga.

O blog não deve existir apenas para gerar volume de publicações.

---

## Sobre

Objetivo:

Apresentar a empresa, seus princípios, sua forma de trabalho e a maneira como conduz projetos.

Não é uma página sobre os fundadores.

É uma página sobre a empresa.

A página deve reforçar a percepção de uma empresa organizada, técnica, confiável, pragmática e orientada à resolução de problemas.

---

## Contato

Objetivo:

Converter visitantes em oportunidades comerciais qualificadas.

Deve conter:

- formulário;
- meios de contato;
- FAQ, quando aplicável;
- CTA;
- informações que ajudem o potencial cliente a entender o próximo passo.

O contato deve facilitar a apresentação do problema do cliente, evitando exigir conhecimento técnico para iniciar a conversa.

---

# Navegação

A navegação principal deve ser simples e permitir que o visitante avance naturalmente pela jornada comercial.

Itens principais:

- Início
- Serviços
- Projetos
- Blog
- Sobre
- Contato

Evitar menus excessivamente longos.

A navegação pode evoluir conforme a arquitetura do site, desde que permaneça simples, clara e coerente com a jornada do usuário.

---

# Componentes Reutilizáveis

Preferir componentes reutilizáveis para:

- Hero;
- CTA;
- Cards;
- FAQ;
- Seções;
- Depoimentos, quando houver conteúdo real;
- Grid;
- Badges;
- Breadcrumbs.

Componentes devem ser reutilizados quando houver equivalência semântica e visual.

Não criar componentes ou padrões visuais novos apenas porque uma página possui conteúdo diferente.

---

# SEO

Toda página pública relevante deve possuir:

- título único;
- meta description;
- Open Graph quando aplicável;
- URL amigável;
- hierarquia adequada de headings;
- dados estruturados quando aplicável.

O conteúdo de SEO deve permanecer coerente com o posicionamento e não deve introduzir afirmações que não estejam sustentadas pela documentação do projeto.

---

# Performance

Priorizar:

- imagens otimizadas;
- lazy loading quando apropriado;
- fontes otimizadas;
- componentes leves;
- carregamento rápido.

Performance deve ser considerada durante a implementação, e não apenas como uma otimização posterior.

---

# Acessibilidade

Todo o site deve seguir boas práticas de acessibilidade.

Incluindo:

- contraste adequado;
- navegação por teclado;
- textos alternativos;
- estrutura semântica;
- foco visível;
- hierarquia adequada de conteúdo.

---

# Responsividade

Todo componente deve funcionar em:

- desktop;
- tablet;
- smartphone.

Responsividade não deve ser tratada como adaptação posterior.

A experiência e a hierarquia do conteúdo devem permanecer claras em diferentes tamanhos de tela.

---

# Componentização

Sempre priorizar:

- reutilização;
- consistência;
- modularidade;
- simplicidade;
- manutenção.

Evitar componentes específicos quando um componente existente resolver o problema de forma adequada.

Antes de criar um novo padrão visual, verificar os padrões já aprovados no projeto, especialmente os definidos pela Home.

---

# Coerência de Comunicação

A arquitetura do site deve permitir que a comunicação mantenha uma narrativa coerente entre as páginas.

A relação entre as principais páginas deve ser:

- **Home:** apresenta o problema, a proposta e direciona a jornada.
- **Serviços:** explica as soluções e os problemas que elas ajudam a resolver.
- **Projetos:** demonstra experiência através de trabalho real.
- **Blog:** educa e demonstra conhecimento.
- **Sobre:** explica a empresa e sua forma de trabalhar.
- **Contato:** transforma interesse em conversa comercial.

As páginas não devem repetir integralmente a mesma mensagem.

Cada página deve cumprir sua função específica dentro da jornada.

---

# Escopo

Este documento define apenas a arquitetura do site, sua jornada e diretrizes relacionadas à experiência e estrutura.

A comunicação textual pertence ao COPY.md.

A identidade visual pertence ao BRAND.md.

As decisões estratégicas pertencem ao BUSINESS.md.

Os princípios pertencem ao PRINCIPLES.md.

As regras operacionais para agentes pertencem ao AGENTS.md.
