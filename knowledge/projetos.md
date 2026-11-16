# Projetos

## Koinonia (concluído, no ar e em uso diário, 2026)
- Plataforma web (PWA) de gestão de comunidades e igrejas. Concluída, publicada e em uso diário: https://usekoinonia.com.br
- Papel do Iury: product builder. Definiu o problema e o fluxo, escreveu as diretrizes para a IA, conduziu a construção e testou o resultado.
- Construído com Lovable e Claude, a partir de um briefing e de planos escritos pelo Iury. Ele conferiu cada rodada e testou no desktop e no celular.
- Por que um Radar: uma lista de presença diz quem veio, não por quem começar. O Radar ordena as pessoas pelo risco de afastamento e vira uma fila de cuidado. Quem acabou de chegar não é marcado como risco.
- Auditoria encontrou falhas silenciosas: leituras sem paginação deixariam o Radar errado depois de mil registros; um filtro de datas invertido escondia quem precisava de cuidado; não havia nenhum teste. Tudo foi corrigido.
- Stack: TanStack Start (React 19, páginas renderizadas no servidor), TanStack Query, Supabase (Postgres, login por e-mail e senha, Realtime), Tailwind CSS v4, Vitest, GitHub Actions, Cloudflare Workers.
- Arquitetura: cada organização é isolada no banco por regras de acesso por linha (RLS) presas à organização ativa da conta; ser administrador em uma não dá acesso a outra.
- Permissões: dez módulos, cada um com ver e editar, conferidos dentro do banco. Perfis prontos (como Líder ou Financeiro) preenchem vários de uma vez.
- PWA instalável pelo manifesto. Ainda não tem service worker, então não funciona offline.
- Testes: Vitest cobre as regras do produto em nove arquivos. Na auditoria, testes de navegador rodaram no desktop e no celular.
- CI: a cada push, o GitHub Actions confere tipos, lint e testes, faz o build e sobe o servidor para um teste rápido.
- Roda na Cloudflare Workers (plano gratuito), com o banco no Supabase. Só o branch de produção publica, e só recebe código com o CI verde.
- Como a IA entra: o Iury escreve o briefing e os planos datados de cada rodada, a IA executa, um arquivo AGENTS.md fixa as regras para os agentes e a auditoria confere o resultado.
- O código do Koinonia está em um repositório privado.
- Em uso, em números (relatório gerado pelo próprio Koinonia, dados de 16/11/2026): 62 pessoas acompanhadas (65 cadastradas, 3 arquivadas) em uma comunidade; 15 encontros e 270 presenças registradas; 1.435 contatos de cuidado registrados, 300 deles nos últimos 30 dias.
- Sobre esses números, o Tisco só fala desses totais. Não existem aqui nomes de pessoas acompanhadas, nomes de grupos, taxas de presença, faltas ou quem está em risco, e ele não deve deduzir nada disso.
- Existe um estudo de caso completo no site.

- O Koinonia é a versão melhorada de um projeto anterior, o Centro do Despertar, que não existe mais.

## SOU Studio (em desenvolvimento)
- O estúdio do Iury também aparece entre os projetos do site, logo abaixo do Koinonia. Detalhes em sou-studio.md.

## Via Hebraica (no ar, ainda precisa evoluir)
- Um dos primeiros projetos do Iury, feito enquanto aprendia. App web de estudos bíblicos com leitor, atlas, cronologia e marca-páginas: https://viahebraica.app
- Está no ar, mas ainda precisa de melhorias e evolução.
- [PREENCHER: ferramentas usadas e o que ele decidiu]

## 1Kid (2026, validando o problema)
- Uma ideia em desenvolvimento, ainda sem solução. Agora o Iury tenta entender se a dor existe, se ela importa e como as pessoas lidam com ela hoje.
- Antes se chamava "Pais de primeira viagem" e, antes disso, "Copiloto de parentalidade". Não há solução validada nem produto pronto.
- Pesquisas citadas no site como indícios do problema (não como validação): Richter et al., revista Sleep, 2019 (o sono de pais cai forte depois do primeiro filho e não volta ao nível de antes nem seis anos depois); Fiocruz, Nascer no Brasil, 2016 (26,3% das mães com sinais de provável depressão pós-parto).

## Hyper (em uso na SOU Studio)
- Antes se chamava "Central de Inteligência de Tendências".
- Ferramenta que o Iury usa na SOU Studio para encontrar tendências e oportunidades de conteúdo, sempre que precisa de ideias.
- [PREENCHER: como funciona, em uma frase]

## AutomIA (experiência encerrada após o Startup Weekend)
- Escreve-se AutomIA. Nasceu em equipe no Startup Weekend. O Iury liderou o grupo e fez o pitch.
- Ideia de assistente inteligente, um "segundo cérebro": o usuário encaminha mensagens, áudios e documentos pelo WhatsApp, e o sistema organiza as informações e lembra no momento certo.
- No próprio evento, o produto foi feito, testado e anunciado em menos de uma hora.
- Com um único post, 8 pessoas pediram o produto e 3 disseram que pagariam. Ninguém chegou a pagar. Isso não é validação nem são clientes.
- Depois do evento o grupo não avançou. O projeto parou ali, e o código ficou com o grupo, não com o Iury. Não há site nem repositório dele.
- [PREENCHER: o que exatamente foi construído]
- [PREENCHER: quem testou e usou]

## Jogo de terror e aventura no Roblox (inacabado)
- Um RPG de aventura com elementos de terror, feito no Roblox Studio, com estilo visual blocky próprio do Roblox.
- O Iury começou o desenvolvimento, mas nunca terminou. Não é um jogo lançado nem concluído.

## Este portfólio
- Também é um projeto dele: feito com Next.js, e o gato é o assistente (um modelo Gemini que responde só com o que o Iury escreveu).
- Cada projeto do site tem uma página própria com o estudo de caso.
- Endereço: https://umbelino.dev. O código é público: https://github.com/Umbelino-dev/portfolio
