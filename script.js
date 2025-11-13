// Variáveis globais
let dicionario = [];
let carregamentoConcluido = false;

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const resultsContainer = document.getElementById('results');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const wordCountElement = document.getElementById('wordCount');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    mostrarLoading(true);
    
    // Carregar o dicionário
    dicionario = await carregarDicionario();
    
    // Atualizar contagem de palavras
    wordCountElement.textContent = dicionario.length;
    
    // Não mostrar palavras inicialmente
    resultsContainer.style.display = 'none';
    noResultsElement.style.display = 'none';
    
    // Iniciar efeitos visuais e busca
    iniciarEfeitos();
    
    carregamentoConcluido = true;
    
  } catch (error) {
    console.error('Erro ao carregar o dicionário:', error);
    mostrarErro('Erro ao carregar o dicionário. Tente recarregar a página.');
  } finally {
    mostrarLoading(false);
  }
}

async function carregarDicionario() {
  const resposta = await fetch('dados.json');
  if (!resposta.ok) {
    throw new Error('Erro ao carregar arquivo de dados');
  }
  const dados = await resposta.json();
  return dados;
}

function buscarPalavra() {
  if (!carregamentoConcluido) return;
  
  const termo = searchInput.value.toLowerCase().trim();
  
  // Mostrar/ocultar botão de limpar
  toggleClearButton(termo.length > 0);

  // Se o campo estiver vazio, não mostrar nada
  if (termo === '') {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    noResultsElement.style.display = 'none';
    return;
  }

  // Filtrar palavras
  const encontrados = dicionario.filter(item =>
    item.palavra.toLowerCase().includes(termo) ||
    item.traducao.toLowerCase().includes(termo) ||
    (item.classe && item.classe.toLowerCase().includes(termo)) ||
    (item.exemplo && item.exemplo.toLowerCase().includes(termo))
  );
  
  displayWords(encontrados);
}

function displayWords(palavras) {
  resultsContainer.innerHTML = '';
  
  if (palavras.length === 0) {
    noResultsElement.style.display = 'block';
    resultsContainer.style.display = 'none';
    return;
  }
  
  noResultsElement.style.display = 'none';
  resultsContainer.style.display = 'grid';
  
  palavras.forEach((item, index) => {
    const card = criarCardPalavra(item, index);
    resultsContainer.appendChild(card);
  });
}

function criarCardPalavra(item, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  const icon = getIconByClass(item.classe);
  
  const imagemHTML = item.imagem ? 
    `<img src="img/${item.imagem}" alt="${item.palavra}" 
          onerror="this.style.display='none'; 
                   this.nextElementSibling.style.display='flex'">
     <div class="fallback-icon" style="display: none;">
       <i class="${icon}"></i>
     </div>` :
    `<div class="fallback-icon">
       <i class="${icon}"></i>
     </div>`;
  
  card.innerHTML = `
    <div class="card-image">
      ${imagemHTML}
    </div>
    <div class="card-content">
      <div class="card-header">
        <div class="word-info">
          <div class="word">
            ${item.palavra}
            ${item.classe ? `<span class="class-badge">${item.classe}</span>` : ''}
          </div>
          <div class="translation">${item.traducao}</div>
        </div>
        <button class="sound-btn" onclick="tocarSom('${item.audio}')" ${!item.audio ? 'disabled' : ''} title="Ouvir pronúncia">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
      ${item.exemplo ? `
        <div class="example">
          <div class="example-text">${item.exemplo}</div>
          <div class="example-translation">${item.traducao_exemplo}</div>
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

function getIconByClass(wordClass) {
  if (!wordClass) return 'fas fa-book';
  
  const icons = {
    'substantivo': 'fas fa-user',
    'verbo': 'fas fa-running',
    'adjetivo': 'fas fa-palette',
    'cor': 'fas fa-palette',
    'casa': 'fas fa-home',
    'animal': 'fas fa-paw',
    'natureza': 'fas fa-leaf',
    'comida': 'fas fa-utensils',
    'família': 'fas fa-users',
    'corpo': 'fas fa-user-md',
    'número': 'fas fa-sort-numeric-up',
    'saudaçao': 'fas fa-handshake',
    'default': 'fas fa-book'
  };
  
  const classeLower = wordClass.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (classeLower.includes(key)) {
      return icon;
    }
  }
  
  return icons.default;
}

function tocarSom(arquivo) {
  if (!arquivo) return;
  
  try {
    const audio = new Audio(`audio/${arquivo}`);
    audio.play().catch(error => {
      console.warn('Erro ao reproduzir áudio:', error);
      mostrarFeedbackAudio();
    });
    
    mostrarFeedbackAudio();
  } catch (error) {
    console.error('Erro no player de áudio:', error);
    mostrarFeedbackAudio();
  }
}

function mostrarFeedbackAudio() {
  const buttons = document.querySelectorAll('.sound-btn');
  buttons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-volume-up')) {
      btn.style.backgroundColor = 'var(--accent-color)';
      setTimeout(() => {
        btn.style.backgroundColor = '';
      }, 300);
    }
  });
}

function toggleClearButton(show) {
  if (show) {
    clearSearch.classList.add('show');
  } else {
    clearSearch.classList.remove('show');
  }
}

function clearSearchInput() {
  searchInput.value = '';
  toggleClearButton(false);
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'none';
  noResultsElement.style.display = 'none';
  searchInput.focus();
}

function mostrarLoading(mostrar) {
  if (mostrar) {
    loadingElement.style.display = 'block';
    resultsContainer.style.display = 'none';
    noResultsElement.style.display = 'none';
  } else {
    loadingElement.style.display = 'none';
  }
}

function mostrarErro(mensagem) {
  resultsContainer.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Erro</h3>
      <p>${mensagem}</p>
      <button onclick="location.reload()" class="retry-btn">Tentar Novamente</button>
    </div>
  `;
}

function iniciarEfeitos() {
  iniciarEfeitoDigitacao();
  
  searchInput.addEventListener('input', debounce(buscarPalavra, 300));
  clearSearch.addEventListener('click', clearSearchInput);
  
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      clearSearchInput();
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function iniciarEfeitoDigitacao() {
  const placeholders = [
    "Digite uma palavra em Kimbundo ou Português...",
    "Exemplo: mbwa, pessoa, dançar...",
    "Pesquise por substantivos, verbos, adjetivos...",
    "Encontre palavras do quotidiano angolano..."
  ];

  let currentPlaceholder = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typePlaceholder() {
    const currentText = placeholders[currentPlaceholder];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    
    searchInput.placeholder = currentText.substring(0, charIndex);
    
    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typePlaceholder, speed);
  }

  setTimeout(typePlaceholder, 1500);
}
