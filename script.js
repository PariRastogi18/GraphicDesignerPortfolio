// Cursor glow
addEventListener("pointermove", (e) => {
  document.documentElement.style.setProperty("--x", e.clientX + "px");
  document.documentElement.style.setProperty("--y", e.clientY + "px");
});

// Scroll reveal
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Hover-to-preview videos
document.querySelectorAll(".reel").forEach((r) => {
  const v = r.querySelector("video");
  r.addEventListener("mouseenter", () => v.play().catch(() => {}));
  r.addEventListener("mouseleave", () => {
    v.pause();
    v.currentTime = 0;
  });
});

// Lightbox for images and videos
const box = document.getElementById("box"),
  stage = document.getElementById("stage");
function open(html) {
  stage.innerHTML = html;
  box.showModal();
}
document
  .querySelectorAll(".shot")
  .forEach((b) =>
    b.addEventListener("click", () =>
      open(`<img src="${b.dataset.src}" alt="${b.dataset.alt || ""}">`),
    ),
  );
document
  .querySelectorAll(".reel")
  .forEach((b) =>
    b.addEventListener("click", () =>
      open(
        `<video src="${b.dataset.video}" controls autoplay playsinline></video>`,
      ),
    ),
  );
function shut() {
  stage.innerHTML = "";
  box.close();
}
document.getElementById("close").addEventListener("click", shut);
box.addEventListener("click", (e) => {
  if (e.target === box) shut();
});
box.addEventListener("close", () => (stage.innerHTML = ""));

// Contact form (Web3Forms)
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("button");
  btn.disabled = true;
  statusEl.className = "status";
  statusEl.textContent = "Sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    statusEl.classList.add("ok");
    statusEl.textContent = "Thanks! Your message has been sent.";
    form.reset();
  } catch {
    statusEl.classList.add("err");
    statusEl.textContent = "Something went wrong. Please email me directly.";
  } finally {
    btn.disabled = false;
  }
});
