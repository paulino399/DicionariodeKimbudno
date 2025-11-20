// Elementos DOM
const booksGrid = document.getElementById('booksGrid');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const bookSearch = document.getElementById('bookSearch');
const readModal = document.getElementById('readModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartModalBody = document.getElementById('cartModalBody');
const cartTotal = document.getElementById('cartTotal');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutModalBody = document.getElementById('checkoutModalBody');

// Carrinho de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  displayBooks(books);
  setupEventListeners();
  updateCartUI();
});

// Função para exibir livros
function displayBooks(booksToShow) {
  booksGrid.innerHTML = booksToShow.length === 0
    ? `
      <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-book" style="font-size: 4rem; color: var(--text-light); opacity: 0.5;"></i>
        <h3>Nenhum item encontrado</h3>
        <p>Tente ajustar os filtros de pesquisa.</p>
      </div>
    `
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
            <button class="btn btn-secondary" onclick="addToCart(${book.id})">
              <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
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

// Função para ler/visualizar PDFs ou outros arquivos
async function handleRead(file, hasPreview, price, bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (price > 0 && !hasPreview) {
    alert('Este item não possui pré-visualização. Por favor, adquira a versão completa.');
    return;
  }

  if (!file.toLowerCase().endsWith('.pdf')) {
    modalTitle.textContent = `Visualizar: ${book.title}`;
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <i class="fas ${book.type === 'imagem' ? 'fa-image' : 'fa-file-archive'}" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
        <h3>${book.title}</h3>
        <p>Este é um arquivo ${file.split('.').pop().toUpperCase()} e não pode ser visualizado diretamente no navegador.</p>
        <div style="margin-top: 2rem;">
          <button class="btn btn-primary" onclick="handleDownload('${file}', '${book.title}')">
            <i class="fas fa-download"></i> Baixar Arquivo
          </button>
          <button class="btn" onclick="closeModal()" style="background: #6c757d; color: white;">
            Fechar
          </button>
        </div>
      </div>
    `;
    readModal.style.display = 'flex';
    return;
  }

  modalTitle.textContent = `Leitura: ${book.title}`;
  modalBody.innerHTML = `
    <div style="text-align: center; padding: 1rem;">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    </div>
    <div style="width: 100%; height: 500px; overflow: auto; border: 1px solid #ddd; margin: 1rem 0;">
      <canvas id="pdf-canvas" style="width: 100%;"></canvas>
    </div>
    <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center;">
      <button class="btn btn-primary" onclick="handleDownload('${file}', '${book.title}')">
        <i class="fas fa-download"></i> Baixar PDF
      </button>
      ${price > 0 ? `
        <button class="btn btn-secondary" onclick="addToCart(${book.id})">
          <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
        </button>
      ` : ''}
      <button class="btn" onclick="closeModal()" style="background: #6c757d; color: white;">
        Fechar
      </button>
    </div>
  `;

  try {
    const loadingTask = pdfjsLib.getDocument(file);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
  } catch (error) {
    modalBody.innerHTML += `<p style="color: red; text-align: center;">Erro ao carregar o PDF: ${error.message}</p>`;
    console.error("Erro ao carregar o PDF:", error);
  }

  readModal.style.display = 'flex';
}

// Função para adicionar ao carrinho
function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const existingItem = cart.find(item => item.id === bookId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  alert(`${book.title} foi adicionado ao carrinho!`);
}

// Função para remover do carrinho
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Função para atualizar a UI do carrinho
function updateCartUI() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    cartModalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
        <p>Seu carrinho está vazio.</p>
      </div>
    `;
    cartTotal.textContent = 'Total: R$ 0.00';
    return;
  }

  const cartItemsHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">
        <i class="fas ${item.cover === 'gramatica' ? 'fa-language' : item.cover === 'dicionario' ? 'fa-book' : 'fa-newspaper'}"></i>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-author">por ${item.author}</div>
        <div class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartModalBody.innerHTML = cartItemsHTML;
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para abrir o modal do carrinho
function openCartModal() {
  cartModal.style.display = 'flex';
}

// Função para fechar o modal do carrinho
function closeCartModal() {
  cartModal.style.display = 'none';
}

// Função para checkout
function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  checkoutModalBody.innerHTML = `
    <div class="checkout-form">
      <h3>Detalhes do Pagamento</h3>
      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input type="text" id="name" placeholder="Digite seu nome">
      </div>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input type="email" id="email" placeholder="Digite seu e-mail">
      </div>
      <div class="form-group">
        <label>Método de Pagamento</label>
        <div class="payment-methods">
          <div class="payment-method">
            <input type="radio" id="iban" name="payment" value="iban" checked>
            <label for="iban">Transferência via IBAN</label>
          </div>
          <div class="payment-method">
            <input type="radio" id="bai" name="payment" value="bai">
            <label for="bai">BAI Direto</label>
          </div>
          <div class="payment-method">
            <input type="radio" id="multicaixa" name="payment" value="multicaixa">
            <label for="multicaixa">Multicaixa Express</label>
          </div>
          <div class="payment-method">
            <input type="radio" id="paypal" name="payment" value="paypal">
            <label for="paypal">PayPal</label>
          </div>
        </div>
      </div>
      <div id="paymentDetails"></div>
      <div class="order-summary">
        <h4>Resumo do Pedido</h4>
        <p>Total: R$ ${total.toFixed(2)}</p>
      </div>
    </div>
  `;

  // Adicionar ouvinte para atualizar os detalhes de pagamento
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', updatePaymentDetails);
  });

  // Carregar os detalhes do primeiro método de pagamento selecionado
  updatePaymentDetails();

  checkoutModal.style.display = 'flex';
}

// Função para atualizar os detalhes de pagamento com base no método selecionado
function updatePaymentDetails() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const paymentDetailsDiv = document.getElementById('paymentDetails');

  let detailsHTML = '';

  switch (paymentMethod) {
    case 'iban':
      detailsHTML = `
        <div class="form-group">
          <label for="ibanNumber">Número IBAN</label>
          <input type="text" id="ibanNumber" placeholder="Ex: AO06 0001 0001 0000 0000 1234 5">
        </div>
        <div class="form-group">
          <label for="accountName">Nome do Titular da Conta</label>
          <input type="text" id="accountName" placeholder="Digite o nome do titular da conta">
        </div>
        <div class="form-group">
          <label for="bankName">Nome do Banco</label>
          <input type="text" id="bankName" placeholder="Digite o nome do banco">
        </div>
      `;
      break;

    case 'bai':
      detailsHTML = `
        <div class="form-group">
          <label for="baiPhone">Número de Telefone (BAI Direto)</label>
          <input type="text" id="baiPhone" placeholder="Ex: 923 123 456">
        </div>
        <div class="form-group">
          <label for="baiReference">Referência de Pagamento</label>
          <input type="text" id="baiReference" placeholder="Referência fornecida pelo BAI">
        </div>
      `;
      break;

    case 'multicaixa':
      detailsHTML = `
        <div class="form-group">
          <label for="multicaixaPhone">Número de Telefone (Multicaixa)</label>
          <input type="text" id="multicaixaPhone" placeholder="Ex: 923 123 456">
        </div>
        <div class="form-group">
          <label for="multicaixaReference">Referência Multicaixa</label>
          <input type="text" id="multicaixaReference" placeholder="Referência fornecida pela Multicaixa">
        </div>
      `;
      break;

    case 'paypal':
      detailsHTML = `
        <div class="form-group">
          <label for="paypalEmail">E-mail do PayPal</label>
          <input type="email" id="paypalEmail" placeholder="Digite o e-mail da sua conta PayPal">
        </div>
      `;
      break;
  }

  paymentDetailsDiv.innerHTML = detailsHTML;
}

