// Variável global para armazenar os projetos
let projectsData = [];

// Carregar dados dos projetos do arquivo JSON
async function loadProjects() {
    try {
        const response = await fetch('js/projects.json');
        const data = await response.json();
        projectsData = data.projects;
        renderProjects();
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        // Fallback: usar dados estáticos se o arquivo não carregar
        projectsData = [
            {
                id: 1,
                title: "Sistema de Gestão Empresarial",
                shortDescription: "Plataforma completa para gestão de processos empresariais.",
                fullDescription: "Este sistema foi desenvolvido para otimizar processos internos de empresas, integrando setores como RH, financeiro e operações. A solução oferece dashboards interativos, relatórios automatizados e controle de fluxo de trabalho.",
                images: [
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
                    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                ],
                video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                authors: [
                    { name: "João Silva", role: "Desenvolvedor Full Stack", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    { name: "Maria Santos", role: "Designer UX/UI", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }
                ],
                technologies: ["React", "Node.js", "MongoDB", "Express"],
                status: "Concluído",
                date: "2023-05-15",
                rating: 4.5,
                reviews: [
                    { author: "Carlos Oliveira", rating: 5, comment: "Sistema incrível! Facilitou muito nosso trabalho.", date: "2023-06-10" },
                    { author: "Ana Costa", rating: 4, comment: "Muito útil, mas gostaria de ver mais funcionalidades no futuro.", date: "2023-06-05" }
                ]
            }
        ];
        renderProjects();
    }
}

// Função para renderizar os projetos na página
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-img">
                <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="project-meta">
                    <span class="project-rating">
                        ${renderStars(project.rating)}
                        <span>${project.rating}</span>
                    </span>
                    <button class="btn btn-secondary view-project" data-id="${project.id}">Ver Detalhes</button>
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });

    // Adicionar event listeners aos botões
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = parseInt(this.getAttribute('data-id'));
            openProjectModal(projectId);
        });
    });
}

// Função para renderizar estrelas de avaliação
function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Função para abrir o modal com detalhes do projeto
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.querySelector('.modal-body');
    
    modalTitle.textContent = project.title;
    
    // Construir o conteúdo do modal
    modalBody.innerHTML = `
        <div class="project-details">
            <div>
                <h3>Descrição Completa</h3>
                <p>${project.fullDescription}</p>
                
                <h3>Tecnologias Utilizadas</h3>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <h3>Status</h3>
                <p>${project.status}</p>
                
                <h3>Data de Conclusão</h3>
                <p>${new Date(project.date).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
                <h3>Vídeo do Projeto</h3>
                <div class="video-container">
                    <iframe width="100%" height="250" src="${project.video}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        
        <h3>Galeria de Imagens</h3>
        <div class="project-gallery">
            ${project.images.map(img => `<img src="${img}" alt="${project.title}" loading="lazy">`).join('')}
        </div>  <h3>Galeria de Imagens</h3>
    <div class="project-gallery">
        ${project.images.map(img => `
            <img src="${img}" alt="${project.title}" loading="lazy" class="project-gallery-img">
        `).join('')}
    </div>
        
        <div class="project-authors">
            <h3>Autores do Projeto</h3>
            <div class="authors-list">
                ${project.authors.map(author => `
                    <div class="author">
                        <div class="author-avatar">
                            <img src="${author.avatar}" alt="${author.name}" loading="lazy">
                        </div>
                        <div>
                            <h4>${author.name}</h4>
                            <p>${author.role}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="reviews-section">
            <h3>Avaliações e Comentários</h3>
            
            <div class="review-form">
                <h4>Deixe sua avaliação</h4>
                <form id="review-form">
                    <div class="form-group">
                        <label for="review-author">Seu nome</label>
                        <input type="text" id="review-author" required>
                    </div>
                    <div class="form-group">
                        <label for="review-comment">Seu comentário</label>
                        <textarea id="review-comment" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Avaliação</label>
                        <div class="rating-input" id="rating-input">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                        </div>
                        <input type="hidden" id="review-rating" value="0">
                    </div>
                    <button type="submit" class="btn">Enviar Avaliação</button>
                </form>
            </div>
            
            <div class="reviews-list">
                <h4>Avaliações dos Usuários</h4>
                ${project.reviews.map(review => `
                    <div class="review">
                        <div class="review-header">
                            <span class="review-author">${review.author}</span>
                            <span class="review-rating">${renderStars(review.rating)}</span>
                        </div>
                        <p class="review-comment">${review.comment}</p>
                        <div class="review-date">${new Date(review.date).toLocaleDateString('pt-BR')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    setTimeout(() => {
    updateProjectGalleryInModal();
}, 100);

    // Adicionar funcionalidade às estrelas de avaliação
    const ratingStars = document.querySelectorAll('#rating-input i');
    let selectedRating = 0;
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('review-rating').value = selectedRating;
            highlightStars(selectedRating);
        });
    });
    
    function highlightStars(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }
    
    // Adicionar funcionalidade ao formulário de avaliação
    document.getElementById('review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const author = document.getElementById('review-author').value;
        const comment = document.getElementById('review-comment').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        
        if (rating === 0) {
            alert('Por favor, selecione uma avaliação com estrelas.');
            return;
        }
        
        // Em um cenário real, enviaríamos os dados para um servidor
        // Aqui apenas simulamos a adição da avaliação
        const newReview = {
            author: author,
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Adicionar a nova avaliação à lista
        const reviewsList = document.querySelector('.reviews-list');
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="review-author">${newReview.author}</span>
                <span class="review-rating">${renderStars(newReview.rating)}</span>
            </div>
            <p class="review-comment">${newReview.comment}</p>
            <div class="review-date">${new Date(newReview.date).toLocaleDateString('pt-BR')}</div>
        `;
        
        // Inserir antes do título "Avaliações dos Usuários"
        const reviewsTitle = reviewsList.querySelector('h4');
        reviewsList.insertBefore(reviewElement, reviewsTitle.nextSibling);
        
        // Limpar o formulário
        document.getElementById('review-form').reset();
        selectedRating = 0;
        highlightStars(0);
        
        alert('Avaliação enviada com sucesso!');
    });
    
    // Mostrar o modal
    modal.style.display = 'block';
}

// Fechar o modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('project-modal').style.display = 'none';
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', function(e) {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Menu mobile
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
});

// Navegação suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Fechar menu mobile se estiver aberto
            document.querySelector('nav ul').classList.remove('show');
        }
    });
});



// Sistema de Lightbox para imagens
let currentImageIndex = 0;
let currentImages = [];

function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');

    // Abrir lightbox
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('project-gallery-img')) {
            const gallery = e.target.closest('.project-gallery');
            currentImages = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
            currentImageIndex = currentImages.indexOf(e.target.src);
            
            openLightbox(currentImages, currentImageIndex);
        }
    });

    // Fechar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navegação
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

function openLightbox(images, startIndex) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    currentImages = images;
    currentImageIndex = startIndex;
    
    lightboxImage.src = currentImages[currentImageIndex];
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    lightbox.classList.add('active');
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    lightboxImage.src = currentImages[currentImageIndex];
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    
    // Efeito de fade
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
        lightboxImage.style.opacity = '1';
    }, 150);
}

// Modificar a função que cria a galeria no modal
function updateProjectGalleryInModal() {
    // Esta função será chamada quando o modal do projeto for aberto
    const galleryImages = document.querySelectorAll('.project-gallery img');
    galleryImages.forEach(img => {
        img.classList.add('project-gallery-img');
    });
}


// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initLightbox();
});