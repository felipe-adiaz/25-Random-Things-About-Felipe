document.addEventListener("DOMContentLoaded", () => {
  const milestones = document.querySelectorAll(".milestone, .Vmilestone");  // Select all milestones
  const balls = document.querySelectorAll(".ball");  // Select all balls

  // Set up the Intersection Observer options for other milestones
  const options = {
    root: null,  // Use the viewport as the root
    rootMargin: '0px 0px -20% 0px',  // Trigger the activation earlier (before 20% of the element enters the viewport)
    threshold: 0.5  // Trigger when 50% of the element is visible
  };

  // Create the Intersection Observer instance to track the visibility of milestones
  const observer = new IntersectionObserver((entries) => {
    let activeMilestone = null;

    // Loop through the entries to track the active milestone
    entries.forEach((entry) => {
      const marker = entry.target.querySelector('.marker');

      if (entry.isIntersecting) {
        // If a milestone is in view, make it active
        entry.target.classList.add('active');
        if (marker) {
          marker.style.opacity = "1";  // Make the marker visible
        }
        activeMilestone = entry.target; // Track the active milestone
      } else {
        // If the milestone is not in view, deactivate it
        entry.target.classList.remove('active');
        if (marker) {
          marker.style.opacity = "0.3";  // Make the marker less visible
        }
      }
    });

    // Ensure there's always one active milestone
    if (activeMilestone) {
      // Deactivate all milestones except the one currently active
      milestones.forEach((milestone) => {
        if (milestone !== activeMilestone) {
          milestone.classList.remove('active');
          const marker = milestone.querySelector('.marker');
          if (marker) {
            marker.style.opacity = "0.3";  // Ensure the marker is less visible for inactive milestones
          }
        }
      });
    }
  }, options);

  // Observe each milestone element
  milestones.forEach(milestone => observer.observe(milestone));

  // Manually activate the first milestone when the page loads
  if (milestones.length > 0) {
    const firstMilestone = milestones[0];

    // Immediately add the 'active' class to the first milestone and show its marker
    firstMilestone.classList.add('active', 'first-active');
    const firstMarker = firstMilestone.querySelector('.marker');
    if (firstMarker) {
      firstMarker.style.opacity = "1";  // Ensure the first marker is visible
    }

    // Ensure that the first milestone stays active when scrolling up (page at top)
    window.addEventListener('scroll', () => {
      if (window.scrollY === 0) {
        firstMilestone.classList.add('active', 'first-active');
        const firstMarker = firstMilestone.querySelector('.marker');
        if (firstMarker) {
          firstMarker.style.opacity = "1";  // Ensure it's visible at the top
        }
      }
    });
  }
});

// Additional code to activate the first milestone with the 'first-active' class for the faster transition on page load
window.addEventListener("load", () => {
  const milestones = document.querySelectorAll(".milestone, .Vmilestone");

  if (milestones.length > 0) {
    const firstMilestone = milestones[0];

    // Add the 'first-active' class for the faster transition on the first milestone
    firstMilestone.classList.add('active', 'first-active');

    const firstMarker = firstMilestone.querySelector('.marker');
    if (firstMarker) {
      firstMarker.style.opacity = "1";  // Ensure the first marker is visible
    }
  }
});

// Initialize index for each carousel
let currentIndex1 = 0; // For the first carousel (carousel1)
let currentIndex2 = 0; // For the second carousel (carousel2)
let currentIndex3 = 0; // For the third carousel (carousel3)

// Function to move the carousel
function moveSlide(step, carouselId) {
  // Select the carousel based on the provided carouselId
  const carousel = document.querySelector(`#${carouselId} .carousel`);
  const images = carousel.querySelectorAll(".carousel-image");
  const totalImages = images.length;

  let currentIndex = carouselId === "carousel1" ? currentIndex1 :
                     carouselId === "carousel2" ? currentIndex2 :
                     currentIndex3; // Determine the correct carousel index

  // Update the currentIndex within bounds
  currentIndex = (currentIndex + step + totalImages) % totalImages;

  // Move the carousel to the new position
  const offset = -currentIndex * 100; // Shift by 100% of the image width
  carousel.style.transform = `translateX(${offset}%)`;

  // Update the index for the correct carousel
  if (carouselId === "carousel1") {
    currentIndex1 = currentIndex;
  } else if (carouselId === "carousel2") {
    currentIndex2 = currentIndex;
  } else {
    currentIndex3 = currentIndex;
  }
}

window.addEventListener('load', () => {
  const introContent = document.querySelector('.intro-content');
  const ballColumn = document.querySelector('.ball-column');

  // Função para ajustar a posição inicial da coluna de bolas
  function setBallColumnPosition() {
    const introHeight = introContent.offsetHeight;  // Altura da introdução
    const marginTop = 50;  // Distância mínima da introdução (em pixels)

    // A coluna de bolas começa logo após a introdução + uma margem mínima
    ballColumn.style.top = `${introHeight + marginTop}px`;  // Atualiza a posição inicial da coluna de bolas
  }

  // Função para centralizar a coluna de bolas quando a introdução sair da tela
  function centerBallColumn() {
    const scrollPosition = window.scrollY;  // Posição do scroll
    const introHeight = introContent.offsetHeight;  // Altura da introdução

    if (scrollPosition >= introHeight) {
      // Quando a introdução sair da tela, centraliza a coluna de bolas
      ballColumn.style.top = '50%';  // Centraliza a coluna de bolas na tela
      ballColumn.style.transform = 'translateY(-50%)';  // Centraliza verticalmente
    } else {
      // Quando a introdução voltar à tela, coloca a coluna de bolas logo abaixo da introdução
      ballColumn.style.top = `${introHeight + 50}px`;  // Coloca a coluna de bolas abaixo da introdução, com a margem
      ballColumn.style.transform = 'translateY(0)';  // Remove qualquer transformação
    }
  }

  // Chama as funções para ajustar a posição inicial
  setBallColumnPosition();
  centerBallColumn();

  // Atualiza a posição quando a página é rolada ou redimensionada
  window.addEventListener('resize', () => {
    setBallColumnPosition();
    centerBallColumn();
  });

  window.addEventListener('scroll', () => {
    centerBallColumn();  // A função que já ajusta a posição das bolas
    updateActiveBall(window.scrollY);  // Atualiza a bola ativa com base na posição do scroll
  });
});

// Função para atualizar a bola ativa com base no scroll
function updateActiveBall(scrollPosition) {
  const milestones = document.querySelectorAll('.milestone, .Vmilestone');  // Total de milestones
  const balls = document.querySelectorAll('.ball');  // Seleciona todas as bolas
  const totalMilestones = milestones.length;  // Total de milestones
  const pageHeight = document.body.scrollHeight - window.innerHeight;  // Altura da página sem considerar a altura da janela

  // Calcular o índice do milestone ativo com base na rolagem e no total de milestones
  const activeMilestoneIndex = Math.floor((scrollPosition / pageHeight) * totalMilestones);

  // Atualiza a classe 'active' nas bolas correspondentes ao índice calculado
  balls.forEach((ball, index) => {
    if (index === activeMilestoneIndex) {
      ball.classList.add('active');  // Adiciona a classe 'active' à bola correspondente
    } else {
      ball.classList.remove('active');  // Remove a classe 'active' das outras bolas
    }
  });
}
