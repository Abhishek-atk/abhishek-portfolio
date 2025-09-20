// Toggle menu for mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Counter animation
const counters = document.querySelectorAll(".counter");
const speed = 200;

const animateCounters = () => {
  counters.forEach((counter) => {
    const value = +counter.getAttribute("data-target");
    const updateCount = () => {
      const current = +counter.innerText;
      const increment = Math.ceil(value / speed);

      if (current < value) {
        counter.innerText = current + increment;
        setTimeout(updateCount, 40);
      } else {
        counter.innerText = value;
      }
    };
    updateCount();
  });
};

// Trigger only when section is in view
const aboutSection = document.querySelector("#about");
let started = false;

window.addEventListener("scroll", () => {
  const rect = aboutSection.getBoundingClientRect();
  if (!started && rect.top < window.innerHeight) {
    animateCounters();
    started = true;
  }
});

// Skills infinite scroller
document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("skillsViewport");
  const track = document.getElementById("skillsTrack");

  if (!viewport || !track) return;

  // Save original content
  const originalHTML = track.innerHTML.trim();

  // Ensure track has at least enough width
  function ensureFilled() {
    track.innerHTML = originalHTML;
    const minWidth = viewport.clientWidth * 2;
    let loops = 0;
    while (track.scrollWidth < minWidth && loops < 10) {
      track.innerHTML += originalHTML;
      loops++;
    }
    if (track.scrollWidth < viewport.clientWidth) {
      track.innerHTML += originalHTML + originalHTML;
    }
    if (track.scrollWidth <= viewport.clientWidth) {
      track.classList.add("center");
    } else {
      track.classList.remove("center");
    }
  }

  ensureFilled();

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      ensureFilled();
    }, 150);
  });

  // Animation state
  let pos = 0;
  let lastTime = 0;
  let isPaused = false;
  let isDragging = false;
  const speed = 0.1;

  // Pointer drag vars
  let dragStartX = 0;
  let dragStartPos = 0;

  // Animation loop
  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused && !isDragging) {
      pos -= speed * dt;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(pos) >= halfWidth) {
        pos += halfWidth;
      }
      track.style.transform = `translateX(${pos}px)`;
    } else {
      track.style.transform = `translateX(${pos}px)`;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // Pause on hover
  viewport.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  viewport.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Pointer drag support
  viewport.addEventListener("pointerdown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartPos = pos;
    isPaused = true;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    pos = dragStartPos + dx;
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(pos) >= halfWidth) {
      pos = ((pos % halfWidth) + halfWidth) % halfWidth;
    }
    track.style.transform = `translateX(${pos}px)`;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    isPaused = false;
    try {
      viewport.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
});

// Scroll to top button
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 600) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
    }
  });
});
