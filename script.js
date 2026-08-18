// Navbar Functionality
const navbar = document.getElementById("navbar");
const navItems = document.querySelectorAll("#navbar .nav-items li a");
const checkbox = document.querySelector("#nav-toggle");

// Smooth scroll for nav links
navItems.forEach(item => {
  item.addEventListener("click", function(e) {
    e.preventDefault();
    checkbox.checked = false;
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Navbar background on scroll
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
  
  // Hide navbar on scroll down, show on scroll up
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }
  
  lastScrollTop = scrollTop;
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && checkbox.checked) {
    checkbox.checked = false;
  }
});

// Portfolio Gallery

let filterContainer = document.querySelector(".gallery-filter");
let galleryItems = document.querySelectorAll(".gallery-item");

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
  if (event.target.classList.contains("filter-item")) {
    // Deactivate existing active filter item
    filterContainer.querySelector(".active").classList.remove("active");
    // Activate new filter item
    event.target.classList.add("active");
    let filterValue = event.target.getAttribute("data-filter");
    filterGallery(filterValue); // Call the filter function
  }
});

// Initial filtering on page load (Hide all but the active filter's items)
const activeFilter = filterContainer.querySelector(".active");
if (activeFilter) {
  const initialFilterValue = activeFilter.getAttribute("data-filter");
  filterGallery(initialFilterValue);
}

// Review Carousel
$(".owl-carousel").owlCarousel({
  loop: true,
  margin: 10,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1200: {
      items: 2,
    },
  },
});

//SubText

const subTextElement = document.getElementById("subText");
const subTextOptions = [
  "Cyber Security Analyst",
  "Security Consultant",
  "Cyber Security Instructor",
];
let currentSubTextIndex = 0;

function updateSubText() {
  subTextElement.classList.add("fade-out"); // Start fade-out

  setTimeout(() => {
    subTextElement.textContent = subTextOptions[currentSubTextIndex];
    currentSubTextIndex = (currentSubTextIndex + 1) % subTextOptions.length;
    subTextElement.classList.remove("fade-out"); // Fade back in
  }, 500); // Wait for fade-out (half of transition duration)
}

// Initial display
updateSubText();
setInterval(updateSubText, 3000);

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

scrollToTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// H1 Hover Effect - Change text content
const mainHeading = document.querySelector("#home .text-holder h1");
let isHovered = false;
let timeoutId = null;

if (mainHeading) {
    const originalText = mainHeading.innerHTML;

    // Track mouse position relative to heading
    const handleMouseMove = (e) => {
        const rect = mainHeading.getBoundingClientRect();
        const isOverHeading = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );

        if (!isOverHeading && isHovered) {
            isHovered = false;
            clearTimeout(timeoutId);
            mainHeading.innerHTML = originalText;
        }
    };

    mainHeading.addEventListener("mouseenter", function() {
        isHovered = true;
        clearTimeout(timeoutId);
        this.innerHTML = "Cyber <span>Armor Knight</span>";
    });

    mainHeading.addEventListener("mouseleave", function() {
        isHovered = false;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (!isHovered) {
                this.innerHTML = originalText;
            }
        }, 100);
    });

    // Add global mouse tracking
    document.addEventListener("mousemove", handleMouseMove);

    // Touch event handling for mobile
    mainHeading.addEventListener("touchstart", function(e) {
        e.preventDefault();
        isHovered = true;
        clearTimeout(timeoutId);
        this.innerHTML = "Cyber <span>Armor Knight</span>";
    });

    mainHeading.addEventListener("touchend", function() {
        isHovered = false;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (!isHovered) {
                this.innerHTML = originalText;
            }
        }, 100);
    });
}

// Navbar scroll behavior
const scrollThreshold = 100;
let prevScrollPos = window.pageYOffset;

window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset;
    
    // Show navbar at the top
    if (currentScrollPos <= scrollThreshold) {
        navbar.classList.remove("fixed");
        return;
    }

    // Handle scroll direction
    if (prevScrollPos > currentScrollPos) {
        // Scrolling up - show navbar
        navbar.classList.add("fixed");
        navbar.style.transform = "translateY(0)";
    } else {
        // Scrolling down - hide navbar
        navbar.classList.add("fixed");
        navbar.style.transform = "translateY(-100%)";
    }

    prevScrollPos = currentScrollPos;
});

// Email send

const WEB3FORMS_ACCESS_KEY = "4f375d87-1ffc-42bd-91af-426fd4adedf4";

function sendEmailWithWeb3FormsCustom() {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector('input[type="submit"]');

    // Custom Web3Forms configuration to avoid spam
    const emailData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),

      // ANTI-SPAM CONFIGURATION
      from_name: formData.get("name"), // Use sender's name
      replyto: formData.get("email"), // Set reply-to as sender's email

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

function createProfessionalEmailTemplate(formData) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Message</h1>
      </div>

      <div style="padding: 30px; background-color: #f9f9f9;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>

              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555; width: 30%;">Name:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${formData.get(
                        "name"
                      )}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;"><a href="mailto:${formData.get(
                        "email"
                      )}" style="color: #667eea; text-decoration: none;">${formData.get(
    "email"
  )}</a></td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Subject:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${formData.get(
                        "subject"
                      )}</td>
                  </tr>
              </table>

              <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px;">Message:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; line-height: 1.6; color: #555;">
                  ${formData.get("message").replace(/\n/g, "<br>")}
              </div>
          </div>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #f0f0f0; color: #666; font-size: 14px; border-radius: 0 0 10px 10px;">
          <p style="margin: 0;">This email was sent from your contact form on ${new Date().toLocaleDateString()}</p>
      </div>
  </div>
  `;
}

// Skills Progress Bar Animation on Scroll
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-line");

  // Create an intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a small delay to make the animation more noticeable
          setTimeout(() => {
            entry.target.classList.add("animate");
          }, 200);
        }
      });
    },
    {
      // Trigger when 30% of the element is visible
      threshold: 0.3,
      // Start observing 100px before the element comes into view
      rootMargin: "0px 0px -100px 0px",
    }
  );

  // Observe all progress bars
  progressBars.forEach((bar) => {
    observer.observe(bar);
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

// Blog Carousel Functionality
class BlogCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".blog-slide");
    this.indicators = document.querySelectorAll(".indicator");
    this.autoplayInterval = null;
    this.autoplayDuration = 4000; // 4 seconds

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    // Initialize indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.goToSlide(index);
      });
    });

    // Initialize navigation buttons
    const prevBtn = document.querySelector(".blog-nav-btn.prev");
    const nextBtn = document.querySelector(".blog-nav-btn.next");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        this.prevSlide();
      });

      nextBtn.addEventListener("click", () => {
        this.nextSlide();
      });
    }

    // Start autoplay
    this.startAutoplay();

    // Pause autoplay on hover
    const carousel = document.querySelector(".blog-carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", () => this.pauseAutoplay());
      carousel.addEventListener("mouseleave", () => this.startAutoplay());
    }

    // Pause autoplay when user interacts with modal
    const readMoreBtns = document.querySelectorAll(".blog-content .btn");
    readMoreBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.pauseAutoplay();
      });
    });

    // Resume autoplay when modal is closed
    const modal = document.getElementById("blogModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.startAutoplay();
        }
      });
    }
  }

  goToSlide(index) {
    if (index === this.currentSlide) return;

    // Remove active classes
    this.slides[this.currentSlide].classList.remove("active");
    this.indicators[this.currentSlide].classList.remove("active");

    // Add transition classes
    if (index > this.currentSlide) {
      this.slides[this.currentSlide].classList.add("prev");
    } else {
      this.slides[this.currentSlide].classList.add("next");
    }

    // Update current slide
    this.currentSlide = index;

    // Add active classes
    this.slides[this.currentSlide].classList.add("active");
    this.indicators[this.currentSlide].classList.add("active");

    // Clean up transition classes after animation
    setTimeout(() => {
      this.slides.forEach((slide) => {
        slide.classList.remove("prev", "next");
      });
    }, 600);
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.pauseAutoplay(); // Clear any existing interval
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDuration);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialize blog carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Dynamically generate blog indicators based on number of slides
  const blogCarouselContainer = document.querySelector(".blog-carousel-container");
  const blogIndicators = document.querySelector(".blog-indicators");
  if (blogCarouselContainer && blogIndicators) {
    const slides = blogCarouselContainer.querySelectorAll(".blog-slide");
    blogIndicators.innerHTML = "";
    slides.forEach((slide, idx) => {
      const indicator = document.createElement("span");
      indicator.className = "indicator" + (idx === 0 ? " active" : "");
      indicator.setAttribute("data-slide", idx);
      blogIndicators.appendChild(indicator);
    });
  }
  // Add a small delay to ensure all elements are properly loaded
  setTimeout(() => {
    new BlogCarousel();
  }, 100);
});

// Service Modal Logic
const serviceModal = document.getElementById("serviceModal");
const serviceModalTitle = serviceModal.querySelector(".service-modal-title");
const serviceModalBody = serviceModal.querySelector(".service-modal-body");
const serviceModalClose = serviceModal.querySelector(".service-modal-close");

// Function to open service modal with smooth animation
function openServiceModal(title, content) {
    serviceModalTitle.textContent = title;
    serviceModalBody.innerHTML = content;

    serviceModal.style.display = "block";
    serviceModal.offsetHeight; // Force reflow
    serviceModal.classList.add("show");
}

// Function to close service modal with smooth animation
function closeServiceModal() {
    serviceModal.classList.remove("show");

    setTimeout(() => {
        serviceModal.style.display = "none";
    }, 300);
}

// Add event listeners to all service read more buttons
document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll(".service-card .read-more-btn");
    
    readMoreBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const serviceId = btn.getAttribute("data-service");
            
            // Find the hidden modal content for this service
            const modalContent = document.querySelector(`.modal-content-hidden[data-service="${serviceId}"]`);
            
            if (modalContent) {
                const title = modalContent.querySelector("h3").textContent;
                const content = modalContent.innerHTML;
                
                openServiceModal(title, content);
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

    // Close service modal when pressing the Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && serviceModal.classList.contains("show")) {
            closeServiceModal();
        }
    });

    // Prevent service modal content clicks from closing the modal
    document.querySelector(".service-modal-content").addEventListener("click", (e) => {
        e.stopPropagation();
    });
});
