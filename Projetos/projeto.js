function getProjetoIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarProjeto() {
  const container = document.getElementById("projeto-conteudo");
  const id = getProjetoIdFromURL();
  
  if (!container || !id) {
    container.innerHTML = "<p>Projeto não encontrado.</p>";
    return;
  }

  try {
    const res = await fetch("projetos.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const projeto = data.projects.find((p) => p.id === id);

    if (!projeto) {
      container.innerHTML = "<p>Projeto não encontrado.</p>";
      return;
    }

    document.title = projeto.titulo + " | Portfólio";

    container.innerHTML = `
      <h1>${projeto.titulo}</h1>
      <div class="projeto-meta">
        <span><strong>Tecnologias:</strong> ${projeto.tecnologias?.join(", ") || "N/A"}</span>
        <span><strong>Autores:</strong> ${projeto.autores?.join(", ") || "N/A"}</span>
      </div>

      <p>${projeto.descricaoCompleta || "Descrição não disponível."}</p>

      ${projeto.imagens?.length ? `
        <div class="galeria">
          ${projeto.imagens
            .map(
              (img) => `<img src="${img}" alt="${projeto.titulo} imagem">`
            )
            .join("")}
        </div>
      ` : ""}

      ${
        projeto.video
          ? `<div class="video-wrapper">
               <iframe src="${projeto.video}" frameborder="0" allowfullscreen></iframe>
             </div>`
          : ""
      }

      <div class="links-projeto">
        ${
          projeto.relatorio
            ? `<a class="btn-link" href="${projeto.relatorio}" target="_blank">Ver relatório</a>`
            : ""
        }
        ${
          projeto.links?.github
            ? `<a class="btn-link" href="${projeto.links.github}" target="_blank">GitHub</a>`
            : ""
        }
        ${
          projeto.links?.demo
            ? `<a class="btn-link" href="${projeto.links.demo}" target="_blank">Demo</a>`
            : ""
        }
      </div>

      <!-- Seção de avaliação -->
      <div class="rating-section">
        <h3>Avalie este projeto</h3>
        <div class="rating">
          ${Array.from({length: 5}, (_, i) => 
            `<span class="star" data-star="${i + 1}">★</span>`
          ).join('')}
        </div>
      </div>

      <!-- Seção de comentários -->
      <div class="comentarios-section">
        <h3>Comentários</h3>
        <form id="comentario-form">
          <input type="text" id="nome" placeholder="Seu nome" required>
          <textarea id="mensagem" placeholder="Seu comentário" required></textarea>
          <button type="submit">Enviar comentário</button>
        </form>
        <ul id="comentario-lista"></ul>
      </div>
    `;

    inicializarRating(id);
    inicializarComentarios(id);

  } catch (e) {
    console.error("Erro ao carregar projeto:", e);
    container.innerHTML = "<p>Erro ao carregar dados do projeto.</p>";
  }
}

function inicializarRating(projetoId) {
  const stars = document.querySelectorAll(".rating .star");
  const key = "rating_" + projetoId;
  const ratingSalvo = localStorage.getItem(key);

  function atualizarEstrelas(valor) {
    stars.forEach((s) => {
      const starVal = parseInt(s.dataset.star, 10);
      s.classList.toggle("active", starVal <= valor);
    });
  }

  if (ratingSalvo) {
    atualizarEstrelas(parseInt(ratingSalvo, 10));
  }

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const valor = parseInt(star.dataset.star, 10);
      localStorage.setItem(key, valor);
      atualizarEstrelas(valor);
    });
  });
}

function inicializarComentarios(projetoId) {
  const form = document.getElementById("comentario-form");
  const lista = document.getElementById("comentario-lista");
  const key = "comentarios_" + projetoId;

  if (!form || !lista) {
    console.warn("Elementos de comentários não encontrados");
    return;
  }

  function carregar() {
    const dados = JSON.parse(localStorage.getItem(key) || "[]");
    lista.innerHTML = "";
    
    if (dados.length === 0) {
      lista.innerHTML = "<li>Nenhum comentário ainda. Seja o primeiro a comentar!</li>";
      return;
    }

    dados.forEach((c) => {
      const li = document.createElement("li");
      const data = new Date(c.data).toLocaleDateString('pt-BR');
      li.innerHTML = `
        <strong>${c.nome}</strong> 
        <small>(${data})</small><br>
        ${c.mensagem}
      `;
      lista.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    
    if (!nome || !mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const dados = JSON.parse(localStorage.getItem(key) || "[]");
    dados.push({ 
      nome, 
      mensagem, 
      data: new Date().toISOString() 
    });
    localStorage.setItem(key, JSON.stringify(dados));

    form.reset();
    carregar();
  });

  carregar();
}

document.addEventListener("DOMContentLoaded", carregarProjeto);