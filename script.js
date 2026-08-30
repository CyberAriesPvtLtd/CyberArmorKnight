// Navbar Functionality
const navbar = document.getElementById("navbar");
const navItems = document.querySelectorAll("#navbar .nav-items li a");
const checkbox = document.querySelector("#nav-toggle");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

function closeMobileMenu() {
  checkbox.checked = false;
  checkbox.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

// Smooth scroll for nav links + close mobile menu
navItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    closeMobileMenu();
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Keep aria-expanded / body scroll-lock in sync with the checkbox toggle
checkbox.addEventListener("change", () => {
  checkbox.setAttribute("aria-expanded", String(checkbox.checked));
  document.body.classList.toggle("nav-open", checkbox.checked);
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && checkbox.checked) {
    closeMobileMenu();
  }
});

// Navbar background + hide-on-scroll + scroll-to-top visibility,
// all throttled to a single requestAnimationFrame per scroll event.
const NAV_SCROLL_THRESHOLD = 100;
let lastScrollTop = 0;
let scrollTicking = false;

function updateOnScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > NAV_SCROLL_THRESHOLD) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }

  // Keep the navbar visible while the mobile menu is open so the open
  // drawer (positioned relative to the navbar) never gets shifted off-screen.
  if (checkbox.checked) {
    navbar.style.transform = "translateY(0)";
  } else if (scrollTop > NAV_SCROLL_THRESHOLD && scrollTop > lastScrollTop) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }

  scrollToTopBtn.classList.toggle("visible", scrollTop > 20);

  lastScrollTop = scrollTop;
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateOnScroll);
    scrollTicking = true;
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Portfolio Gallery

const filterContainer = document.querySelector(".gallery-filter");
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".gallery-filter .filter-item");

// Function to filter gallery items
function filterGallery(filterValue) {
  galleryItems.forEach((item) => {
    if (item.classList.contains(filterValue)) {
      item.classList.remove("hide");
      item.classList.add("show");
    } else {
      item.classList.remove("show");
      item.classList.add("hide");
    }
  });
}

filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-item");
  if (!button) return;

  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");

  filterGallery(button.getAttribute("data-filter"));
});

// Initial filtering on page load (Hide all but the active filter's items)
const activeFilter = filterContainer.querySelector(".active");
if (activeFilter) {
  filterGallery(activeFilter.getAttribute("data-filter"));
}

// Skills Progress Bar + Percentage Counter Animation on Scroll
function animateProgressBars() {
  const progressItems = document.querySelectorAll(".progress-item");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const item = entry.target;
        const line = item.querySelector(".progress-line");
        const percentEl = item.querySelector(".progress-percent");

        setTimeout(
          () => {
            if (line) line.classList.add("animate");
            if (percentEl) animatePercentCount(percentEl, prefersReducedMotion);
          },
          prefersReducedMotion ? 0 : 200
        );

        observer.unobserve(item);
      });
    },
    {
      // Trigger when 30% of the element is visible
      threshold: 0.3,
      // Start observing 100px before the element comes into view
      rootMargin: "0px 0px -100px 0px",
    }
  );

  progressItems.forEach((item) => observer.observe(item));
}

function animatePercentCount(el, skipAnimation) {
  const target = parseInt(el.getAttribute("data-target"), 10) || 0;

  if (skipAnimation) {
    el.textContent = target + "%";
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(progress * target) + "%";
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Footer copyright year
const copyrightYearEl = document.getElementById("copyright-year");
if (copyrightYearEl) {
  copyrightYearEl.textContent = new Date().getFullYear();
}

// Email send

const WEB3FORMS_ACCESS_KEY = "4f375d87-1ffc-42bd-91af-426fd4adedf4";

function sendEmailWithWeb3FormsCustom() {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector('input[type="submit"]');

    const emailData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),

      // Route replies straight back to the sender
      from_name: formData.get("name"),
      replyto: formData.get("email"),

      redirect: window.location.href + "?success=1",
    };

    submitBtn.value = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        showMessage("Message sent successfully!", "success");
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Failed to send message. Please try again.", "error");
    } finally {
      submitBtn.value = "Send Your Message";
      submitBtn.disabled = false;
    }
  });
}

