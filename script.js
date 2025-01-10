document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // 1) SELECT ELEMENTS
  // =====================
  const milestones = document.querySelectorAll(".milestone");
  const balls = document.querySelectorAll(".ball");
  const introSection = document.querySelector(".intro-content");
  const ballColumn = document.querySelector(".ball-column");


  if (balls.length > 0) {
    balls[0].classList.add("active");
  }

  // =====================
  // 2) ACTIVE STATES ON PAGE LOAD
  //    (if you want the first milestone & ball active by default)
  // =====================
  if (milestones.length > 0) {
    milestones[0].classList.add("active");
  }
  if (balls.length > 0) {
    balls[0].classList.add("active");
  }

  // =====================
  // 3) INTERSECTION OBSERVER FOR MILESTONES
  // =====================
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = [...milestones].indexOf(entry.target);
  
      if (entry.isIntersecting) {
        // Mark this milestone as active
        entry.target.classList.add("active");
  
        // Update balls
        balls.forEach((ball, i) => {
          ball.classList.toggle("active", i === index);
        });
      } else {
        // Skip deactivating the first ball when at the top
        if (index === 0 && window.scrollY === 0) {
          return;
        }
  
        // Deactivate milestone and ball if not intersecting
        entry.target.classList.remove("active");
        if (index < balls.length) {
          balls[index].classList.remove("active");
        }
      }
    });
  }, observerOptions);

  // Observe each milestone
  milestones.forEach((milestone) => observer.observe(milestone));

  // =====================
  // 4) CAROUSEL CODE
  //    (Adjust as needed for each carousel)
  // =====================
  let currentIndex1 = 0;
  let currentIndex2 = 0;

  window.moveSlide = function moveSlide(step, carouselId) {
    const carousel = document.querySelector(`#${carouselId} .carousel`);
    const images = carousel.querySelectorAll(".carousel-image");
    const totalImages = images.length;

    // Determine current index for the correct carousel
    let currentIndex = (carouselId === "carousel1") ? currentIndex1 : currentIndex2;

    // Update index
    currentIndex = (currentIndex + step + totalImages) % totalImages;

    // Move the carousel by 100% increments
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;

    // Store updated index
    if (carouselId === "carousel1") currentIndex1 = currentIndex;
    else currentIndex2 = currentIndex;
  };

  // =====================
  // 5) POSITION THE BALL COLUMN
  //    (Below the intro, until scrolled past, then center viewport)
  // =====================
  function positionBallColumn() {
    const scrollPos = window.scrollY;      // Current scroll distance
    const introHeight = introSection.offsetHeight; 
    const marginTop = 50;                  // Extra space below intro

    if (scrollPos < introHeight) {
      // Below the intro
      ballColumn.style.top = `${introHeight + marginTop}px`;
      ballColumn.style.transform = "translateY(0)";
    } else {
      // Once scrolled past the intro, center it
      ballColumn.style.top = "50%";
      ballColumn.style.transform = "translateY(-50%)";
    }
  }

  window.addEventListener("scroll", positionBallColumn);
  window.addEventListener("resize", positionBallColumn);
  positionBallColumn(); // Run once on load
});
