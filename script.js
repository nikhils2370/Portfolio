/* =========================================================
   Nikhil Sharma — Portfolio  |  script.js
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Config ----------
     Contact form: paste a Formspree / Getform endpoint here to receive
     messages straight to your inbox, e.g. "https://formspree.io/f/xxxxxxx".
     Leave empty to fall back to opening the visitor's mail app. */
  const FORM_ENDPOINT = "";
  const CONTACT_EMAIL = "nikhilsharma@example.com"; // <-- put your real email

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const setThemeIcon = () => {
    const light = root.getAttribute("data-theme") === "light";
    themeBtn.innerHTML = `<i class="fa-solid ${light ? "fa-sun" : "fa-moon"}"></i>`;
    $('meta[name="theme-color"]').content = light ? "#f7f4ed" : "#0e0f14";
  };
  setThemeIcon();
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { }
    setThemeIcon();
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const toggleMenu = (open) => {
    const state = open ?? !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", state);
    menuBtn.classList.toggle("open", state);
    menuBtn.setAttribute("aria-expanded", state);
    menuBtn.setAttribute("aria-label", state ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMenu(); });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) toggleMenu(false);
  });
  addEventListener("resize", () => innerWidth > 900 && toggleMenu(false));

  /* ---------- Download dropdown ---------- */
  const dropdown = $("#dropdown");
  const dropBtn = $(".dropdown-btn", dropdown);
  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle("active");
    dropBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", () => {
    dropdown.classList.remove("active");
    dropBtn.setAttribute("aria-expanded", "false");
  });

  /* ---------- Scroll: progress bar, header, back-to-top, active link ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  const sections = $$("main section[id]");
  const links = $$(".nav-links .nav-link");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Hero: spotlight follows cursor ---------- */
  const hero = $(".hero");
  if (matchMedia("(hover: hover)").matches && !reduceMotion) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", e.clientX - r.left + "px");
      hero.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }

  /* ---------- Typing effect ---------- */
  const typed = $("#typed");
  const roles = ["responsive websites", "full-stack web apps", "clean React interfaces", "REST APIs with Node.js", "ideas that ship"];
  if (reduceMotion) {
    typed.textContent = roles[0];
  } else {
    let r = 0, c = 0, del = false;
    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, del ? --c : ++c);
      let wait = del ? 35 : 75;
      if (!del && c === word.length) { del = true; wait = 1600; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    };
    tick();
  }

  /* ---------- Flip card ---------- */
  const card = $("#myCard");
  const flip = () => {
    const on = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", on);
  };
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });

  /* ---------- Scroll reveal (+ stagger) ---------- */
  $$(".services-grid, .projects-grid, .tech-grid, .stats").forEach((group) => {
    $$(".reveal, .service, .project-card, .tech, .stat", group).forEach((el, i) => {
      el.style.setProperty("--d", i * 0.08 + "s");
    });
  });
  const revealIO = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealIO.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = +el.dataset.count, suffix = el.dataset.suffix || "";
      if (reduceMotion) { el.textContent = end + suffix; obs.unobserve(el); return; }
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Skill bars ---------- */
  const barIO = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.style.width = en.target.dataset.level + "%";
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });
  $$(".progress-fill").forEach((el) => barIO.observe(el));

  /* ---------- Accordion ---------- */
  $$(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const willOpen = !item.classList.contains("active");
      $$(".accordion-item").forEach((i) => {
        i.classList.remove("active");
        $(".accordion-header", i).setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Project cards: auto-sliders + dots ---------- */
  $$(".project-slider").forEach((slider) => {
    const track = $(".slider-track", slider);
    const imgs = $$("img", track);
    const dotsWrap = $(".slider-dots", slider);
    if (imgs.length < 2) return;
    imgs.forEach(() => dotsWrap.appendChild(document.createElement("i")));
    const dots = $$("i", dotsWrap);
    let i = 0, timer = null;
    const show = (n) => {
      i = (n + imgs.length) % imgs.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
    };
    show(0);
    const start = () => { if (!reduceMotion && !timer) timer = setInterval(() => show(i + 1), 2600); };
    const stop = () => { clearInterval(timer); timer = null; };
    // only animate when visible (saves battery on phones)
    new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop())).observe(slider);
    slider.addEventListener("pointerenter", stop);
    slider.addEventListener("pointerleave", start);
  });

  /* ---------- Project filter ---------- */
  const chips = $$(".chip");
  const cards = $$(".project-card");
  const emptyNote = $("#emptyNote");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.toggle("active", c === chip));
      const f = chip.dataset.filter;
      let shown = 0;
      cards.forEach((cd) => {
        const ok = f === "all" || cd.dataset.cat === f;
        cd.classList.toggle("hide", !ok);
        if (ok) { shown++; cd.classList.add("in"); }
      });
      emptyNote.hidden = shown > 0;
    });
  });

  /* ---------- Project modal ---------- */
  const modal = $("#projectModal");
  const track = $("#modalSlideTrack");
  const counter = $("#modalCounter");
  const prevBtn = $(".modal-prev");
  const nextBtn = $(".modal-next");
  let cur = 0, count = 0, lastFocus = null;

  const goTo = (n) => {
    cur = Math.max(0, Math.min(n, count - 1));
    track.style.transform = `translateX(-${cur * 100}%)`;
    counter.textContent = `${cur + 1} / ${count}`;
    prevBtn.style.visibility = cur === 0 ? "hidden" : "visible";
    nextBtn.style.visibility = cur === count - 1 ? "hidden" : "visible";
  };

  const openModal = (cd) => {
    lastFocus = document.activeElement;
    $("#modalTag").textContent = $(".project-tag", cd).textContent;
    $("#modalTitle").textContent = $(".project-title", cd).textContent;
    $("#modalDescription").textContent = $(".project-description", cd).textContent;
    $("#modalTech").innerHTML = $(".project-tech", cd).innerHTML;
    $("#modalLinks").innerHTML = $(".project-links", cd).innerHTML;
    track.innerHTML = "";
    $$(".slider-track img", cd).forEach((img) => {
      const el = document.createElement("img");
      el.src = img.src;
      el.alt = img.alt;
      track.appendChild(el);
    });
    count = track.children.length;
    goTo(0);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#modalCloseBtn").focus();
  };
  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lastFocus?.focus();
  };

  cards.forEach((cd) => {
    cd.addEventListener("click", (e) => { if (!e.target.closest("a")) openModal(cd); });
    cd.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target === cd) { e.preventDefault(); openModal(cd); }
    });
  });
  $("#modalCloseBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  prevBtn.addEventListener("click", () => goTo(cur - 1));
  nextBtn.addEventListener("click", () => goTo(cur + 1));
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") goTo(cur - 1);
    if (e.key === "ArrowRight") goTo(cur + 1);
    if (e.key === "Tab") { // simple focus trap
      const f = $$("button, a[href]", modal).filter((el) => el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe on touch screens
  let sx = null;
  const win = $(".modal-slide-window");
  win.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  win.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- Clock widget ---------- */
  const timeBtn = $("#timeToggleBtn");
  const timePanel = $("#timePanel");
  const updateClock = () => {
    const now = new Date();
    const hh = String(now.getHours() % 12 || 12).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ap = now.getHours() >= 12 ? "PM" : "AM";
    $("#triggerTimeText").textContent = `${hh}:${mm} ${ap}`;
    $("#fullTime").textContent = `${hh}:${mm}:${ss} ${ap}`;
    $("#fullDate").textContent = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    $("#fullDay").textContent = now.toLocaleDateString("en-US", { weekday: "long" });
  };
  setInterval(updateClock, 1000);
  updateClock();
  timeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = timePanel.classList.toggle("active");
    timeBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => {
    if (!timePanel.contains(e.target) && !timeBtn.contains(e.target)) {
      timePanel.classList.remove("active");
      timeBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Contact: copy email ---------- */
  $("#copyEmail").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText($("#emailText").textContent.trim());
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => (btn.innerHTML = '<i class="fa-regular fa-copy"></i>'), 1800);
    } catch (err) { /* clipboard blocked: ignore */ }
  });

  /* ---------- Contact form: validation + send ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const sendBtn = $("#sendBtn");
  const msg = $("#userMessage");
  const msgCounter = $("#msgCounter");
  msg.addEventListener("input", () => (msgCounter.textContent = `${msg.value.length} / ${msg.maxLength}`));

  const rules = {
    userName: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    userEmail: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
    userSubject: (v) => (v.trim().length >= 3 ? "" : "Subject is too short."),
    userMessage: (v) => (v.trim().length >= 10 ? "" : "Message should be at least 10 characters."),
  };
  const validateField = (input) => {
    const err = rules[input.id](input.value);
    const group = input.closest(".form-group");
    group.classList.toggle("invalid", !!err);
    $(".err", group).textContent = err;
    return !err;
  };
  Object.keys(rules).forEach((id) => {
    const el = $("#" + id);
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => el.closest(".form-group").classList.contains("invalid") && validateField(el));
  });

  const setStatus = (text, type) => { status.textContent = text; status.className = "form-status " + (type || ""); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const allOk = Object.keys(rules).map((id) => validateField($("#" + id))).every(Boolean);
    if (!allOk) { setStatus("Please fix the highlighted fields.", "fail"); return; }

    const data = Object.fromEntries(new FormData(form));
    sendBtn.disabled = true;
    setStatus("Sending…");

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Request failed");
        setStatus("Thanks! Your message has been sent.", "ok");
      } else {
        const body = `Hi Nikhil,\n\n${data.message}\n\n— ${data.name} (${data.email})`;
        location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app…", "ok");
      }
      form.reset();
      msgCounter.textContent = `0 / ${msg.maxLength}`;
    } catch (err) {
      setStatus("Something went wrong. Please email me directly.", "fail");
    } finally {
      sendBtn.disabled = false;
    }
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
