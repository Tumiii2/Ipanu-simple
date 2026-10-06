document.documentElement.classList.add("js");

const WHATSAPP_NUMBER = "2348034314148";
const INSTAGRAM = "theipanuzone";
const EMAIL = "ipanuzone@gmail.com";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-navigation");
const siteHeader = document.querySelector(".site-header");
const navBackdrop = document.createElement("div");
navBackdrop.className = "nav-backdrop";
navBackdrop.setAttribute("aria-hidden", "true");
document
  .querySelector(".site-header")
  .insertAdjacentElement("afterend", navBackdrop);

function setWhatsAppLink(link, message) {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
}

document
  .querySelectorAll(
    ".button-header, .button-order, .order-whatsapp-button, .contact-order-button",
  )
  .forEach(function (link) {
    setWhatsAppLink(link, "Hi, I'd like to place an order.");
  });

document.querySelectorAll(".menu-order-button").forEach(function (link) {
  const item = link.dataset.item;
  const unit = link.dataset.unit;
  setWhatsAppLink(
    link,
    `Hi, I'd like to order ${item}. Quantity (in ${unit}): \nEvent date and venue: `,
  );
});

setWhatsAppLink(
  document.querySelector(".menu-whatsapp-link"),
  "Hi, I'd like to place an order.",
);

setWhatsAppLink(
  document.querySelector(".contact-whatsapp-link"),
  "Hi, I'd like to place an order.",
);

document.querySelector(".contact-instagram-link").href =
  `https://instagram.com/${INSTAGRAM}`;
document.querySelector(".contact-email-link").href = `mailto:${EMAIL}`;

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
);

document.querySelectorAll(".reveal").forEach(function (element) {
  revealObserver.observe(element);
});

function updateHeaderScrollState() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
}

updateHeaderScrollState();
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNavigation.classList.remove("is-open");
  navBackdrop.classList.remove("is-visible");
}

menuToggle.addEventListener("click", function () {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    closeNavigation();
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation" : "Close navigation",
  );
  primaryNavigation.classList.add("is-open");
  navBackdrop.classList.add("is-visible");
});

navBackdrop.addEventListener("click", closeNavigation);

primaryNavigation.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeNavigation);
});

const navigationLinks = [...primaryNavigation.querySelectorAll('a[href^="#"]')];
const observedSections = ["menu", "how-to-order", "about", "contact"]
  .map(function (id) {
    return document.getElementById(id);
  })
  .filter(Boolean);

function setActiveNavigationLink(activeId) {
  navigationLinks.forEach(function (link) {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let sectionObserver;

function observeSections() {
  if (sectionObserver) sectionObserver.disconnect();

  const viewportHeight = document.documentElement.clientHeight;
  sectionObserver = new IntersectionObserver(
    function (entries) {
      const activeEntry = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .reduce(function (lastEntry, entry) {
          return !lastEntry ||
            entry.boundingClientRect.top > lastEntry.boundingClientRect.top
            ? entry
            : lastEntry;
        }, null);

      setActiveNavigationLink(activeEntry ? activeEntry.target.id : null);
    },
    {
      rootMargin: `${-viewportHeight * 0.4}px 0px ${-viewportHeight * 0.55}px 0px`,
    },
  );

  observedSections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}

observeSections();

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("resize", function () {
  if (window.innerWidth >= 760) closeNavigation();
  observeSections();
});