// Função para confirmar a compra
function confirmPurchase() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  if (!name || !email) {
    alert('Por favor, preencha os campos obrigatórios: Nome e E-mail!');
    return;
  }

  // Validar campos específicos do método de pagamento
  let isValid = true;
  let missingFields = [];

  switch (paymentMethod) {
    case 'iban':
      if (!document.getElementById('ibanNumber').value) missingFields.push('Número IBAN');
      if (!document.getElementById('accountName').value) missingFields.push('Nome do Titular da Conta');
      if (!document.getElementById('bankName').value) missingFields.push('Nome do Banco');
      break;

    case 'bai':
      if (!document.getElementById('baiPhone').value) missingFields.push('Número de Telefone (BAI Direto)');
      if (!document.getElementById('baiReference').value) missingFields.push('Referência de Pagamento');
      break;

    case 'multicaixa':
      if (!document.getElementById('multicaixaPhone').value) missingFields.push('Número de Telefone (Multicaixa)');
      if (!document.getElementById('multicaixaReference').value) missingFields.push('Referência Multicaixa');
      break;

    case 'paypal':
      if (!document.getElementById('paypalEmail').value) missingFields.push('E-mail do PayPal');
      break;
  }

  if (missingFields.length > 0) {
    alert(`Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`);
    return;
  }

  // Coletar informações de pagamento
  let paymentDetails = {};
  switch (paymentMethod) {
    case 'iban':
      paymentDetails = {
        ibanNumber: document.getElementById('ibanNumber').value,
        accountName: document.getElementById('accountName').value,
        bankName: document.getElementById('bankName').value
      };
      break;

    case 'bai':
      paymentDetails = {
        phone: document.getElementById('baiPhone').value,
        reference: document.getElementById('baiReference').value
      };
      break;

    case 'multicaixa':
      paymentDetails = {
        phone: document.getElementById('multicaixaPhone').value,
        reference: document.getElementById('multicaixaReference').value
      };
      break;

    case 'paypal':
      paymentDetails = {
        email: document.getElementById('paypalEmail').value
      };
      break;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const purchase = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: [...cart],
    total: total,
    customer: { name, email },
    paymentMethod,
    paymentDetails,
    status: 'Pendente'
  };

  purchaseHistory.push(purchase);
  localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

  // Gerar instruções de pagamento com base no método escolhido
  let instructions = '';
  switch (paymentMethod) {
    case 'iban':
      instructions = `
        <strong>Instruções para Transferência via IBAN:</strong><br>
        1. Faça uma transferência para o IBAN: <strong>AO06 0001 0001 0000 0000 1234 5</strong><br>
        2. Use a referência: <strong>${purchase.id}</strong><br>
        3. Envie o comprovativo para <strong>contato@biblioteca-kimbundo.ao</strong><br>
        4. Após confirmação, os livros serão liberados para download.
      `;
      break;

    case 'bai':
      instructions = `
        <strong>Instruções para BAI Direto:</strong><br>
        1. Acesse o aplicativo BAI Direto.<br>
        2. Selecione a opção "Pagamentos".<br>
        3. Insira a referência: <strong>${purchase.id}</strong><br>
        4. Confirme o pagamento no valor de <strong>R$ ${total.toFixed(2)}</strong><br>
        5. Após confirmação, os livros serão liberados para download.
      `;
      break;

    case 'multicaixa':
      instructions = `
        <strong>Instruções para Multicaixa Express:</strong><br>
        1. Acesse um terminal Multicaixa Express.<br>
        2. Selecione a opção "Pagamentos".<br>
        3. Insira a referência: <strong>${purchase.id}</strong><br>
        4. Confirme o pagamento no valor de <strong>R$ ${total.toFixed(2)}</strong><br>
        5. Após confirmação, os livros serão liberados para download.
      `;
      break;

    case 'paypal':
      instructions = `
        <strong>Instruções para PayPal:</strong><br>
        1. Faça login na sua conta PayPal.<br>
        2. Envie o valor de <strong>R$ ${total.toFixed(2)}</strong> para o e-mail <strong>pagamentos@biblioteca-kimbundo.ao</strong><br>
        3. Use a referência: <strong>${purchase.id}</strong><br>
        4. Após confirmação, os livros serão liberados para download.
      `;
      break;
  }

  alert(`
    Compra registrada com sucesso!\n
    ID da Compra: ${purchase.id}\n
    Valor Total: R$ ${total.toFixed(2)}\n
    Método de Pagamento: ${getPaymentMethodName(paymentMethod)}\n\n
    ${instructions}
  `);

  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  closeCheckoutModal();
}

// Função auxiliar para obter o nome do método de pagamento
function getPaymentMethodName(method) {
  const names = {
    'iban': 'Transferência via IBAN',
    'bai': 'BAI Direto',
    'multicaixa': 'Multicaixa Express',
    'paypal': 'PayPal'
  };
  return names[method] || method;
}

// Função para baixar
function handleDownload(file, title) {
  const link = document.createElement('a');
  link.href = file;
  link.download = title.replace(/\s+/g, '-').toLowerCase() + (file.toLowerCase().endsWith('.pdf') ? '.pdf' : '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para fechar modal de leitura
function closeModal() {
  readModal.style.display = 'none';
}

// Função para fechar modal de carrinho
function closeCartModal() {
  cartModal.style.display = 'none';
}

// Função para fechar modal de checkout
function closeCheckoutModal() {
  checkoutModal.style.display = 'none';
}

// Configurar ouvintes de eventos
function setupEventListeners() {
  categoryFilter.addEventListener('change', filterBooks);
  priceFilter.addEventListener('change', filterBooks);
  bookSearch.addEventListener('input', filterBooks);
  cartButton.addEventListener('click', openCartModal);
}

// Fechar modais ao clicar fora
window.addEventListener('click', (event) => {
  if (event.target === readModal) closeModal();
  if (event.target === cartModal) closeCartModal();
  if (event.target === checkoutModal) closeCheckoutModal();
});

// Expor funções para o escopo global
window.handleRead = handleRead;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.handleDownload = handleDownload;
window.closeModal = closeModal;
window.closeCartModal = closeCartModal;
window.checkout = checkout;
window.closeCheckoutModal = closeCheckoutModal;
window.confirmPurchase = confirmPurchase;
window.updatePaymentDetails = updatePaymentDetails;
