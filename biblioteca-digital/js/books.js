// Lista de livros, dicionários, revistas e imagens
const books = [
  {
    id: 1,
    title: "Gramática do Kimbundo Moderno",
    author: "Prof. João Paulino",
    description: "Guia completo da gramática kimbundo com exercícios práticos.",
    category: "livros",
    price: 0,
    pages: 245,
    language: "Kimbundo/Português",
    cover: "gramatica",
    coverImage: "assets/images/capa.jpg",
    preview: true,
    file: "assets/pdfs/paulino.pdf",
    type: "livro"
  },
  {
    id: 2,
    title: "Dicionário Kimbundo-Português",
    author: "Academia de Línguas",
    description: "Dicionário completo com mais de 5.000 palavras e expressões.",
    category: "dicionarios",
    price: 0,
    pages: 420,
    language: "Kimbundo/Português",
    cover: "dicionario",
    coverImage: "assets/images/5G.png",
    preview: true,
    file: "assets/pdfs/Introdução 5G.pdf",
    type: "dicionario"
  },
{
    id: 3,
    title: "Revista Cultural Kimbundo",
    author: "Editora Kimbundo",
    description: "Edição mensal com artigos sobre cultura, história e atualidades.",
    category: "revistas",
    price: 0,
    pages: 50,
    language: "Português",
    cover: "revista",
    coverImage: "assets/images/polinomio.jpg", // Caminho da imagem da capa
    preview: true,
    file: "assets/pdfs/Math.pdf",
    type: "revista"
  },



  {
    id: 4,
    title: "Imagens Históricas do Ndongo",
    author: "Arquivo Nacional",
    description: "Coleção de imagens históricas do Reino do Ndongo.",
    category: "imagens",
    price: 0,
    pages: 0,
    language: "Visual",
    cover: "imagem",
    coverImage: "assets/images/revista-cultural.jpg", // Caminho da imagem da capa
    preview: true,
    file: "",
    type: "imagem"
  },
   {
    id: 4,
    title: "Revista Cultural Kimbundo",
    author: "Editora Kimbundo",
    description: "Edição mensal com artigos sobre cultura, história e atualidades.",
    category: "revistas",
    price: 0,
    pages: 50,
    language: "Português",
    cover: "revista",
    coverImage: "assets/images/revista-cultural.jpg", // Caminho da imagem da capa
    preview: true,
    file: "assets/pdfs/revista-cultural.pdf",
    type: "revista"
  },



  {
    id: 2,
    title: "Arduino_I2C",
    author: "Gotronics",
    description: "Guia prático sobre comunicação I2C com Arduino.",
    category: "livros",
    price: 0,
    pages: 420,
    language: "Francês",
    cover: "Electronique",
    coverImage: "assets/images/Arduino_I2C.jpg",
    preview: true,
    file: "assets/pdfs/Arduino_I2C.pdf",
    type: "livro"
  },

  {
    id: 3,
    title: "Química Geral I",
    author: "Ednilza Feitosa, Francisco Barbosa, Cristiane Forte",
    description: "Livro didático da UECE para o ensino de química geral.",
    category: "educacao",
    price: 0,
    pages: 380,
    language: "Português",
    cover: "quimica",
    coverImage: "assets/images/QuimicaGeral.png",
    preview: true,
    file: "assets/pdfs/Livro_Quimica Geral I.pdf",
    type: "livro"
  },
  {
    id: 4,
    title: "Estatística e Probabilidade",
    author: "IFCE / UAB / MEC",
    description: "Material acadêmico para licenciatura em matemática.",
    category: "educacao",
    price: 0,
    pages: 310,
    language: "Português",
    cover: "estatistica",
    coverImage: "assets/images/estatistica.png",
    preview: true,
    file: "assets/pdfs/estatistica_probabilidade.pdf",
    type: "livro"
  },
  {
    id: 5,
    title: "Superando o Cárcere da Emoção",
    author: "Augusto Cury",
    description: "Reflexões sobre saúde emocional e liberdade interior.",
    category: "autoajuda",
    price: 0,
    pages: 250,
    language: "Português",
    cover: "emocao",
    coverImage: "assets/images/emocao.png",
    preview: true,
    file: "assets/pdfs/superando_emocao.pdf",
    type: "livro"
  },
  {
    id: 6,
    title: "Quem Pensa Enriquece",
    author: "Napoleon Hill",
    description: "Clássico sobre mentalidade de sucesso e riqueza.",
    category: "autoajuda",
    price: 0,
    pages: 320,
    language: "Português",
    cover: "riqueza",
    coverImage: "assets/images/riqueza.png",
    preview: true,
    file: "assets/pdfs/quem_pensa_enriquece.pdf",
    type: "livro"
  }
];

