/**
 * interactions.ts — logika interaksi saja. Styling ada di CSS.
 * Prinsip performa: tulis transform langsung ke elemen (bukan ke :root),
 * satu rAF per frame, loop berhenti saat tidak ada gerakan.
 */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/* ---------- 1. Reveal saat load + scroll ---------- */
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- 2. Kursor + spotlight ---------- */
function initPointerFx(): void {
  if (!finePointer) return;

  const dot = document.querySelector<HTMLElement>(".cursor--dot");
  const ring = document.querySelector<HTMLElement>(".cursor--ring");
  const spot = document.querySelector<HTMLElement>(".bg-spotlight");
  if (!dot || !ring || !spot) return;

  let tx = 0, ty = 0; // target (posisi mouse)
  let rx = 0, ry = 0; // ring
  let sx = 0, sy = 0; // spotlight
  let running = false;

  const tick = (): void => {
    rx += (tx - rx) * 0.4;
    ry += (ty - ry) * 0.4;
    sx += (tx - sx) * 0.22;
    sy += (ty - sy) * 0.22;

    dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;

    if (Math.abs(tx - sx) + Math.abs(ty - sy) + Math.abs(tx - rx) < 0.5) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      if (!document.body.classList.contains("has-pointer")) {
        // posisi awal langsung di kursor, tanpa meluncur dari pojok
        rx = sx = tx = e.clientX;
        ry = sy = ty = e.clientY;
        document.body.classList.add("has-pointer");
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    },
    { passive: true },
  );

  document.documentElement.addEventListener("pointerleave", () => document.body.classList.remove("has-pointer"));
  document.addEventListener("pointerdown", () => document.body.classList.add("cursor-down"));
  document.addEventListener("pointerup", () => document.body.classList.remove("cursor-down"));

  const hoverables = "a, button, [data-tilt]";
  document.addEventListener("pointerover", (e) => {
    if ((e.target as HTMLElement).closest(hoverables)) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("pointerout", (e) => {
    if ((e.target as HTMLElement).closest(hoverables)) document.body.classList.remove("cursor-hover");
  });
}

/* ---------- 3. Tombol magnetik (rAF-batched) ---------- */
function initMagnetic(): void {
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    let raf = 0;
    let rect: DOMRect | null = null;

    el.addEventListener("pointerenter", () => {
      rect = el.getBoundingClientRect(); // diukur sekali, bukan tiap gerakan
    });

    el.addEventListener("pointermove", (e) => {
      if (!rect || raf) return;
      const r = rect;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${dx * 0.25}px, ${dy * 0.25}px, 0)`;
      });
    });

    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      el.style.transform = "";
    });
  });
}

/* ---------- 4. Kartu: tilt + glow (rAF-batched) ---------- */
function initTilt(): void {
  if (!finePointer) return;
  const maxTilt = 6;

  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    let raf = 0;
    let rect: DOMRect | null = null;

    card.addEventListener("pointerenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("pointermove", (e) => {
      if (!rect || raf) return;
      const r = rect;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = clamp((e.clientX - r.left) / r.width, 0, 1);
        const y = clamp((e.clientY - r.top) / r.height, 0, 1);
        card.style.setProperty("--px", `${x * 100}%`);
        card.style.setProperty("--py", `${y * 100}%`);
        if (!reduceMotion) {
          card.style.transform = `rotateX(${(0.5 - y) * 2 * maxTilt}deg) rotateY(${(x - 0.5) * 2 * maxTilt}deg)`;
        }
      });
    });

    card.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      card.style.transform = "";
    });
  });
}

/* ---------- 5. Ripple ---------- */
function initRipple(): void {
  document.querySelectorAll<HTMLElement>("[data-ripple]").forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      const r = el.getBoundingClientRect();
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.left = `${e.clientX - r.left}px`;
      span.style.top = `${e.clientY - r.top}px`;
      el.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });
    });
  });
}

/* ---------- 6. Navbar ---------- */

/* ---------- Init ---------- */
export function initInteractions(): void {
  initReveal();
  initPointerFx();
  initMagnetic();
  initTilt();
  initRipple();
  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInteractions);
} else {
  initInteractions();
}