// Initialize form on page load
document.addEventListener("DOMContentLoaded", function () {
  sendEmailWithWeb3FormsCustom();

  // Initialize progress bar animation
  animateProgressBars();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "1") {
    showMessage("Message sent successfully!", "success");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Enhanced message display with better styling
function showMessage(message, type) {
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span style="font-size: 20px;">${
            type === "success" ? "✓" : "✗"
          }</span>
          <span>${message}</span>
      </div>
  `;

  messageDiv.style.cssText = `
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      font-size: 16px;
      animation: slideInBounce 0.5s ease-out;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      ${
        type === "success"
          ? "background: linear-gradient(135deg, #4CAF50, #45a049); color: white;"
          : "background: linear-gradient(135deg, #f44336, #d32f2f); color: white;"
      }
  `;

  if (!document.querySelector("#enhancedAnimations")) {
    const style = document.createElement("style");
    style.id = "enhancedAnimations";
    style.textContent = `
          @keyframes slideInBounce {
              0% { opacity: 0; transform: translateY(-30px) scale(0.9); }
              50% { transform: translateY(-5px) scale(1.02); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes fadeOutUp {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(-20px); }
          }
      `;
    document.head.appendChild(style);
  }

  const title = document.querySelector(".title");
  title.insertAdjacentElement("afterend", messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = "fadeOutUp 0.4s ease-out forwards";
    setTimeout(() => messageDiv.remove(), 400);
  }, 4000);
}

// Service Modal Logic
const serviceModal = document.getElementById("serviceModal");
const serviceModalTitle = serviceModal.querySelector(".service-modal-title");
const serviceModalBody = serviceModal.querySelector(".service-modal-body");
const serviceModalClose = serviceModal.querySelector(".service-modal-close");
let lastFocusedElement = null;

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

// Function to open service modal with smooth animation
function openServiceModal(title, content, triggerEl) {
  lastFocusedElement = triggerEl || document.activeElement;
  serviceModalTitle.textContent = title;
  serviceModalBody.innerHTML = content;

  serviceModal.hidden = false;
  serviceModal.offsetHeight; // Force reflow
  serviceModal.classList.add("show");
  serviceModalClose.focus();
}

// Function to close service modal with smooth animation
function closeServiceModal() {
  serviceModal.classList.remove("show");

  setTimeout(() => {
    serviceModal.hidden = true;
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }, 300);
}

// Add event listeners to all service read more buttons
document.addEventListener("DOMContentLoaded", function () {
  const readMoreBtns = document.querySelectorAll(".service-card .read-more-btn");

  readMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute("data-service");

      // Find the hidden modal content for this service
      const modalContent = document.querySelector(
        `.modal-content-hidden[data-service="${serviceId}"]`
      );

      if (modalContent) {
        const title = modalContent.querySelector("h3").textContent;
        const content = modalContent.innerHTML;

        openServiceModal(title, content, btn);
      }
    });
  });

  // Close service modal when clicking the close button
  serviceModalClose.addEventListener("click", closeServiceModal);

  // Close service modal when clicking outside the modal content
  serviceModal.addEventListener("click", (event) => {
    if (event.target === serviceModal) {
      closeServiceModal();
    }
  });

  // Close on Escape, trap Tab focus within the modal while open
  document.addEventListener("keydown", (event) => {
    if (!serviceModal.classList.contains("show")) return;

    if (event.key === "Escape") {
      closeServiceModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = getFocusableElements(
        serviceModal.querySelector(".service-modal-content")
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Prevent service modal content clicks from closing the modal
  document.querySelector(".service-modal-content").addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
