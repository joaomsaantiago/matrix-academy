// Conteúdo da landing. Os módulos e as aulas são uma estrutura de exemplo:
// ajuste títulos, descrições e quantidade de aulas quando o roteiro final estiver pronto.

export type ModuleItem = {
  title: string;
  short: string;
  lessons: number;
  text: string;
  /** Foto da Matrix 26 usada neste módulo e o recorte (zoom) que mostra a parte da mesa. */
  photo: string;
  focus: { x: number; y: number; zoom: number };
};

export const MODULES: ModuleItem[] = [
  {
    title: "Conhecendo a Matrix",
    short: "Conhecer",
    lessons: 4,
    text: "Um passeio pela mesa: tela de 10 polegadas, faders motorizados, camadas e as diferenças entre a Matrix 20 e a Matrix 26.",
    photo: "/img/matrix/matrix26-3.png",
    focus: { x: 50, y: 52, zoom: 1 },
  },
  {
    title: "Conexões e entradas",
    short: "Entradas",
    lessons: 5,
    text: "Microfones, linhas, USB e RCA. Ganho, phantom power de +48 V e como organizar as entradas antes de ligar o som.",
    photo: "/img/matrix/matrix26-4.png",
    focus: { x: 76, y: 54, zoom: 2.1 },
  },
  {
    title: "Canais e processamento",
    short: "Canais",
    lessons: 6,
    text: "EQ paramétrico de 4 bandas, compressor, noise gate, low cut e fase: o que cada ajuste faz em cada canal.",
    photo: "/img/matrix/matrix26-1.png",
    focus: { x: 46, y: 50, zoom: 1.9 },
  },
  {
    title: "Saídas e auxiliares",
    short: "Saídas",
    lessons: 5,
    text: "Main, Control Room e os auxiliares para a monitoração de cada músico, mais o EQ gráfico de 31 bandas na saída.",
    photo: "/img/matrix/matrix26-4.png",
    focus: { x: 32, y: 55, zoom: 2.1 },
  },
  {
    title: "Efeitos e DSP",
    short: "Efeitos",
    lessons: 4,
    text: "Os dois processadores de efeitos funcionando ao mesmo tempo: reverb, delay e chorus, com parâmetros ajustáveis.",
    photo: "/img/matrix/matrix26-1.png",
    focus: { x: 66, y: 40, zoom: 2.2 },
  },
  {
    title: "DCA e grupos de mute",
    short: "DCA",
    lessons: 4,
    text: "Oito DCAs e grupos de mute programáveis para controlar vários canais de uma vez, sem perder o balanço da mixagem.",
    photo: "/img/matrix/matrix26-1.png",
    focus: { x: 58, y: 74, zoom: 2 },
  },
  {
    title: "Wi-Fi e controle remoto",
    short: "Wi-Fi",
    lessons: 3,
    text: "Controle a mesa pelo navegador do celular, tablet ou computador, com até 8 dispositivos conectados ao mesmo tempo.",
    photo: "/img/matrix/matrix26-1.png",
    focus: { x: 78, y: 22, zoom: 2.4 },
  },
  {
    title: "Gravação, presets e ao vivo",
    short: "Ao vivo",
    lessons: 5,
    text: "Gravar pelo USB ou direto em um pendrive, salvar e exportar presets e montar o fluxo de uma operação ao vivo.",
    photo: "/img/matrix/matrix26-1.png",
    focus: { x: 72, y: 28, zoom: 2.6 },
  },
];

export const TOTAL_LESSONS = MODULES.reduce((sum, m) => sum + m.lessons, 0);

export type Model = {
  id: "matrix-20" | "matrix-26";
  name: string;
  photo: string;
  photoAlt: string;
  alt: string;
  url: string;
  text: string;
  specs: { value: string; label: string }[];
};

