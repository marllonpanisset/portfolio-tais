# Instruções do projeto

## Projeto

`portfolio-tais` é um projeto cliente baseado em uma arquitetura reutilizável da Conjuga. O código e a configuração deste repositório descrevem o que está implementado; planos e requisitos futuros devem ser identificados como tais.

## Separação arquitetural

Manter responsabilidades claras entre:

- **CORE:** infraestrutura e comportamento técnico reutilizável;
- **CLIENTE:** identidade e configuração específicas do projeto;
- **CONTEÚDO:** textos, imagens, vídeos, biografia, categorias e trabalhos aprovados;
- **DADOS:** modelos e persistência;
- **CONFIGURAÇÃO:** valores que ajustam a aplicação sem embutir identidade em infraestrutura.

Reutilize código existente quando for tecnicamente apropriado. Não copie regras específicas de outro cliente nem crie abstrações genéricas sem necessidade demonstrada.

## Conteúdo

Não invente biografia, contatos, trabalhos, créditos, imagens, vídeos ou dados institucionais. Use somente informações aprovadas. Se faltar informação necessária, registre a lacuna e peça esclarecimento antes de publicar ou implementar conteúdo.

## Segurança

- Nunca versione secrets nem exponha service keys em código client-side, logs ou documentação pública.
- Valide e limite entradas não confiáveis no servidor.
- Respeite autenticação e RLS quando implementadas; não presuma que existam ou estejam configuradas apenas por haver código local.
- Valide uploads no servidor quando esse fluxo existir.
- Não confie em autorização feita apenas no frontend.

## Desenvolvimento

Antes de alterar código, leia a documentação relevante e inspecione dependências e usos afetados. Mantenha o escopo da tarefa, preserve comportamento existente e evite refatoração desnecessária. Não implemente fases futuras antecipadamente. Não altere o banco ou integrações sem autorização no escopo da tarefa.

## Validação

Confira `package.json` antes de executar scripts. Quando disponíveis e aplicáveis, use:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm test
```

Não afirme que um script ou teste existe sem verificá-lo.

## Git

Use Conventional Commits. Não reescreva histórico. Evite commits que misturem fases ou objetivos independentes. Não faça commit ou push sem solicitação.

## Documentação

A documentação deve refletir o estado real do projeto. Separe comportamento implementado de planos, requisitos e hipóteses. Atualize somente os documentos afetados pela tarefa e não trate documentação herdada de outro cliente como autoridade para este projeto.
