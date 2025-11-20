// Elementos DOM
const booksGrid = document.getElementById('booksGrid');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const bookSearch = document.getElementById('bookSearch');
const readModal = document.getElementById('readModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  displayBooks(books);
  setupEventListeners();
});

// Função para exibir livros
function displayBooks(booksToShow) {
  booksGrid.innerHTML = booksToShow.length === 0
    ? `<div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-book" style="font-size: 4rem; color: var(--text-light); opacity: 0.5;"></i>
        <h3>Nenhum item encontrado</h3>
        <p>Tente ajustar os filtros de pesquisa.</p>
      </div>`
    : booksToShow.map(book => createBookCard(book)).join('');
}

// Função para criar cartão de livro
function createBookCard(book) {
  const coverIcons = {
    'gramatica': 'fas fa-language',
    'dicionario': 'fas fa-book',
    'revista': 'fas fa-newspaper',
    'imagem': 'fas fa-image'
  };
  return `
    <div class="book-card">
      <div class="book-cover">
        <i class="${coverIcons[book.cover] || 'fas fa-book'}"></i>
        ${book.price === 0 ? '<div class="book-badge">Gratuito</div>' : ''}
      </div>
      <div class="book-content">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">por ${book.author}</p>
        <p class="book-description">${book.description}</p>
        <div class="book-meta">
          <span>${book.pages > 0 ? `${book.pages} páginas` : 'Conteúdo visual'}</span>
          <span>${book.language}</span>
        </div>
        <div class="book-price">
          ${book.price === 0 ? 'Gratuito' : `R$ ${book.price.toFixed(2)}`}
        </div>
        <div class="book-actions">
          <button class="btn btn-primary" onclick="handleRead('${book.file}', ${book.preview}, ${book.price}, ${book.id})">
            <i class="fas fa-eye"></i> ${book.type === 'imagem' ? 'Visualizar' : 'Ler'}
          </button>
          ${book.price > 0 ? `
            <button class="btn btn-secondary" onclick="handlePurchase(${book.id})">
              <i class="fas fa-shopping-cart"></i> Comprar
            </button>
          ` : `
            <button class="btn btn-secondary" onclick="handleDownload('${book.file}', '${book.title}')">
              <i class="fas fa-download"></i> Baixar
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Função para filtrar livros
function filterBooks() {
  const category = categoryFilter.value;
  const price = priceFilter.value;
  const searchTerm = bookSearch.value.toLowerCase();
  const filteredBooks = books.filter(book => {
    const matchesCategory = category === 'all' || book.category === category;
    const matchesPrice = price === 'all' ||
                       (price === 'free' && book.price === 0) ||
                       (price === 'paid' && book.price > 0);
    const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                        book.author.toLowerCase().includes(searchTerm) ||
                        book.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesPrice && matchesSearch;
  });
  displayBooks(filteredBooks);
}

// Função para ler/visualizar
function handleRead(file, hasPreview, price, bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (price > 0 && !hasPreview) {
    alert('Este item não possui pré-visualização. Por favor, adquira a versão completa.');
    return;
  }

  modalTitle.textContent = book.type === 'imagem' ? 'Visualizar Imagem' : 'Leitura';
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <i class="fas ${book.type === 'imagem' ? 'fa-image' : 'fa-book-reader'}" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
      <h3>${book.title}</h3>
      <p>${price > 0 ? 'Pré-visualização disponível' : 'Conteúdo gratuito'}</p>
      <div style="margin: 2rem 0;">
        ${book.type === 'imagem' ? `<img src="${file}" alt="${book.title}" style="max-width: 100%; border-radius: 8px;">` : ''}
      </div>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="handleDownload('${file}', '${book.title}')">
          <i class="fas fa-download"></i> Baixar
        </button>
        ${price > 0 ? `
          <button class="btn btn-secondary" onclick="handlePurchase(${bookId})">
            <i class="fas fa-shopping-cart"></i> Comprar Completo
          </button>
        ` : ''}
        <button class="btn" onclick="closeModal()" style="background: #6c757d; color: white;">
          Fechar
        </button>
      </div>
    </div>
  `;
  readModal.style.display = 'flex';
}

// Função para comprar
function handlePurchase(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    const confirmPurchase = confirm(`Deseja comprar "${book.title}" por R$ ${book.price.toFixed(2)}?`);
    if (confirmPurchase) {
      alert(`Compra realizada com sucesso!\nItem: ${book.title}\nValor: R$ ${book.price.toFixed(2)}`);
    }
  }
}

// Função para baixar
function handleDownload(file, title) {
  alert(`Download iniciado: ${title}\nArquivo: ${file}`);
  // Em produção, substituir por um link real para download
}

// Função para fechar modal
function closeModal() {
  readModal.style.display = 'none';
}

// Configurar ouvintes de eventos
function setupEventListeners() {
  categoryFilter.addEventListener('change', filterBooks);
  priceFilter.addEventListener('change', filterBooks);
  bookSearch.addEventListener('input', filterBooks);
}

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
  if (event.target === readModal) {
    closeModal();
  }
});

// Expor funções para o escopo global
window.handleRead = handleRead;
window.handlePurchase = handlePurchase;
window.handleDownload = handleDownload;
window.closeModal = closeModal;
