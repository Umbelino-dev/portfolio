import type { CaseStudy, Project } from "./types";

/**
 * Ordered for the index: shipped work first, then work in progress.
 * Sources: CV (rev. 6), portfolio audit (26 Oct 2026), Iury (chat, 2026-11-16):
 * Koinonia finished, published and in daily use; Via Hebraica one of his first
 * projects, made while learning, still needs work; the parenting idea renamed and
 * at problem validation (no validated solution); the trends tool used now and
 * then at SOU Studio; Zeff and UMB removed. Every project has a page.
 */
export const projects: Project[] = [
  {
    slug: "koinonia",
    index: "P.01",
    name: "Koinonia",
    nameLang: "pt",
    status: "live",
    stage: 4,
    stageNote: { pt: "Concluído, no ar e em uso diário.", en: "Finished, live and in daily use." },
    year: 2026,
    tags: ["web", "pwa", "ai"],
    summary: {
      pt: "Plataforma web (PWA) de gestão de comunidades. Concluída, publicada e em uso diário.",
      en: "A community-management web platform (PWA). Finished, published and in daily use.",
    },
    role: {
      pt: "Product builder: problema, fluxo, diretrizes para a IA, orquestração e testes",
      en: "Product builder: problem, flow, AI directives, orchestration and testing",
    },
    stack: ["TanStack Start", "React 19", "Supabase", "Tailwind CSS v4", "Vitest"],
    cover: {
      src: "/media/koinonia-cover.webp",
      width: 1200,
      height: 630,
      fit: "contain",
      background: "#fdf8f0",
      alt: {
        pt: "Logo do Koinonia: gestão de pessoas, presença e cuidado para igrejas e comunidades.",
        en: "Koinonia logo: people, attendance and care management for churches and communities.",
      },
    },
    links: [{ label: { pt: "Ver o Koinonia", en: "Visit Koinonia" }, href: "https://usekoinonia.com.br" }],
    source: "CV §Projetos; Iury (chat, 2026-11-09); repo Umbelino-dev/koinonia.app (README, docs/PRODUTO.md, docs/AUDITORIA.md, docs/historico, git log)",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "repo Umbelino-dev/koinonia.app @7aba644 + Iury's role statement + Iury's lesson and brand images (2026-11-09)",
      lead: {
        pt: "Uma plataforma web (PWA) para a liderança de comunidades e igrejas acompanhar pessoas, presença e cuidado. Construída com IA, dirigida por mim. Publicada e em uso.",
        en: "A web platform (PWA) for community and church leaders to follow people, attendance and care. Built with AI, directed by me. Published and in use.",
      },
      builtWith: ["Lovable", "Claude"],
      cover: {
        id: "cover",
        aspect: "1200/630",
        label: { pt: "Capa · marca", en: "Cover · brand" },
        caption: {
          pt: "Fig. 01. A marca do Koinonia: gestão de pessoas, presença e cuidado para igrejas e comunidades. Uma produção SOU Studio.",
          en: "Fig. 01. Koinonia's brand: people, attendance and care management for churches and communities. A SOU Studio production.",
        },
        image: {
          src: "/media/koinonia-cover.webp",
          width: 1200,
          height: 630,
          alt: {
            pt: "Logo do Koinonia: quatro figuras em verde, amarelo e coral formando um círculo, com o texto “Gestão de pessoas, presença e cuidado para igrejas e comunidades”.",
            en: "Koinonia logo: four figures in green, yellow and coral forming a circle, with the line “People, attendance and care management for churches and communities”.",
          },
        },
      },
      evidence: {
        0: [
          {
            title: { pt: "Onde a dor aparecia", en: "Where the pain showed" },
            text: {
              pt: "Na AWAKE, a liderança fazia quase tudo de memória: quem veio aos encontros, quem estava faltando, aniversários, quem procurar.",
              en: "At AWAKE, leaders did almost everything from memory: who came to meetings, who was missing, birthdays, who to reach out to.",
            },
          },
        ],
        1: [
          {
            title: { pt: "A pergunta real", en: "The real question" },
            text: {
              pt: "Uma lista de presença diz quem veio, não por quem começar. A pergunta do produto ficou uma só: quem precisa da minha atenção hoje?",
              en: "An attendance list says who came, not where to start. The product's question became one: who needs my attention today?",
            },
          },
        ],
        2: [
          {
            title: { pt: "Algo real para testar", en: "Something real to test" },
            text: {
              pt: "O briefing para a IA exigia uma aplicação de verdade, não um protótipo visual. Cada rodada foi um plano escrito por mim, executado pela IA e conferido antes da próxima.",
              en: "The brief for the AI demanded a real application, not a visual prototype. Each round was a plan I wrote, the AI carried out and I checked before the next.",
            },
          },
        ],
        3: [
          {
            title: { pt: "521 commits", en: "521 commits" },
            text: {
              pt: "Entre 16 de agosto e 5 de outubro de 2026. Há testes de navegador no desktop e no celular, e as regras do produto têm testes automatizados.",
              en: "Between 16 August and 5 October 2026, with browser tests on desktop and mobile and the product rules covered by automated tests.",
            },
          },
        ],
        4: [
          {
            title: { pt: "A auditoria de setembro", en: "The September audit" },
            text: {
              pt: "Ela achou o Radar errando em silêncio depois de mil registros e o filtro de 7 dias comparando datas invertidas. Os dois foram corrigidos. Hoje o Koinonia está no ar e em uso diário.",
              en: "It found the Radar failing silently past a thousand records and the 7-day filter comparing dates the wrong way. Both were fixed. Koinonia is live and in daily use.",
            },
          },
        ],
      },
      chapters: [
        {
          id: "problem",
          part: "about",
          label: { pt: "O problema", en: "The problem" },
          title: { pt: "Ninguém percebe quem está se afastando.", en: "Nobody notices who is drifting away." },
          body: {
            pt: [
              "O Koinonia nasceu na AWAKE, uma rede de jovens cristãos. A liderança fazia quase tudo de memória: lembrar quem esteve nos encontros, perceber quem estava faltando, lembrar aniversários, procurar quem não apareceu.",
              "Uma lista de presença registra quem veio. Não diz por quem começar. O produto existe para responder a uma pergunta só: quem precisa da minha atenção hoje?",
            ],
            en: [
              "Koinonia started at AWAKE, a network of young Christians. Leaders did almost everything from memory: who came to the meetings, who was missing, whose birthday it was, who to reach out to.",
              "An attendance list records who came. It does not say where to start. The product exists to answer one question: who needs my attention today?",
            ],
          },
        },
        {
          id: "product",
          part: "about",
          label: { pt: "O produto", en: "The product" },
          title: { pt: "Uma fila de cuidado, não uma lista de presença.", en: "A care queue, not an attendance list." },
          body: {
            pt: [
              "O Radar de Cuidado classifica cada pessoa pelo risco de afastamento, a partir da frequência recente e do tempo desde o último encontro. Depois vira uma fila de ação: contatar, registrar o cuidado, acompanhar.",
              "Quem é novo não é punido: com menos de três encontros válidos, a pessoa aparece como “histórico insuficiente”, nunca como risco. Em volta do Radar: chamada rápida, aniversários, mensagens de WhatsApp com modelos, agenda com escalas, pequenos grupos, financeiro e várias organizações isoladas na mesma plataforma.",
            ],
            en: [
              "The Care Radar ranks each person by risk of drifting away, using recent attendance and time since the last meeting. That becomes an action queue: reach out, log the care given, follow up.",
              "Newcomers aren't penalised: with fewer than three valid meetings, a person shows as “not enough history”, never as at risk. Around the Radar: quick roll call, birthdays, WhatsApp messages from templates, a calendar with rotas, small groups, finances and several isolated organisations on one platform.",
            ],
          },
          figures: [
            {
              id: "map",
              aspect: "1200/630",
              label: { pt: "Mapa do sistema", en: "System map" },
              caption: {
                pt: "Fig. 02. O mapa do sistema: pessoas, encontros, cuidado e gestão num só lugar.",
                en: "Fig. 02. The system map: people, meetings, care and management in one place.",
              },
              image: {
                src: "/media/koinonia-map.webp",
                width: 1200,
                height: 630,
                alt: {
                  pt: "Mapa do sistema em quatro colunas. Pessoas: cadastro e histórico, períodos de participação, grupos, aniversários. Encontros: eventos, presenças, calendário (.ics), escalas de serviço. Cuidado: Radar de Cuidado, quem está se afastando, relatórios. Gestão: financeiro, prestação de contas, permissões por módulo, aprovação de acesso.",
                  en: "System map in four columns. People: records and history, participation periods, groups, birthdays. Meetings: events, attendance, calendar (.ics), service rotas. Care: Care Radar, who is drifting away, reports. Management: finances, accountability, per-module permissions, access approval.",
                },
              },
            },
            {
              id: "brand",
              aspect: "1200/630",
              label: { pt: "Marca e ícone", en: "Brand and icon" },
              caption: {
                pt: "Fig. 03. Marca, paleta e ícone do app instalável (PWA).",
                en: "Fig. 03. Brand, palette and the installable app's (PWA) icon.",
              },
              image: {
                src: "/media/koinonia-brand.webp",
                width: 1200,
                height: 630,
                alt: {
                  pt: "Identidade do Koinonia: o símbolo sobre fundo verde, o logotipo, a paleta (#26635B, #63A084, #E9AF4A, #E87656) e o ícone do app em três tamanhos.",
                  en: "Koinonia identity: the symbol on a green background, the wordmark, the palette (#26635B, #63A084, #E9AF4A, #E87656) and the app icon in three sizes.",
                },
              },
            },
          ],
        },
        {
          id: "build",
          part: "process",
          label: { pt: "Como foi construído", en: "How it was built" },
          title: { pt: "A IA escreveu o código. A direção foi minha.", en: "AI wrote the code. The direction was mine." },
          highlight: { pt: "A direção foi minha.", en: "The direction was mine." },
          body: {
            pt: [
              "Não comecei por um editor de código. Comecei por um briefing para a IA, com uma exigência na primeira página: nada de protótipo visual. Uma aplicação real, que a liderança pudesse usar.",
              "A partir daí, o trabalho foi direção: cada rodada foi um plano escrito por mim, executado pela IA e conferido antes da próxima. A IA encurtou a distância entre a ideia e algo testável. Decidir o que testar continuou sendo meu.",
            ],
            en: [
              "I didn't start in a code editor. I started with a brief for the AI, with one demand on the first page: no visual prototype. A real application the leaders could use.",
              "From there, the work was direction: every round was a plan I wrote, the AI carried out, and I checked before the next one. AI shortened the distance between an idea and something testable. Deciding what to test stayed with me.",
            ],
          },
          steps: [
            {
              title: { pt: "Definir o problema", en: "Define the problem" },
              text: { pt: "Uma pergunta guia o produto: quem precisa da minha atenção hoje?", en: "One question drives the product: who needs my attention today?" },
            },
            {
              title: { pt: "Desenhar o fluxo", en: "Design the flow" },
              text: {
                pt: "Da chamada no encontro a uma fila de cuidado: a presença vira prioridade.",
                en: "From the meeting's roll call to a care queue: attendance becomes priority.",
              },
            },
            {
              title: { pt: "Escrever as diretrizes", en: "Write the directives" },
              text: {
                pt: "Um briefing inicial e planos de evolução datados, escritos para a IA executar.",
                en: "An opening brief and dated evolution plans, written for the AI to carry out.",
              },
            },
            {
              title: { pt: "Orquestrar a construção", en: "Orchestrate the build" },
              text: {
                pt: "521 commits entre 16 de agosto e 5 de outubro de 2026.",
                en: "521 commits between 16 August and 5 October 2026.",
              },
            },
            {
              title: { pt: "Testar o resultado", en: "Test the result" },
              text: {
                pt: "Testes de navegador no desktop e no celular, e as regras do produto cobertas por testes automatizados.",
                en: "Browser tests on desktop and mobile, and the product rules covered by automated tests.",
              },
            },
          ],
        },
        {
          id: "audit",
          part: "process",
          label: { pt: "O que a curadoria encontrou", en: "What curation found" },
          title: { pt: "Funcionar não é o mesmo que estar certo.", en: "Working is not the same as being right." },
          body: {
            pt: [
              "Em setembro de 2026, o que a IA tinha construído passou por uma auditoria técnica. O app abria, salvava e parecia certo. Os problemas estavam onde ninguém olha numa demonstração.",
            ],
            en: [
              "In September 2026, what the AI had built went through a technical audit. The app opened, saved and looked right. The problems were where nobody looks in a demo.",
            ],
          },
          steps: [
            {
              title: { pt: "O Radar ia errar em silêncio.", en: "The Radar would have failed silently." },
              text: {
                pt: "As leituras não eram paginadas: depois de mil registros, frequência, Radar e relatórios ficariam errados sem nenhum aviso. Corrigido.",
                en: "Reads weren't paginated: past a thousand records, attendance, the Radar and reports would have gone wrong with no warning. Fixed.",
              },
            },
            {
              title: { pt: "O filtro escondia quem mais precisava.", en: "The filter hid the people who needed it most." },
              text: {
                pt: "“Contatado nos últimos 7 dias” comparava datas invertidas: qualquer contato antigo contava como recente. Corrigido.",
                en: "“Contacted in the last 7 days” compared dates the wrong way round: any old contact counted as recent. Fixed.",
              },
            },
            {
              title: { pt: "Sem testes, sem rede de segurança.", en: "No tests, no safety net." },
              text: {
                pt: "Nenhum teste automatizado e 1.806 problemas de lint. Hoje há testes das regras do produto e verificação contínua no GitHub.",
                en: "No automated tests and 1,806 lint problems. Today the product rules are tested and checked continuously on GitHub.",
              },
            },
            {
              title: { pt: "Preso ao editor da IA.", en: "Locked to the AI editor." },
              text: {
                pt: "Build, logo e telemetria dependiam da ferramenta onde o app nasceu. O projeto ganhou repositório e configuração próprios.",
                en: "Build, logo and telemetry depended on the tool the app was born in. The project moved to its own repository and configuration.",
              },
            },
          ],
        },
        {
          id: "learned",
          part: "process",
          label: { pt: "O que aprendi", en: "What I learned" },
          title: { pt: "Aprendi onde a ferramenta acaba.", en: "I learned where the tool ends." },
          // Iury's own words (chat, 2026-11-09); EN is a faithful translation.
          body: {
            pt: [
              "Comecei o Koinonia usando o Lovable, mas rapidamente encontrei os limites da ferramenta. Migrei o desenvolvimento para o Claude, onde tive menos restrições e mais poder de criação.",
              "Nesse processo, precisei aprender na prática a tomar decisões de design, implementar integrações de pagamento e realizar validações rigorosas. A IA escreveu o código, mas a minha curadoria e aprendizado contínuo foram o que garantiram que o produto funcionasse de verdade.",
            ],
            en: [
              "I started Koinonia with Lovable, but quickly ran into the tool's limits. I moved development to Claude, where I had fewer restrictions and more room to create.",
              "Along the way I had to learn, hands-on, how to make design decisions, implement payment integrations and run rigorous validation. The AI wrote the code, but my curation and continuous learning are what made sure the product actually worked.",
            ],
          },
        },
      ],
    },
  },
  {
    slug: "sou-studio",
    index: "P.02",
    name: "SOU Studio",
    status: "shaping",
    stage: 3,
    stageNote: { pt: "Em estruturação como negócio.", en: "Taking shape as a business." },
    tags: ["business", "design", "web", "audiovisual"],
    summary: {
      pt: "O estúdio que estou construindo: sites e sistemas, identidade visual, produção audiovisual, assistência técnica e automações.",
      en: "The studio I am building: websites and systems, visual identity, video production, device repair and automations.",
    },
    source: "Iury (profile and chat, 2026-11-16): SOU Studio services; Koinonia is 'uma produção SOU Studio'; Hyper is used in the studio's routine",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "Iury (2026-11-16)",
      lead: {
        pt: "A SOU Studio é a iniciativa que estou construindo para unir tecnologia, design e conteúdo num só lugar.",
        en: "SOU Studio is the venture I am building to bring technology, design and content together in one place.",
      },
      access: {
        pt: "Ainda não há um link público da SOU Studio aqui. Para falar sobre um projeto, escreva para mim.",
        en: "There is no public SOU Studio link here yet. To talk about a project, write to me.",
      },
      evidence: {
        3: [
          {
            title: { pt: "Cinco frentes", en: "Five areas" },
            text: {
              pt: "Sites e sistemas, identidade visual e design, assistência técnica em dispositivos, produção audiovisual e conteúdo, soluções e automações.",
              en: "Websites and systems, visual identity and design, device repair, video production and content, solutions and automations.",
            },
          },
          {
            title: { pt: "O que já saiu daqui", en: "What has come out of it" },
            text: {
              pt: "O Koinonia é uma produção SOU Studio, e o Hyper faz parte da rotina de conteúdo do estúdio.",
              en: "Koinonia is a SOU Studio production, and Hyper is part of the studio's content routine.",
            },
          },
        ],
      },
      chapters: [
        {
          id: "idea",
          part: "about",
          label: { pt: "O estúdio", en: "The studio" },
          title: { pt: "Tecnologia, design e conteúdo no mesmo lugar.", en: "Technology, design and content in one place." },
          steps: [
            { title: { pt: "Sites e sistemas", en: "Websites and systems" }, text: { pt: "Do site institucional ao sistema sob medida.", en: "From a company site to a custom system." } },
            { title: { pt: "Identidade visual e design", en: "Visual identity and design" }, text: { pt: "Marca, materiais e interfaces.", en: "Brand, materials and interfaces." } },
            { title: { pt: "Produção audiovisual", en: "Video production" }, text: { pt: "Conteúdo digital, vídeo e motion.", en: "Digital content, video and motion." } },
            { title: { pt: "Assistência técnica", en: "Device repair" }, text: { pt: "Cuidado com os dispositivos do dia a dia.", en: "Care for everyday devices." } },
            { title: { pt: "Soluções e automações", en: "Solutions and automations" }, text: { pt: "Tecnologia para tirar trabalho repetitivo do caminho.", en: "Technology to take repetitive work out of the way." } },
          ],
        },
        {
          id: "use",
          part: "process",
          label: { pt: "Onde está agora", en: "Where it is now" },
          title: { pt: "Um negócio em construção.", en: "A business in the making." },
          body: {
            pt: ["O objetivo é transformar a SOU num negócio profissional e sustentável. Os projetos desta página mostram o tipo de trabalho que sai dela."],
            en: ["The goal is to turn SOU into a professional, sustainable business. The projects on this page show the kind of work that comes out of it."],
          },
        },
      ],
    },
  },
  {
    slug: "via-hebraica",
    index: "P.03",
    name: "Via Hebraica",
    nameLang: "pt",
    status: "evolving",
    stage: 4,
    stageNote: { pt: "No ar, mas ainda precisa de melhorias e evolução.", en: "Live, but it still needs work and growth." },
    tags: ["web", "personal"],
    summary: {
      pt: "Um dos meus primeiros projetos: app web de estudos bíblicos com leitor, atlas, cronologia e marca-páginas. Feito enquanto eu aprendia, ainda precisa evoluir.",
      en: "One of my first projects: a Bible-study web app with a reader, atlas, timeline and bookmarks. Built while I was learning, it still needs to grow.",
    },
    cover: {
      src: "/media/via-hebraica-cover.webp",
      width: 1600,
      height: 1200,
      alt: { pt: "Logo do Via Hebraica: um livro aberto com um caminho no meio e uma estrela acima.", en: "Via Hebraica logo: an open book with a path through it and a star above." },
    },
    links: [{ label: { pt: "Ver o Via Hebraica", en: "Visit Via Hebraica" }, href: "https://viahebraica.app" }],
    source: "audit §5; Iury (chat, 2026-11-16): one of his first projects, built while learning, still needs work; logo from Iury (vectorised)",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "audit §5 + Iury (chat, 2026-11-16)",
      lead: {
        pt: "Um app web para estudar a Bíblia, com leitor, atlas, cronologia e marca-páginas. Um dos meus primeiros projetos.",
        en: "A web app for studying the Bible, with a reader, atlas, timeline and bookmarks. One of my first projects.",
      },
      cover: {
        id: "cover",
        aspect: "4/3",
        label: { pt: "Marca", en: "Brand" },
        caption: { pt: "A marca do Via Hebraica, redesenhada em vetor.", en: "The Via Hebraica mark, redrawn as a vector." },
        image: {
          src: "/media/via-hebraica-cover.webp",
          width: 1600,
          height: 1200,
          alt: { pt: "Logo do Via Hebraica: um livro aberto com um caminho no meio e uma estrela acima.", en: "Via Hebraica logo: an open book with a path through it and a star above." },
        },
      },
      evidence: {
        3: [
          {
            title: { pt: "O que foi construído", en: "What was built" },
            text: { pt: "Um leitor para o texto, um atlas, uma cronologia e marca-páginas, feitos enquanto eu aprendia a desenvolver.", en: "A reader for the text, an atlas, a timeline and bookmarks, made while I was learning to develop." },
          },
        ],
        4: [
          {
            title: { pt: "O que falta", en: "What is missing" },
            text: { pt: "Está no ar, mas ainda precisa de melhorias e evolução.", en: "It is live, but it still needs work and growth." },
          },
        ],
      },
      chapters: [
        {
          id: "idea",
          part: "about",
          label: { pt: "A proposta", en: "The idea" },
          title: { pt: "Estudar a Bíblia em um só lugar.", en: "Studying the Bible in one place." },
          body: {
            pt: ["O Via Hebraica reúne o que um estudo bíblico costuma pedir. Tem um leitor para o texto, um atlas, uma cronologia e marca-páginas para voltar ao que importa."],
            en: ["Via Hebraica brings together what Bible study usually asks for. It has a reader for the text, an atlas, a timeline and bookmarks to come back to what matters."],
          },
        },
        {
          id: "origin",
          part: "process",
          label: { pt: "Onde ele entra", en: "Where it fits" },
          title: { pt: "Feito enquanto eu aprendia.", en: "Built while I was learning." },
          body: {
            pt: [
              "Foi um dos meus primeiros projetos, construído enquanto eu ainda estava aprendendo a desenvolver. Por isso ele faz parte da minha trajetória: mostra de onde eu parti.",
              "Está no ar, mas ainda precisa de melhorias e evolução.",
            ],
            en: [
              "It was one of my first projects, built while I was still learning to develop. That is why it belongs to my path: it shows where I started.",
              "It is live, but it still needs work and growth.",
            ],
          },
        },
      ],
    },
  },
  {
    slug: "autonomia",
    index: "P.04",
    name: "AutonomIA",
    status: "pitch",
    stage: 1,
    stageNote: {
      pt: "Criado no Startup Weekend: o aprendizado foi validar o problema antes da solução.",
      en: "Created at Startup Weekend: the lesson was to validate the problem before the solution.",
    },
    tags: ["ai", "product", "event"],
    summary: {
      pt: "Organizador de tarefas com IA que lembra você pelo WhatsApp, criado em equipe no Startup Weekend. O pitch ficou comigo.",
      en: "An AI task organiser that reminds you over WhatsApp, created as a team at Startup Weekend. I gave the pitch.",
    },
    related: [{ kind: "linkedin", label: { pt: "Post no LinkedIn", en: "LinkedIn post" }, href: "https://lnkd.in/p/dqdj2qYm" }],
    source: "Iury's Startup Weekend post (2026-11-12) + Iury (chat, 2026-11-16): add AutonomIA as a project, with its motion video in a phone",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "Iury's Startup Weekend post + chat (2026-11-16)",
      lead: {
        pt: "Um organizador de tarefas com IA que lembra você pelo WhatsApp. Nasceu em um fim de semana, com um time que se conheceu ali.",
        en: "An AI task organiser that reminds you over WhatsApp. It was born in one weekend, with a team that met there.",
      },
      video: { title: { pt: "AutonomIA em motion design", en: "AutonomIA in motion design" } },
      access: {
        pt: "O AutonomIA ficou no pitch do Startup Weekend: não há uma versão para acessar. O post conta como foi.",
        en: "AutonomIA stayed at the Startup Weekend pitch: there is no version to open. The post tells how it went.",
      },
      evidence: {
        1: [
          {
            title: { pt: "O que o evento ensinou", en: "What the event taught" },
            text: {
              pt: "Validar o problema vem antes de construir a solução: é preciso provar que outras pessoas sentem a mesma dor, não só eu.",
              en: "Validating the problem comes before building the solution: you have to prove other people feel the same pain, not just you.",
            },
          },
        ],
        2: [
          {
            title: { pt: "A solução do pitch, ainda não validada", en: "The pitch's solution, not validated yet" },
            text: {
              pt: "Um organizador de tarefas com IA que lembra pelo WhatsApp. Foi o que apresentamos; testar se ele resolve a dor seria o passo seguinte.",
              en: "An AI task organiser that reminds you over WhatsApp. That is what we presented; testing whether it solves the pain would be the next step.",
            },
          },
        ],
      },
      chapters: [
        {
          id: "idea",
          part: "about",
          label: { pt: "A ideia", en: "The idea" },
          title: { pt: "Um time, um fim de semana, uma ideia.", en: "One team, one weekend, one idea." },
          body: {
            pt: [
              "No Startup Weekend, conheci todo o time no próprio evento. Juntos criamos o AutonomIA, um organizador de tarefas com IA que lembra você pelo WhatsApp.",
              "Foi um sábado das 8h às 22h. O pitch ficou comigo, e o passador de slides parou de funcionar justo na minha vez.",
            ],
            en: [
              "At Startup Weekend, I met the whole team at the event itself. Together we created AutonomIA, an AI task organiser that reminds you over WhatsApp.",
              "It was a Saturday from 8 am to 10 pm. I gave the pitch, and the slide clicker stopped working right on my turn.",
            ],
          },
        },
        {
          id: "stage",
          part: "process",
          label: { pt: "O que ficou", en: "What stayed" },
          title: { pt: "Provar a dor antes da solução.", en: "Prove the pain before the solution." },
          body: {
            pt: ["O maior aprendizado foi sobre ordem: primeiro provar que outras pessoas sentem a mesma dor, só depois construir. Apresentar sem o cenário ideal também me ensinou mais do que um pitch perfeito ensinaria."],
            en: ["The biggest lesson was about order: first prove other people feel the same pain, only then build. Presenting without the ideal setting also taught me more than a perfect pitch would have."],
          },
        },
      ],
    },
  },
  {
    slug: "1kid",
    index: "P.05",
    name: "1Kid",
    status: "validating",
    stage: 1,
    stageNote: {
      pt: "Validando o problema: a dor existe, importa e como as pessoas lidam com ela hoje?",
      en: "Validating the problem: does the pain exist, does it matter, and how do people deal with it today?",
    },
    year: 2026,
    tags: ["research", "product"],
    summary: {
      pt: "Uma ideia sobre os desafios de quem acabou de ter o primeiro filho, ainda sem solução. Agora: entender se a dor existe e se ela importa.",
      en: "An idea about the challenges of people who just had their first child, with no solution yet. Now: finding out whether the pain exists and whether it matters.",
    },
    cover: {
      src: "/media/1kid-cover.webp",
      width: 1600,
      height: 1200,
      alt: { pt: "Logo do 1Kid: o número 1 e a letra K formando um bebê enrolado, com dois traços laranja.", en: "1Kid logo: the number 1 and the letter K forming a swaddled baby, with two orange strokes." },
    },
    source: "Iury (chat, 2026-11-16): renamed 1Kid (was 'Copiloto de parentalidade'); problem validation, no validated solution; logo from Iury",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "Iury (chat, 2026-11-16) + outside research (cited)",
      lead: {
        pt: "Uma ideia ainda em desenvolvimento. Antes de pensar em qualquer solução, estou descobrindo se o problema é real.",
        en: "An idea still in progress. Before thinking about any solution, I am finding out whether the problem is real.",
      },
      cover: {
        id: "cover",
        aspect: "4/3",
        label: { pt: "Marca", en: "Brand" },
        caption: { pt: "A marca do 1Kid.", en: "The 1Kid mark." },
        image: {
          src: "/media/1kid-cover.webp",
          width: 1600,
          height: 1200,
          alt: { pt: "Logo do 1Kid: o número 1 e a letra K formando um bebê enrolado, com dois traços laranja.", en: "1Kid logo: the number 1 and the letter K forming a swaddled baby, with two orange strokes." },
        },
      },
      access: {
        pt: "Ainda não há o que acessar: o projeto está na validação do problema.",
        en: "There is nothing to open yet: the project is at problem validation.",
      },
      evidence: {
        0: [
          {
            title: { pt: "Pesquisa: o sono depois do primeiro filho", en: "Research: sleep after the first child" },
            text: {
              pt: "Um estudo com 4.659 pais na Alemanha viu o sono cair forte nos primeiros meses, sobretudo para as mães. Ele não voltou ao nível de antes nem seis anos depois. Pais de primeira viagem foram os mais afetados.",
              en: "A study of 4,659 parents in Germany saw sleep drop sharply in the first months, above all for mothers. It had not returned to the earlier level six years later. First-time parents were hit hardest.",
            },
            source: { label: "Richter et al., Sleep, 2019 (doi:10.1093/sleep/zsz015)", href: "https://doi.org/10.1093/sleep/zsz015" },
          },
        ],
        1: [
          {
            title: { pt: "Pesquisa: o peso no Brasil", en: "Research: the weight in Brazil" },
            text: {
              pt: "Na pesquisa Nascer no Brasil, com 23.894 mães entrevistadas, 26,3% tinham sinais de provável depressão pós-parto. É um rastreio, não um diagnóstico, mas mostra o tamanho do desafio.",
              en: "In the Birth in Brazil survey, with 23,894 mothers interviewed, 26.3% showed signs of probable postpartum depression. It is a screening, not a diagnosis, but it shows the size of the challenge.",
            },
            source: { label: "Fiocruz, Nascer no Brasil (Theme Filha et al., 2016)", href: "https://portaldeboaspraticas.iff.fiocruz.br/biblioteca/factors-associated-with-postpartum-depressive-symptomatology-in-brazil-the-birth-in-brazil-national/" },
          },
          {
            title: { pt: "O que estou fazendo agora", en: "What I am doing now" },
            text: {
              pt: "Pesquisa mostra que a dificuldade existe; não mostra qual dor um produto deveria resolver. Por isso o passo agora é conversar com pais: entender se a dor existe para eles, quanto pesa e como lidam com ela hoje.",
              en: "Research shows the difficulty exists; it does not show which pain a product should solve. So the step now is talking to parents. Is the pain real for them? How much does it weigh, and how do they deal with it today?",
            },
          },
        ],
      },
      chapters: [
        {
          id: "idea",
          part: "about",
          label: { pt: "A ideia", en: "The idea" },
          title: { pt: "Uma pergunta, ainda sem resposta.", en: "A question, still without an answer." },
          body: {
            pt: [
              "É uma ideia em desenvolvimento sobre as dificuldades de quem acabou de se tornar pai ou mãe.",
              "Ainda não existe uma solução validada. O objetivo agora é outro: saber se essa dor existe de verdade.",
            ],
            en: [
              "It is an idea in progress about the difficulties of people who have just become parents.",
              "There is no validated solution yet. The goal right now is different: to find out whether this pain is real.",
            ],
          },
        },
        {
          id: "stage",
          part: "process",
          label: { pt: "Onde está agora", en: "Where it is now" },
          title: { pt: "Primeiro, validar o problema.", en: "First, validate the problem." },
          body: {
            pt: [
              "Estou na fase de validação do problema. Quero entender se a dor realmente existe, qual a relevância dela e como as pessoas lidam com ela hoje.",
              "Só depois dessa etapa vem a validação da solução. Até lá, nenhuma solução é tratada como certa.",
            ],
            en: [
              "I am at the problem-validation stage: understanding whether the pain really exists, how much it matters and how people deal with it today.",
              "Only after that comes solution validation. Until then, no solution is treated as settled.",
            ],
          },
        },
      ],
    },
  },
  {
    slug: "hyper",
    index: "P.06",
    name: "Hyper",
    status: "in-use",
    stage: 4,
    stageNote: { pt: "Em uso na SOU Studio, sempre que preciso de ideias.", en: "In use at SOU Studio, whenever I need ideas." },
    tags: ["data", "research"],
    summary: {
      pt: "Ferramenta que uso na SOU Studio para encontrar tendências e oportunidades de conteúdo.",
      en: "A tool I use at SOU Studio to find trends and content opportunities.",
    },
    cover: {
      src: "/media/hyper-cover.webp",
      width: 1600,
      height: 1200,
      alt: { pt: "A marca H do Hyper sobre um gráfico de hype em alta, em verde-limão.", en: "Hyper's H mark over a rising hype chart, in lime." },
    },
    source: "Iury (chat, 2026-11-16): renamed Hyper (was 'Central de Inteligência de Tendências'); used now and then at SOU Studio; logo from Iury (vectorised), cover: a positive hype chart",
    confirmed: true,
    caseStudy: {
      confirmed: true,
      source: "Iury (chat, 2026-11-16)",
      lead: {
        pt: "Uma ferramenta de uso real no dia a dia da SOU Studio, para identificar tendências e oportunidades de conteúdo.",
        en: "A tool in real use at SOU Studio, for spotting trends and content opportunities.",
      },
      cover: {
        id: "cover",
        aspect: "4/3",
        label: { pt: "Marca", en: "Brand" },
        caption: { pt: "A marca do Hyper sobre um gráfico de hype em alta.", en: "Hyper's mark over a rising hype chart." },
        image: {
          src: "/media/hyper-cover.webp",
          width: 1600,
          height: 1200,
          alt: { pt: "A marca H do Hyper sobre um gráfico de hype em alta, em verde-limão.", en: "Hyper's H mark over a rising hype chart, in lime." },
        },
      },
      access: {
        pt: "É uma ferramenta interna da SOU Studio, sem acesso público.",
        en: "It is an internal SOU Studio tool, with no public access.",
      },
      evidence: {
        3: [
          {
            title: { pt: "Para que foi feito", en: "What it was made for" },
            text: { pt: "Identificar tendências e oportunidades de conteúdo para a SOU Studio.", en: "Spotting trends and content opportunities for SOU Studio." },
          },
        ],
        4: [
          {
            title: { pt: "Como é usado", en: "How it is used" },
            text: {
              pt: "De vez em quando, para encontrar ideias e desenvolver conteúdos que façam sentido para o momento.",
              en: "Now and then, to find ideas and develop content that fits the moment.",
            },
          },
        ],
      },
      chapters: [
        {
          id: "idea",
          part: "about",
          label: { pt: "Para que serve", en: "What it is for" },
          title: { pt: "Encontrar o que faz sentido agora.", en: "Finding what makes sense right now." },
          body: {
            pt: [
              "O Hyper ajuda a identificar tendências e oportunidades de conteúdo.",
              "Eu o uso de vez em quando, para encontrar ideias e desenvolver conteúdos que façam sentido para o momento.",
            ],
            en: [
              "Hyper helps spot trends and content opportunities.",
              "I use it now and then, to find ideas and develop content that fits the moment.",
            ],
          },
        },
        {
          id: "use",
          part: "process",
          label: { pt: "No fluxo de trabalho", en: "In the workflow" },
          title: { pt: "Parte do meu fluxo de trabalho.", en: "Part of my workflow." },
          body: {
            pt: ["Ele não é uma demonstração: faz parte de como a SOU Studio pensa conteúdo. Entra em cena quando preciso de ideias novas."],
            en: ["It is not a demo: it is part of how SOU Studio thinks about content. It comes in when I need fresh ideas."],
          },
        },
      ],
    },
  },
];

/** Projects whose case study is confirmed — the only ones that get a page. */
export function getCaseStudies(): (Project & { caseStudy: CaseStudy })[] {
  return projects.filter((p): p is Project & { caseStudy: CaseStudy } => p.caseStudy?.confirmed === true);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
