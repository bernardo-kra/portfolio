import { Link } from 'react-router-dom'
import { useI18n } from '@src/i18n'
import { profile } from '@src/config/profile'
import styles from './styles.module.css'

export default function Privacy() {
  const { lang, setLang } = useI18n()
  const pt = lang === 'pt'
  const sections = pt
    ? [
        [
          'Quem trata seus dados',
          'Bernardo Kraczkowski é responsável pelo tratamento neste portfólio. O contato para privacidade é o email abaixo. Última atualização: 29/09/2026.',
        ],
        [
          'Conta e comunicação',
          'Para criar e manter sua conta, usamos nome, email, senha protegida por hash (para contas existentes por senha) e telefone, se você o informar. No login Google, recebemos o identificador da conta, nome e email verificado; não recebemos sua senha Google nem acesso ao Gmail ou Drive. Mensagens enviadas pelo chat são armazenadas para permitir a conversa. O tratamento necessário à conta e às funcionalidades solicitadas é separado do consentimento opcional para análise.',
        ],
        [
          'Armazenamento necessário',
          'O navegador armazena preferências de tema e sua escolha de privacidade. Tarefas e ajustes do Pomodoro ficam no próprio dispositivo. A sessão é mantida apenas em memória, termina ao recarregar a página e expira no servidor em uma hora. Você pode sair e limpar os dados locais pelas configurações do navegador.',
        ],
        [
          'Análise opcional',
          'Somente após sua permissão carregamos o Google Analytics, para medir páginas visitadas e interações. Não enviamos nome, email, mensagens ou parâmetros da URL para a análise. Recusar não bloqueia o conteúdo nem o login. Use “Privacidade e cookies” para alterar sua escolha; a preferência local é solicitada novamente após 180 dias ou mudança de versão. A revogação interrompe novas coletas e remove os cookies de análise acessíveis neste domínio.',
        ],
        [
          'Provedores e segurança',
          'A hospedagem utiliza GitHub Pages e Render; dados da conta e mensagens utilizam Google Firebase/Firestore. O login Google é opcional. Fontes externas do Google podem receber dados técnicos ao carregar a interface. Esses provedores podem processar dados fora do Brasil. Requisições podem gerar registros técnicos de IP, navegador e eventos de segurança para proteção do serviço; não vendemos dados pessoais.',
        ],
        [
          'Conservação e seus direitos',
          'Dados da conta e conversas são mantidos enquanto necessários à prestação das funcionalidades e ao atendimento de solicitações, respeitadas eventuais obrigações legais. Não há descarte automático geral de contas ou mensagens nesta versão. Você pode solicitar confirmação do tratamento, acesso, correção, informação sobre compartilhamento, portabilidade quando aplicável, anonimização, bloqueio ou exclusão e revogar consentimento. Envie a solicitação pelo contato abaixo; poderemos verificar sua identidade antes de atender.',
        ],
      ]
    : [
        [
          'Who handles your data',
          'Bernardo Kraczkowski is responsible for data processing on this portfolio. Use the email below for privacy requests. Last updated: September 29, 2026.',
        ],
        [
          'Account and communication',
          'To create and maintain your account, we use your name, email, hashed password (for existing password accounts) and phone number if provided. Google sign-in supplies your account identifier, name and verified email; we do not receive your Google password or access to Gmail or Drive. Chat messages are stored to support conversations. Processing needed for your account and requested features is separate from optional analytics consent.',
        ],
        [
          'Necessary storage',
          'Your browser stores your theme preference and privacy choice. Pomodoro tasks and settings stay on your device. Sessions are kept only in memory, end on page reload and expire on the server after one hour. You can sign out and clear local data through browser settings.',
        ],
        [
          'Optional analytics',
          'Google Analytics loads only after your permission to measure visited pages and interactions. We do not send names, emails, messages or URL parameters to analytics. Refusing does not block content or sign-in. Use “Privacy & cookies” to change your choice; you will be asked again after 180 days or a policy version change. Revoking consent stops new collection and removes accessible analytics cookies on this domain.',
        ],
        [
          'Providers and security',
          'Hosting uses GitHub Pages and Render; account and message storage uses Google Firebase/Firestore. Google sign-in is optional. External Google fonts may receive technical data while the interface loads. These providers may process data outside Brazil. Requests may generate technical records of IP addresses, browsers and security events to protect the service; personal data is not sold.',
        ],
        [
          'Retention and your rights',
          'Account and conversation data is retained as needed to provide features and handle requests, subject to applicable legal obligations. This version has no general automatic account or message deletion. You may request confirmation of processing, access, correction, sharing information, portability where applicable, anonymization, blocking or deletion, and withdraw consent. Send a request using the contact below; identity verification may be needed before fulfilling it.',
        ],
      ]
  return (
    <main className={styles.page}>
      <nav>
        <Link to="/portfolio">← {pt ? 'Portfólio' : 'Portfolio'}</Link>
        <button onClick={() => setLang(pt ? 'en' : 'pt')}>
          {pt ? 'English' : 'Português'}
        </button>
      </nav>
      <h1>{pt ? 'Privacidade e seus dados' : 'Privacy and your data'}</h1>
      <p>
        {pt
          ? 'Você pode explorar os estudos sem criar uma conta e sem aceitar análise.'
          : 'You can explore the studies without an account or analytics consent.'}
      </p>
      {sections.map(([title, text]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      <section>
        <h2>{pt ? 'Exercer seus direitos' : 'Exercise your rights'}</h2>
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent(pt ? 'Solicitação de privacidade — portfólio' : 'Portfolio privacy request')}`}
        >
          {profile.email}
        </a>
        <p>
          {pt
            ? 'Descreva sua solicitação. Não envie senhas ou documentos sensíveis no primeiro contato.'
            : 'Describe your request. Do not send passwords or sensitive documents in your first message.'}
        </p>
        <a
          href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares"
          target="_blank"
          rel="noreferrer"
        >
          {pt
            ? 'Conheça seus direitos na ANPD'
            : 'Learn about your rights at ANPD'}{' '}
          ↗
        </a>
      </section>
    </main>
  )
}