export const MODELS: Model[] = [
  {
    id: "matrix-20",
    name: "Matrix 20",
    photo: "/img/matrix/matrix20-1.png",
    photoAlt: "/img/matrix/matrix20-3.png",
    alt: "Mesa de som digital Waldman Matrix 20 vista de cima",
    url: "https://waldman-music.com/produto/matrix-20/",
    text: "Mesa digital com tela touchscreen de 9 polegadas e Wi-Fi integrado. Indicada para igrejas, eventos e estúdios.",
    specs: [
      { value: "20", label: "canais" },
      { value: "12", label: "entradas MIC" },
      { value: "6", label: "auxiliares" },
      { value: "8", label: "DCA" },
      { value: "9\"", label: "touchscreen" },
      { value: "USB", label: "e pendrive" },
    ],
  },
  {
    id: "matrix-26",
    name: "Matrix 26",
    photo: "/img/matrix/matrix26-1.png",
    photoAlt: "/img/matrix/matrix26-3.png",
    alt: "Mesa de som digital Waldman Matrix 26 vista de cima",
    url: "https://waldman-music.com/produto/matrix-26/",
    text: "Controle total para igrejas grandes, shows e eventos ao vivo, com faders motorizados e saída AES/EBU.",
    specs: [
      { value: "26", label: "canais" },
      { value: "16", label: "entradas MIC" },
      { value: "8", label: "auxiliares" },
      { value: "8", label: "DCA" },
      { value: "10\"", label: "touchscreen" },
      { value: "USB", label: "e pendrive" },
    ],
  },
];
export const STEPS = [
  {
    title: "Crie sua conta",
    text: "Nome completo, e-mail e telefone. Leva um minuto e não custa nada.",
  },
  {
    title: "Assista no seu ritmo",
    text: "Todos os módulos em vídeo, no celular ou no computador, quando você quiser.",
  },
  {
    title: "Continue de onde parou",
    text: "A Matrix Academy guarda o minuto e o segundo em que você parou em cada aula.",
  },
  {
    title: "Receba o certificado",
    text: "Ao concluir 100% dos episódios, o certificado sai com o seu nome e um código para qualquer pessoa conferir.",
  },
];

export const FAQ = [
  {
    q: "O curso é gratuito mesmo?",
    a: "Sim. Basta criar a conta com nome completo, e-mail e telefone para assistir a todos os módulos.",
  },
  {
    q: "Preciso ter uma Matrix para acompanhar?",
    a: "Não é obrigatório. As aulas mostram a operação na mesa, passo a passo, e quem tem uma Matrix pode repetir cada ajuste em seguida.",
  },
  {
    q: "O curso serve para a Matrix 20 e para a Matrix 26?",
    a: "Sim. As duas compartilham o mesmo sistema. Quando algo muda de uma para a outra, como o número de entradas ou de auxiliares, a aula avisa.",
  },
  {
    q: "O sistema lembra onde eu parei?",
    a: "Sim. Guardamos o minuto e o segundo de cada episódio, então você volta exatamente de onde saiu, em qualquer aparelho.",
  },
  {
    q: "Como recebo o certificado?",
    a: "Quando você concluir todos os episódios de todos os módulos, o botão de certificado aparece na área de membros.",
  },
  {
    q: "Posso assistir pelo celular?",
    a: "Pode. O site e o player funcionam em celular, tablet e computador.",
  },
];

export const WALDMAN_URL = "https://waldman-music.com";


// ---------------------------------------------------------------------------
// Aulas de exemplo para a vitrine "assista quando quiser".
// Títulos, durações e pontos de parada são fictícios; troque pelas aulas reais.
// ---------------------------------------------------------------------------
export type Episode = {
  id: string;
  /** índice do módulo em MODULES (define a foto e o recorte da miniatura) */
  module: number;
  title: string;
  text: string;
  /** duração em segundos */
  duration: number;
  /** até onde o aluno de exemplo assistiu, em segundos */
  watched: number;
};

export const EPISODES: Episode[] = [
  { id: "e1", module: 0, title: "Tela, faders e camadas", text: "Um passeio pela mesa: onde fica cada controle e como as camadas organizam os canais.", duration: 522, watched: 522 },
  { id: "e2", module: 0, title: "Matrix 20 e Matrix 26: as diferenças", text: "O que muda entre os dois modelos e o que é igual nos dois.", duration: 665, watched: 665 },
  { id: "e3", module: 1, title: "Entradas: microfone, linha e phantom", text: "Como ligar cada fonte, ajustar o ganho e quando usar o phantom power de +48 V.", duration: 860, watched: 534 },
  { id: "e4", module: 2, title: "EQ de 4 bandas na prática", text: "Frequência, ganho e Q: como limpar e dar corpo a cada canal sem exagerar.", duration: 936, watched: 0 },
  { id: "e5", module: 2, title: "Compressor e noise gate", text: "Controlar dinâmica e cortar ruído de fundo com os ajustes certos.", duration: 828, watched: 0 },
  { id: "e6", module: 3, title: "Auxiliares e monitoração", text: "Montar o retorno de cada músico com os auxiliares da Matrix.", duration: 962, watched: 0 },
  { id: "e7", module: 4, title: "Reverb e delay", text: "Usar os dois processadores de efeitos ao mesmo tempo, sem sujar a mix.", duration: 627, watched: 0 },
  { id: "e8", module: 6, title: "Controle pelo celular", text: "Conectar ao Wi-Fi da mesa e operar pelo navegador do celular ou tablet.", duration: 714, watched: 0 },
];

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
