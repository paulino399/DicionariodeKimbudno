// Lista de livros, dicionários, revistas e imagens
const books = [
  {
    id: 1,
    title: "Assim Nasce Um Poeta",
    author: "Graciano Ambriz Lord Fernandes",
    description: " Assim Nasce um Poeta não é apenas um título; é uma jornada.",
    category: "livros",
    price: 1500,
    pages: 40,
    language: "Português",
    cover: "Livros",
    coverImage: "assets/images/AssimNasceUmPoeta.png",
    preview: true,
    file: "assets/pdfs/AssiNasceUmGrandePoeta.pdf",
    type: "livro"
  },
  {
    id: 2,
    title: "Guia Completo sobre 5G",
    author: "QMC TELECOM",
    description: "Introdução abrangente à tecnologia 5G e suas aplicações.",
    category: "LIVROS",
    price: 750,
    pages: 36,
    language: "Português",
    cover: "livro",
    coverImage: "assets/images/5G.png",
    preview: true,
    file: "assets/pdfs/Introdução 5G.pdf",
    type: "livro"
  },
{
    id: 3,
    title: "Algebra Polinomial",
    author: "Cristiam Heurtas ",
    description: "Material acadêmico sobre álgebra polinomial para estudantes de matemática.",
    category: "livros",
    price:1000,
    pages: 50,
    language: "Português",
    cover: "livros",
    coverImage: "assets/images/polinomio.jpg", // Caminho da imagem da capa
    preview: true,
    file: "assets/pdfs/Math.pdf",
    type: "livros"
  },
{
    id: 4,
    title: "Anuaire Du ENSEM 2025",
    author: "ENSEM",
    description: "Une école d’ingénieurs du groupe INP au sein de l’Université de Lorraine",
    category: "imagens",
    price: 250,
    pages: 8,
    language: "Visual",
    cover: "imagem",
    coverImage: "assets/images/Ensem.jpg", // Caminho da imagem da capa
    preview: true,
    file: "assets/pdfs/paulino.pdf",
    type: "imagem"
  },
{
    id: 5,
    title: "Revista Cultural Kimbundo",
    author: "Editora Kimbundo",
    description: "Edição mensal com artigos sobre cultura, história e atualidades.",
    category: "revistas",
    price: 100,
    pages: 25,
    language: "Português",
    cover: "revista",
    coverImage: "assets/images/revisakimbundu.jpeg", // Caminho da imagem da capa
    preview: true,
    file: "assets/pdfs/Nzinga.pdf",
    type: "revista"
  },


  {
    id: 6,
    title: "Arduino_I2C",
    author: "Gotronics",
    description: "Guia prático sobre comunicação I2C com Arduino.",
    category: "livros",
    price: 0,
    pages: 8,
    language: "Francês",
    cover: "Electronique",
    coverImage: "assets/images/Arduino_I2C.jpg",
    preview: true,
    file: "assets/pdfs/Arduino_I2C.pdf",
    type: "livro"
  },



{
    id: 7,
    title: "Química Geral I",
    author: "Ednilza Feitosa, Francisco Barbosa, Cristiane Forte",
    description: "Livro didático da UECE para o ensino de química geral.",
    category: "educacao",
    price: 0,
    pages: 136,
    language: "Português",
    cover: "quimica",
    coverImage: "assets/images/QuimicaGeral.png",
    preview: true,
    file: "assets/pdfs/Livro_Quimica Geral I.pdf",
    type: "livro"
  },
  {
    id: 8,
    title: "Estatística e Probabilidade",
    author: "IFCE / UAB / MEC",
    description: "Material acadêmico para licenciatura em matemática.",
    category: "educacao",
    price: 0,
    pages: 310,
    language: "Português",
    cover: "estatistica",
    coverImage: "assets/images/EstatisticaEprobabi.png",
    preview: true,
    file: "assets/pdfs/EstatisticaeProbabilidade-livro.pdf",
    type: "livro"
  },
  {
    id: 9,
    title: "Superando o Cárcere da Emoção",
    author: "Augusto Cury",
    description: "Reflexões sobre saúde emocional e liberdade interior.",
    category: "autoajuda",
    price: 0,
    pages: 250,
    language: "Português",
    cover: "emocao",
    coverImage: "assets/images/OCacerdaEmocao.png",
    preview: true,
    file: "assets/pdfs/Superando o carcere da emocao - Augusto Curypdf.pdf",
    type: "livro"
  },
  {
  id: 10,
  title: "Quem Pensa Enriquece",
  author: "Napoleon Hill",
  description: "Clássico sobre mentalidade de sucesso e riqueza.",
  category: "autoajuda",
  price: 0,
  pages: 320,
  language: "Português",
  cover: "riqueza",
  coverImage: "assets/images/QuemPensaHirrequence.png",
  preview: true,
  file: "assets/pdfs/QUEM PENSA ENRIQUECE.pdf",
  type: "livro"
}
];

