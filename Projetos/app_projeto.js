async function carregarProjetos() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  try {
    const res = await fetch("projetos.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    data.projects.forEach((p) => {
      const card = document.createElement("article");
      card.className = "project-card";

      card.innerHTML = `
        <div class="project-thumb">
          <img src="${p.thumb}" alt="${p.titulo}">
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.titulo}</h3>
          <p class="project-resumo">${p.resumo}</p>
          <div class="project-meta">
            <span class="badge">${p.categorias?.[0] || "Projeto"}</span>
            <span class="rating-text">★ ${p.avaliacaoMedia?.toFixed(1) || "N/A"}</span>
          </div>
        </div>
        <div class="project-footer">
          <button class="btn-link" data-id="${p.id}">
            Ver detalhes →
          </button>
        </div>
      `;

      card.querySelector(".btn-link").addEventListener("click", () => {
        window.location.href = `projeto.html?id=${encodeURIComponent(p.id)}`;
      });

      grid.appendChild(card);
    });

  } catch (e) {
    console.error("Erro ao carregar projetos:", e);
    grid.innerHTML = "<p>Erro ao carregar projetos.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarProjetos);