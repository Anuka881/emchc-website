 // ---------- helpers ----------
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

// ---------- year ----------
const yearEl = qs("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- navbar scroll effect ----------
const header = qs("#header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll);
  onScroll();
}

// ---------- mobile menu ----------
const burger = qs("#burger");
const nav = qs("#nav");
if (burger && nav) {
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  qsa(".nav__link").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
}

// ---------- hero slideshow ----------
const heroBg = qs("#heroBg");
const dotsWrap = qs("#heroDots");

if (heroBg && dotsWrap) {
  const heroImages = [
    "assets/images/hero-01.jpg",
    "assets/images/hero-02.jpg",
    "assets/images/hero-03.jpg",
    "assets/images/hero-04.jpg"
  ];

  let heroIndex = 0;
  let heroTimer = null;

  function renderDots() {
    dotsWrap.innerHTML = "";
    heroImages.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero__dot" + (i === heroIndex ? " is-active" : "");
      b.addEventListener("click", () => setHero(i, true));
      dotsWrap.appendChild(b);
    });
  }

  function setHero(i, restart) {
    heroIndex = (i + heroImages.length) % heroImages.length;
    heroBg.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
    renderDots();

    if (restart) {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => setHero(heroIndex + 1, false), 6000);
    }
  }

  renderDots();
  setHero(0, true);
}

// ---------- reveal ----------
const revealEls = qsa(".reveal");
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });

  revealEls.forEach(el => io.observe(el));
}

// ---------- language toggle ----------
const mnBtn = qs("#mnBtn");
const enBtn = qs("#enBtn");

if (mnBtn && enBtn) {
  const heroKicker = qs("#heroKicker");
  const heroTitle = qs("#heroTitle");
  const heroDesc = qs("#heroDesc");
  const ctaAbout = qs("#ctaAbout");
  const ctaAct = qs("#ctaAct");
  const ctaNews = qs("#ctaNews");

  function setLang(lang) {
    mnBtn.classList.toggle("is-active", lang === "mn");
    enBtn.classList.toggle("is-active", lang === "en");

    if (!heroKicker || !heroTitle || !heroDesc || !ctaAbout || !ctaAct || !ctaNews) return;

    if (lang === "en") {
      heroKicker.textContent = "EU • MN Cultural Bridge";
      heroTitle.innerHTML = "EUROPE MONGOLIAN<br>CULTURAL CENTER";
      heroDesc.textContent =
        "A cultural hub connecting Mongolian heritage with Europe through events, workshops, exhibitions, and community programs.";
      ctaAbout.textContent = "About us";
      ctaAct.textContent = "Activities";
      ctaNews.textContent = "News";
    } else {
      heroKicker.textContent = "EU • MN Cultural Bridge";
      heroTitle.innerHTML = "ЕВРОП МОНГОЛЫН<br>СОЁЛЫН ТӨВ";
      heroDesc.textContent =
        "Европ дахь монгол соёлыг түгээн дэлгэрүүлэх, соёлын солилцоог дэмжих, арга хэмжээ, сургалт, үзэсгэлэн, уулзалтаар дамжуулан олон нийттэй холбох төв.";
      ctaAbout.textContent = "Бидний тухай";
      ctaAct.textContent = "Үйл ажиллагаа";
      ctaNews.textContent = "Мэдээ мэдээлэл";
    }
  }

  mnBtn.addEventListener("click", () => setLang("mn"));
  enBtn.addEventListener("click", () => setLang("en"));
}

// ---------- contact form (demo) ----------
const form = qs("#contactForm");
const statusEl = qs("#formStatus");
if (form && statusEl) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "Амжилттай илгээгдлээ (demo).";
    form.reset();
  });
}

  // ---------- news list on index ----------
const newsDiv = document.getElementById("news");

if (newsDiv) {
  fetch("http://localhost:3000/news")
    .then(res => res.json())
    .then(data => {
      newsDiv.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        newsDiv.innerHTML = "<p>Одоогоор мэдээ алга байна.</p>";
        return;
      }

      data.forEach(n => {
        const imgSrc = n.image ? `assets/images/${n.image}` : "";

       newsDiv.innerHTML += `
  <article class="news-item">
    <h3>${n.title}</h3>
    ${imgSrc ? `<img src="${imgSrc}" width="300">` : ""}
    <p>${n.content.substring(0,120)}...</p>
    <a href="news-detail.html?id=${n.id}" class="btn btn--ghost">
      Дэлгэрэнгүй
    </a>
  </article>
`;
      });
    })
    .catch(err => console.error("News fetch error:", err));
}
 // ---------- featured 3-4 latest posts (news + events + trainings) ----------
const featuredEl = document.getElementById("featuredPosts");

if (featuredEl) {
  const safeArr = (x) => (Array.isArray(x) ? x : []);
  const asTime = (p) => {
    // events-д event_date байвал тэрийг нь, үгүй бол created_at
    const v = p.event_date || p.created_at || "";
    const t = Date.parse(v);
    return Number.isNaN(t) ? 0 : t;
  };
  const label = (t) => (t === "events" ? "Арга хэмжээ" : t === "trainings" ? "Сургалт" : "Мэдээ");
  const linkFor = (p) => {
    if (p.type === "news") return `news-detail.html?id=${p.id}`;
    if (p.type === "events") return `events.html`;
    if (p.type === "trainings") return `training.html`;
    return "#";
  };

  Promise.allSettled([
    fetch("http://localhost:3000/news").then(r => r.json()),
    fetch("http://localhost:3000/events").then(r => r.json()),
    fetch("http://localhost:3000/trainings").then(r => r.json()),
  ]).then((r) => {
    const news = (r[0].status === "fulfilled" ? safeArr(r[0].value) : []).map(x => ({ ...x, type: "news" }));
    const events = (r[1].status === "fulfilled" ? safeArr(r[1].value) : []).map(x => ({ ...x, type: "events" }));
    const trainings = (r[2].status === "fulfilled" ? safeArr(r[2].value) : []).map(x => ({ ...x, type: "trainings" }));

    // бүгдийг нэгтгээд хамгийн шинэ 4-ийг авна
    const all = [...news, ...events, ...trainings]
      .sort((a, b) => asTime(b) - asTime(a))
      .slice(0, 4);

    if (all.length === 0) {
      featuredEl.innerHTML = `<p style="opacity:.8;">Одоогоор онцлох нийтлэл алга байна.</p>`;
      return;
    }

    featuredEl.innerHTML = all.map(p => {
      const img = p.image ? `<img src="assets/images/${p.image}" alt="" class="featured-img">` : "";
      const dateText = p.event_date || p.created_at || "";
      const date = dateText ? `<div class="featured-date">${dateText}</div>` : "";
      const preview = (p.content || "").slice(0, 90);

      return `
        <article class="featured-card">
          <div class="featured-type">${label(p.type)}</div>
          <h3 class="featured-title">${p.title ?? ""}</h3>
          ${date}
          ${img}
          ${preview ? `<p class="featured-desc">${preview}...</p>` : ""}
          <a class="btn btn--ghost" href="${linkFor(p)}">Дэлгэрэнгүй</a>
        </article>
      `;
    }).join("");
  }).catch(() => {
    featuredEl.innerHTML = `<p style="opacity:.8;">Онцгой хэсэг ачаалсангүй.</p>`;
  });
}