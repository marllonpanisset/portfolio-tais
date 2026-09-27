# Changelog

Alterações relevantes registradas em ordem cronológica inversa. Este histórico começa com a adoção do registro documental; não representa um histórico completo anterior.

## [Unreleased]

### Public portfolio

- Simplificado o menu para Home, Biografia, Portfólio e Contato, com links tipográficos equivalentes em desktop e mobile.
- Criadas doze entradas temporárias de demonstração, galeria responsiva na Home com modal acessível, listagem editorial em `/portfolio` e detalhes com suporte a imagem e vídeo.
- Alinhados os estilos públicos em preto e branco e atualizados sitemap, redirect de `/projetos` e documentação. Imagens e dados de demonstração precisam ser substituídos antes da publicação.

### Public site

- Adaptada a Home e criada a navegação pública de biografia, contato e detalhe de trabalho, com placeholders identificados e sem conteúdo profissional inventado.
- Atualizados tema base, identidade textual, metadata, dados estruturados, sitemap e links principais; adicionados redirects para rotas comerciais herdadas.
- Analytics/consentimento deixaram de ser montados no layout público enquanto sua adoção não for decidida. Código legado, endpoint de leads e páginas legais permanecem para revisão posterior.

### Foundation

- Adicionado o modelo TypeScript inicial de portfólio sem persistência ou operações de CMS.
- Removidos componentes sem consumidores diretos e suas exportações dos barrels.
- Renomeada a configuração para identificar responsabilidade do cliente e alinhado o nome do pacote com `portfolio-tais`.
- Documentadas as fronteiras atuais entre candidatos ao CORE e configuração/conteúdo cliente ainda herdados.

### Documentation

- Substituídas as instruções de agente e o README herdados por documentação do portfolio-tais e do CORE reutilizável.
- Adicionados os contratos iniciais de arquitetura e CMS; arquivados documentos estratégicos específicos da Conjuga.
- Adaptados os documentos técnicos ao estado verificado e centralizados os materiais de migração em `docs/prompts/`.

- Adicionado índice técnico, estado verificado do projeto, visão de arquitetura, guia de desenvolvimento e convenções para ADRs e releases.
- Atualizadas as instruções permanentes para distinguir comportamento comprovado pelo código de regras de negócio aprovadas em documentação.

Não houve alteração de funcionalidades da aplicação nesta atualização documental.
