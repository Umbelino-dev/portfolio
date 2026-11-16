import type { Localized } from "./types";

/**
 * Photos for the Profile photo deck (PhotoDeck). Real photos of Iury only.
 * To add one: put the source in assets/media/, add it to scripts/images.mjs,
 * run `npm run images`, then add an entry here with its width/height and an alt
 * text that describes only what is in the picture. Photos with other people:
 * only with their consent. `summary`, `story`, `takeaways` and `linkedin` stay
 * undefined until there is a source: the card then says its story is coming, never
 * invents one.
 *
 * Iury, 2026-11-16: the portrait left the deck (it stays in the hero). The two
 * Startup Weekend photos share one post but say different things: "O time do
 * AutonomIA" is about the team (everyone met there), "Startup Weekend" is about
 * the event. CRIO Conecta ran three days (27–29 Oct 2026), one post per day; the
 * photo (Iury with Miguel Cordova) is from day two. Stories and takeaways are
 * drawn from Iury's posts and words, never copied; the people listed in the
 * day-three post are left out (third parties).
 */
export interface GalleryPhoto {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  caption: Localized;
  /** One or two lines, shown in the box that rises from the pointer on hover. */
  summary?: Localized;
  /** The longer story, shown when the card is opened ("Saber mais"). */
  story?: Localized;
  /**
   * The LinkedIn post about this moment. `url` is the post's public link (the
   * "Ver no LinkedIn" button); `embed` is LinkedIn's embed URL for the same post
   * (Share → Embed this post → the iframe's src,
   * https://www.linkedin.com/embed/feed/update/urn:li:share:…).
   */
  linkedin?: {
    url: string;
    embed?: string;
    /** Other posts about the same moment (e.g. other days), shown as text links. */
    also?: { label: Localized; url: string }[];
  };
  /**
   * What the moment added to Iury, professionally and academically: short points,
   * drawn only from what he wrote about it (his posts). Not a copy of the post.
   */
  takeaways?: Localized<string[]>;
  /** CSS object-position for the card crop (default "50% 18%", a portrait's face). */
  focus?: string;
}

