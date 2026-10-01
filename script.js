document.getElementById("year").textContent = String(new Date().getFullYear());

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Nav shrink */
const nav = document.getElementById("nav");
const onScrollNav = () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
};
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

/* Split hero title letters */
const splitTitle = document.querySelector("[data-split]");
if (splitTitle && !prefersReduced) {
  const text = splitTitle.textContent.trim();
  splitTitle.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    span.style.animationDelay = `${0.12 + i * 0.06}s`;
    splitTitle.appendChild(span);
  });
}

/* Copy CA */
const caText = document.getElementById("ca-text");
const copyBtn = document.getElementById("copy-ca");

copyBtn.addEventListener("click", async () => {
  const value = caText.textContent.trim();
  if (!value || value.toLowerCase().includes("paste ca")) {
    copyBtn.textContent = "Add CA first";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1400);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    copyBtn.textContent = "Copied";
  } catch {
    copyBtn.textContent = "Failed";
  }

  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 1400);
});

/* Scroll reveals */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReduced) {
  revealEls.forEach((el) => el.classList.add("in"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          if (entry.target.classList.contains("stat")) {
            animateStat(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* Count-up stats */
function animateStat(statEl) {
  const numEl = statEl.querySelector("[data-count]");
  if (!numEl) return;
  const target = Number(numEl.getAttribute("data-count"));
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    numEl.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

if (prefersReduced) {
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = el.getAttribute("data-count");
  });
}

/* Parallax hero wrapper + vibe banner */
const heroBg = document.querySelector(".hero-bg");
const vibeImg = document.querySelector(".vibe-bg img");

function parallax() {
  if (prefersReduced) return;
  const y = window.scrollY;

  if (heroBg) {
    const hero = heroBg.closest(".hero");
    const heroH = hero ? hero.offsetHeight : 1;
    const progress = Math.min(1, y / heroH);
    heroBg.style.transform = `translate3d(0, ${progress * 12}%, 0)`;
  }

  if (vibeImg) {
    const section = vibeImg.closest(".vibe");
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > 0 && rect.top < viewH) {
      const p = (viewH - rect.top) / (viewH + rect.height);
      vibeImg.style.transform = `scale(1.12) translate3d(0, ${(p - 0.5) * 12}%, 0)`;
    }
  }
}

window.addEventListener("scroll", parallax, { passive: true });
parallax();

/* Soft cursor glow (desktop) */
const glow = document.getElementById("cursor-glow");
if (glow && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
  let mx = 0;
  let my = 0;
  let gx = 0;
  let gy = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  const loop = () => {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
