import type { Metadata } from "next";

import { PageWrapper } from "@/components/layout";
import { Container, Section, Heading, Text } from "@/components/ui";
import { Hero } from "@/components/sections";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade",
  description:
    "Entenda como a Conjuga coleta, utiliza, armazena e protege os dados pessoais fornecidos por visitantes e clientes em seu site.",
  path: "/politica-de-privacidade",
});

const sections = [
  {
    title: "1. Objetivo desta política",
    content: (
      <>
        <Text className="mt-3">
          Esta Política de Privacidade explica como a Conjuga coleta, utiliza,
          armazena e protege os dados pessoais fornecidos pelos visitantes
          durante a utilização deste site.
        </Text>

        <Text className="mt-3">
          Nosso compromisso é tratar essas informações com transparência,
          segurança e em conformidade com a legislação brasileira aplicável,
          incluindo a Lei Geral de Proteção de Dados Pessoais (LGPD).
        </Text>
      </>
    ),
  },
  {
    title: "2. Dados coletados",
    content: (
      <>
        <Text className="mt-3">
          Por meio do formulário de contato, recebemos as informações fornecidas
          voluntariamente pelo usuário, incluindo:
        </Text>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-secondary">
          <li>Nome;</li>
          <li>Empresa;</li>
          <li>E-mail;</li>
          <li>Telefone (quando informado);</li>
          <li>Serviço de interesse;</li>
          <li>Mensagem enviada.</li>
        </ul>

        <Text className="mt-4">
          Além desses dados, a aplicação pode processar o endereço IP recebido
          na solicitação para proteger o formulário, limitar solicitações e
          identificar envios duplicados. Esses controles utilizam estruturas
          temporárias em memória na aplicação.
        </Text>
      </>
    ),
  },
  {
    title: "3. Como utilizamos os dados",
    content: (
      <>
        <Text className="mt-3">
          As informações coletadas são utilizadas exclusivamente para:
        </Text>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-secondary">
          <li>Responder solicitações enviadas pelo formulário;</li>
          <li>Entender o contexto da empresa e suas necessidades;</li>
          <li>Elaborar propostas comerciais quando solicitado;</li>
          <li>Manter comunicação relacionada ao atendimento.</li>
          <li>
            Proteger o formulário, limitar solicitações e identificar envios
            duplicados.
          </li>
        </ul>

        <Text className="mt-4">
          Não utilizamos essas informações para envio de publicidade não
          solicitada nem comercializamos dados pessoais.
        </Text>
      </>
    ),
  },
  {
    title: "4. Compartilhamento de informações",
    content: (
      <>
        <Text className="mt-3">
          A Conjuga não compartilha dados pessoais com terceiros para fins de
          marketing.
        </Text>

        <Text className="mt-3">
          Quando necessário para o funcionamento do site, do formulário de
          contato ou da análise estatística de acesso mediante consentimento do
          visitante, os dados poderão ser processados por fornecedores
          responsáveis pela infraestrutura tecnológica utilizada, sempre
          observando padrões adequados de segurança e confidencialidade.
        </Text>
      </>
    ),
  },
  {
    title: "5. Armazenamento e segurança",
    content: (
      <>
        <Text className="mt-3">
          Adotamos medidas técnicas e organizacionais adequadas para proteger as
          informações contra acesso não autorizado, alteração, perda ou
          divulgação indevida.
        </Text>

        <Text className="mt-3">
          Apesar disso, nenhum sistema conectado à internet é completamente
          imune a riscos, motivo pelo qual não é possível garantir segurança
          absoluta.
        </Text>
      </>
    ),
  },
  {
    title: "6. Direitos do titular dos dados",
    content: (
      <>
        <Text className="mt-3">
          Nos termos da LGPD, o titular dos dados poderá solicitar, quando
          aplicável:
        </Text>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-secondary">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos dados pessoais;</li>
          <li>Correção ou atualização das informações;</li>
          <li>Exclusão dos dados, quando cabível;</li>
          <li>Esclarecimentos sobre o tratamento realizado.</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Cookies e tecnologias semelhantes",
    content: (
      <>
        <Text className="mt-3">
          A Conjuga utiliza cookies e tecnologias semelhantes para garantir o
          funcionamento do site e, mediante o consentimento do visitante,
          coletar informações estatísticas sobre sua utilização.
        </Text>

        <Text className="mt-3">
          Quando você aceita os cookies de análise, utilizamos o Google
          Analytics para compreender, de forma agregada, como os visitantes
          navegam pelo site, quais páginas são mais acessadas e como podemos
          melhorar a experiência de navegação.
        </Text>

        <Text className="mt-3">
          Essas informações não são utilizadas para identificar pessoalmente os
          visitantes nem para envio de publicidade personalizada pela Conjuga.
        </Text>

        <Text className="mt-3">
          Caso você recuse os cookies de análise, o Google Analytics não será
          carregado e nenhuma informação estatística será coletada durante sua
          navegação.
        </Text>
      </>
    ),
  },
  {
    title: "8. Alterações nesta política",
    content: (
      <>
        <Text className="mt-3">
          Esta Política de Privacidade poderá ser atualizada periodicamente para
          refletir mudanças legais, técnicas ou operacionais.
        </Text>

        <Text className="mt-3">
          A data da última atualização estará sempre disponível nesta página.
        </Text>
      </>
    ),
  },
  {
    title: "9. Contato",
    content: (
      <Text className="mt-3">
        Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
        tratamento de dados pessoais, entre em contato pelo e-mail{" "}
        <a
          href={`mailto:${siteConfig.links.email}`}
          className="link-underline text-signal-strong"
        >
          {siteConfig.links.email}
        </a>
        .
      </Text>
    ),
  },
];

export default function PoliticaPrivacidadePage() {
  return (
    <PageWrapper withGrid={true}>
      <Hero
        eyebrow="Informações legais"
        title="Política de Privacidade"
        description="Entenda como a Conjuga coleta, utiliza, armazena e protege os dados pessoais fornecidos por visitantes e clientes durante a utilização deste site."
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <Text variant="caption">
              Última atualização: 6 de agosto de 2026.
            </Text>

            <div className="mt-12 space-y-12">
              {sections.map((section) => (
                <section key={section.title}>
                  <Heading
                    as="h2"
                    className="text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.2] tracking-[-0.01em]"
                  >
                    {section.title}
                  </Heading>

                  {section.content}
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