export const gallery: GalleryPhoto[] = [
  {
    src: "/media/startup-weekend-team.webp",
    width: 800,
    height: 600,
    focus: "50% 40%",
    alt: {
      pt: "Iury no centro de um grupo de seis pessoas, quase todas de camiseta verde e crachá do T.S.W., num espaço de trabalho.",
      en: "Iury at the centre of a group of six people, most in green T-shirts and T.S.W. badges, in a workspace.",
    },
    caption: { pt: "O AutonomIA", en: "AutonomIA" },
    summary: {
      pt: "Um time que se conheceu no próprio Startup Weekend. Ninguém se conhecia antes, e juntos criamos o AutonomIA.",
      en: "A team that met at Startup Weekend itself. None of us knew each other before, and together we created AutonomIA.",
    },
    story: {
      pt: "Conheci todo o time no evento. Juntos, criamos o AutonomIA, um organizador de tarefas com IA que lembra você pelo WhatsApp. O pitch ficou comigo.",
      en: "I met the whole team at the event. Together we created AutonomIA, an AI task organiser that reminds you over WhatsApp. I gave the pitch.",
    },
    linkedin: { url: "https://lnkd.in/p/dqdj2qYm" },
    takeaways: {
      pt: [
        "Trabalhar em um time formado na hora, com gente que eu nunca tinha visto, num sábado das 8h às 22h.",
        "Sair do zero até o pitch do AutonomIA com pessoas que conheci ali mesmo.",
      ],
      en: [
        "Working in a team formed on the spot, with people I had never met, on a Saturday from 8 am to 10 pm.",
        "Going from nothing to the AutonomIA pitch with people I met right there.",
      ],
    },
  },
  {
    src: "/media/crio-conecta.webp",
    width: 480,
    height: 640,
    focus: "50% 30%",
    alt: {
      pt: "Iury sorrindo ao lado de Miguel Cordova, de terno e gravata, e apontando para ele, diante do painel do CRIO Conecta com as datas 27, 28 e 29 de outubro.",
      en: "Iury smiling next to Miguel Cordova, in a suit and tie, pointing at him, in front of the CRIO Conecta screen showing 27, 28 and 29 October.",
    },
    caption: { pt: "CRIO Conecta", en: "CRIO Conecta" },
    summary: {
      pt: "Três dias sobre IA nas empresas. O que ficou: usar IA com estratégia e saber mostrar o valor do próprio trabalho.",
      en: "Three days on AI in companies. What stayed: using AI strategically and knowing how to show the value of your own work.",
    },
    story: {
      pt: "O CRIO Conecta teve três dias, de 27 a 29 de outubro de 2026. A foto é do segundo dia, com Miguel Cordova, um dos palestrantes internacionais da programação feita em parceria com a UNESC.",
      en: "CRIO Conecta ran for three days, 27 to 29 October 2026. The photo is from day two, with Miguel Cordova, one of the international speakers in the programme run with UNESC.",
    },
    linkedin: {
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7521405561553182720/",
      also: [
        {
          label: { pt: "Post do primeiro dia", en: "Day-one post" },
          url: "https://www.linkedin.com/feed/update/urn:li:activity:7521042926051799040/",
        },
        {
          label: { pt: "Post do último dia", en: "Last-day post" },
          url: "https://www.linkedin.com/feed/update/urn:li:activity:7521932874430918656/",
        },
      ],
    },
    takeaways: {
      pt: [
        "Primeiro dia, na palestra de Saionara Ugioni: não basta fazer bem feito. É preciso saber comunicar o valor do próprio trabalho e dos resultados.",
        "Segundo dia: saber usar IA com estratégia, para resolver problemas e gerar valor, vai ser cada vez mais importante em tecnologia. Conhecer as ferramentas não basta.",
        "Último dia: IA aplicada em empresas, com casos reais, e conversas com quem está na linha de frente antes, durante e depois das palestras.",
      ],
      en: [
        "Day one, at Saionara Ugioni's talk: doing good work is not enough. You also need to communicate the value of your work and its results.",
        "Day two: using AI strategically, to solve problems and create value, will matter more and more in tech. Knowing the tools is not enough.",
        "Last day: AI applied in companies, with real cases, and conversations with people on the front line before, during and after the talks.",
      ],
    },
  },
  {
    src: "/media/startup-weekend.webp",
    width: 480,
    height: 720,
    focus: "50% 30%",
    alt: {
      pt: "Iury sorrindo e fazendo um sinal com a mão, com crachá do T.S.W., diante de um painel de patrocinadores do Startup Weekend.",
      en: "Iury smiling and making a hand sign, wearing a T.S.W. badge, in front of a Startup Weekend sponsor wall.",
    },
    caption: { pt: "Startup Weekend", en: "Startup Weekend" },
    summary: {
      pt: "Validar o problema é mais difícil do que construir a solução. Foi o que o fim de semana me ensinou.",
      en: "Validating the problem is harder than building the solution. That is what the weekend taught me.",
    },
    story: {
      pt: "O pitch do AutonomIA ficou comigo, e o passador de slides parou de funcionar justo na minha vez.",
      en: "I gave the AutonomIA pitch, and the slide clicker stopped working right on my turn.",
    },
    linkedin: { url: "https://lnkd.in/p/dqdj2qYm" },
    takeaways: {
      pt: [
        "Validar o problema vem antes de construir a solução: é preciso provar que outras pessoas sentem a mesma dor, não só eu.",
        "Apresentar sem o cenário ideal me ensinou mais do que um pitch perfeito ensinaria.",
        "Saí mais seguro para apresentar projetos e sabendo exatamente onde preciso melhorar.",
      ],
      en: [
        "Validating the problem comes before building the solution: you have to prove other people feel the same pain, not just you.",
        "Presenting without the ideal setting taught me more than a perfect pitch would have.",
        "I left more confident presenting projects and knowing exactly where I need to improve.",
      ],
    },
  },
];
