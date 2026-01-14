

export interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    location: string;
    description: string[];
    technologies: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    period: string;
    location: string;
}

export interface SkillCategory {
    id: string;
    title: string;
    skills: string[];
}

export const resumeData = {
    header: {
        name: "Bernardo Kraczkowski",
        role: "Desenvolvedor Front-End & QA",
        location: "Sertão – RS",
        phone: "(54) 99620-6811",
        email: "bernardo_kra@hotmail.com",
        linkedin: "https://www.linkedin.com/in/bernardo-chimoka-853709170/",
        github: "https://github.com/bernardo-kra",
        portfolio: "https://bernardo-kra.github.io/portfolio/portfolio",
    },
    summary: "Profissional com experiência em desenvolvimento front-end, QA e suporte técnico. Atua em projetos de e-commerce de médio e grande porte, com foco em aplicações React integradas ao Oracle Commerce Cloud. Vivência em ambientes internacionais, trabalhando com regras de negócio, integrações via API, testes funcionais e suporte pós-implantação. Experiência anterior em QA, com atuação em validação de sistemas, análise de dados via SQL e suporte a processos operacionais e logísticos.",
    objective: "Atuar como desenvolvedor de software com foco em front-end e e-commerce, evoluindo gradualmente conhecimentos em back-end como parte de uma atuação Full Stack.",
    experience: [
        {
            id: "nsh",
            company: "NSH Technologies",
            role: "Desenvolvedor Front-End / QA",
            period: "2021 – Atual",
            location: "São Paulo (Remoto)",
            description: [
                "Desenvolvimento e manutenção de componentes front-end em React integrados ao Oracle Commerce Cloud (OCC)",
                "Implementação de fluxos de checkout com múltiplos métodos de pagamento (Mercado Pago, cartão, boleto)",
                "Gerenciamento de estado utilizando Context API e hooks customizados",
                "Integração com templates e Web Components nativos da Oracle",
                "Otimizações de performance utilizando lazy loading, Suspense e React.lazy",
                "Atuação em QA técnico em ambientes Oracle Preview e Staging",
                "Suporte técnico pós-go-live, atuando de forma independente no projeto junto ao cliente",
                "Desenvolvimento e manutenção de disparos de e-mail utilizando Freemarker",
                "Controle de branches, versionamento e deploys em ambientes dev, tst e prd",
                "Comunicação direta com clientes em português e espanhol"
            ],
            technologies: ["React", "JavaScript", "HTML5", "CSS3", "SASS", "REST APIs", "OCC", "Git", "Jira", "Figma"]
        },
        {
            id: "bertolini",
            company: "Transportes Bertolini",
            role: "Analista de QA (Qualidade de Software)",
            period: "2019 – 2021",
            location: "Bento Gonçalves",
            description: [
                "Execução de testes funcionais, exploratórios e regressivos",
                "Validação de regras fiscais, operacionais e tributárias",
                "Criação e execução de queries SQL para análise e validação de dados",
                "Validação de módulos de NF-e, logística fluvial e rodoviária, gestão portuária",
                "Utilização de Jenkins, SQL Server e documentação funcional"
            ],
            technologies: ["SQL Server", "Jenkins", "QA Manual", "Teste de Regressão"]
        },
        {
            id: "suporte_pl",
            company: "Suporte Técnico de TI / Plantonista",
            role: "Suporte Técnico",
            period: "2018 – 2019",
            location: "",
            description: [
                "Atendimento e suporte técnico a usuários de 28 filiais",
                "Suporte a sistemas financeiros, logísticos, fiscais, RH e módulos internos",
                "Apoio à operação e continuidade dos processos de negócio"
            ],
            technologies: ["Suporte", "Helpdesk"]
        },
        {
            id: "pref_sertao",
            company: "Prefeitura Municipal de Sertão",
            role: "Suporte Técnico de TI",
            period: "2017",
            location: "Sertão – RS",
            description: [
                "Instalação, manutenção e formatação de computadores",
                "Suporte técnico a servidores e estações de trabalho públicas"
            ],
            technologies: ["Hardware", "Redes", "Windows"]
        }
    ],
    education: [
        {
            id: "ifsul",
            institution: "Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul – Campus Bento Gonçalves",
            degree: "Análise e Desenvolvimento de Sistemas",
            period: "2019 – 2024",
            location: "Bento Gonçalves"
        }
    ],
    skills: [
        {
            id: "frontend",
            title: "Front-End",
            skills: ["React", "React Hooks", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "TailwindCSS", "SASS", "Storybook", "Web Components", "Responsive Design"]
        },
        {
            id: "backend_tools",
            title: "Back-End & Ferramentas",
            skills: ["Node.js", "Oracle Commerce Cloud (OCC)", "REST APIs", "AWS", "Jenkins", "CI/CD", "Git", "Bitbucket", "Jira", "Postman", "SQL", "Google Analytics"]
        },
        {
            id: "qa",
            title: "QA & Outros",
            skills: ["Testes manuais", "QA Funcional", "Debugging", "Performance Web", "Knockout.js"]
        }
    ]
};
