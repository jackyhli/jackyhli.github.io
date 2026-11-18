/* jackyhli.com — one small script for every page.
   1. EDIT YOUR LINKS HERE. Every link marked data-link="..." on the site uses these.
   2. Runs the REC timecode in the top bar.
   3. Sends the contact form. */

const SITE = {
  // Email is stored in two pieces so scrapers reading this file don't find a full address.
  // It's only put together when someone clicks an email link. Shown on the page as "name [at] domain [dot] edu".
  email: { user: "jackyhli", domain: "berkeley.edu" },
  github: "https://github.com/jackyhli",
  linkedin: "https://www.linkedin.com/in/jackyhli",
  resume: "",    // e.g. "/assets/resume.pdf" after you add the file
  reel: "",      // e.g. a YouTube or Vimeo link
  youtube: "https://www.youtube.com/@jackyhli",
  instagram: "https://www.instagram.com/jacky.hli",
  formspree: "https://formspree.io/f/mkjrjjer", // your Formspree form. Blank = form opens the visitor's email app.
};

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Email helpers (anti-scraping) ----------
const emailAddr = () => (SITE.email && SITE.email.user ? SITE.email.user + "\u0040" + SITE.email.domain : "");
const emailShown = () =>
  SITE.email && SITE.email.user ? SITE.email.user + " [at] " + SITE.email.domain.replace(/\./g, " [dot] ") : "";

// ---------- Links ----------
// Any link left blank above is hidden (with its row on the Contact page),
// so the live site never shows a dead link.
document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.dataset.link;
  const value = key === "email" ? emailAddr() : SITE[key];
  if (!value) {
    el.hidden = true;
    const row = el.closest("[data-row]");
    if (row) row.hidden = true;
    return;
  }
  if (key === "email") {
    // The real address only exists for the moment of the click.
    el.href = "#";
    el.setAttribute("aria-label", "Email Jacky: " + emailShown());
    if (el.dataset.showValue !== undefined) el.textContent = emailShown();
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mailto:" + emailAddr();
    });
  } else {
    el.href = value;
    if (/^https?:/.test(value)) {
      el.target = "_blank";
      el.rel = "noopener";
    }
  }
});

// ---------- Timecode: HH:MM:SS:FF at 24 fps. The hour is the page's scene number. ----------
const tcEl = document.querySelector("[data-timecode]");
if (tcEl) {
  const hour = String(document.body.dataset.scene || "01").padStart(2, "0");
  const pad = (n) => String(n).padStart(2, "0");
  const start = performance.now();
  let last = -1;
  const tick = (now) => {
    const f = Math.floor(((now - start) / 1000) * 24);
    if (f !== last) {
      last = f;
      tcEl.textContent =
        hour + ":" + pad(Math.floor(f / 1440) % 60) + ":" + pad(Math.floor(f / 24) % 60) + ":" + pad(f % 24);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---------- Phones: the top bar is fixed, so reserve its exact height ----------
const hudTop = document.querySelector(".hud-top");
if (hudTop) {
  const setHud = () => document.documentElement.style.setProperty("--hud-h", hudTop.offsetHeight + "px");
  setHud();
  if ("ResizeObserver" in window) new ResizeObserver(setHud).observe(hudTop);
  else window.addEventListener("resize", setHud);
}

// ---------- Scroll playhead: red bar on the top bar's bottom edge ----------
// Uses the layout viewport height (stable while iOS Safari's toolbars slide in and out)
// and clamps to 0..1, so the bar never jumps during toolbar changes or overscroll bounce.
const playhead = document.querySelector(".playhead");
if (playhead) {
  let queued = false;
  const update = () => {
    queued = false;
    const doc = document.documentElement;
    const range = doc.scrollHeight - doc.clientHeight;
    const y = window.scrollY;
    let p = range > 4 ? y / range : 0;
    if (y + window.innerHeight >= doc.scrollHeight - 2) p = range > 4 ? 1 : 0;
    playhead.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  window.addEventListener("load", queue);
  update();
}

// ---------- Contact form ----------
const form = document.querySelector("[data-contact-form]");
if (form) {
  const status = form.querySelector("[data-form-status]");
  const label = form.querySelector("[data-take-label]");
  const button = form.querySelector("button[type=submit]");
  const btnLabel = form.querySelector("[data-btn-label]");

  if (!SITE.formspree && !emailAddr()) {
    // Nothing to send to yet: hide the form rather than show one that can't work.
    form.hidden = true;
  }

  const setState = (state, text, tone, html) => {
    form.dataset.state = state;
    label.textContent = { idle: "Standby", sending: "Rec", sent: "Saved", error: "Standby" }[state];
    status.dataset.tone = tone || "";
    if (html) status.innerHTML = html;
    else status.textContent = text || "";
  };

  const fields = ["name", "email", "message"].map((n) => form.elements[n]);
  fields.forEach((f) => f.addEventListener("input", () => f.removeAttribute("aria-invalid")));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bad = fields.filter((f) => !f.checkValidity());
    fields.forEach((f) => f.setAttribute("aria-invalid", bad.includes(f) ? "true" : "false"));
    if (bad.length) {
      setState("error", "Missing a line — add your name, a valid email, and a message.", "error");
      bad[0].focus();
      return;
    }
    if (form.elements._gotcha.value) return; // bot

    const data = new FormData(form);

    // No form service yet: open the visitor's email app with everything filled in.
    if (!SITE.formspree) {
      const subject = data.get("topic") + " — from " + data.get("name");
      const body = data.get("message") + "\n\n— " + data.get("name") + " (" + data.get("email") + ")";
      window.location.href =
        "mailto:" + emailAddr() + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setState("idle", "Opening your email app…", "ok");
      return;
    }

    button.disabled = true;
    btnLabel.textContent = "Rolling…";
    setState("sending", "Sending…");
    try {
      data.append("_subject", data.get("topic") + " — jackyhli.com");
      const res = await fetch(SITE.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        // Formspree explains what went wrong, e.g. {"errors":[{"field":"email","message":"should be an email"}]}
        let reason = "";
        try {
          const body = await res.json();
          if (body && Array.isArray(body.errors) && body.errors.length) {
            reason = body.errors.map((er) => (er.field ? er.field + " " : "") + er.message).join(". ");
            body.errors.forEach((er) => {
              if (er.field && form.elements[er.field]) form.elements[er.field].setAttribute("aria-invalid", "true");
            });
          }
        } catch (_) {}
        throw new Error(reason);
      }
      form.reset();
      setState("sent", "That's a take. Thanks — I'll get back to you soon.", "ok");
      btnLabel.textContent = "Sent";
    } catch (err) {
      const fallback = emailAddr()
        ? ' Email me directly at <a href="mailto:' + emailAddr() + '">' + emailShown() + "</a>."
        : "";
      const why = err && err.message ? " (" + err.message.replace(/[<>&]/g, "") + ")" : "";
      setState("error", "", "error", "That didn't go through" + why + "." + fallback);
      btnLabel.textContent = "Roll — send message";
    } finally {
      button.disabled = false;
    }
  });
}

// ---------- Videos (dailies) ----------
const DAILY_LIST =
  typeof DAILIES !== "undefined" && Array.isArray(DAILIES) ? DAILIES.filter((d) => d && (d.url || d.video || d.image) && d.title) : [];
const hasDailies = DAILY_LIST.length > 0;
document.querySelectorAll("[data-needs-dailies]").forEach((el) => { if (!hasDailies) el.hidden = true; });
document.querySelectorAll("[data-needs-no-dailies]").forEach((el) => { if (hasDailies) el.hidden = true; });

const longList = document.querySelector("[data-dailies-long-list]");
const shortList = document.querySelector("[data-dailies-short-list]");
if (longList && shortList) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const PLATFORM_LABEL = { youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", vimeo: "Vimeo", drive: "Original", file: "Original", image: "Still", link: "Link" };

  const youtubeId = (u) => {
    const m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  };
  const vimeoId = (u) => {
    const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : null;
  };
  const driveId = (u) => {
    const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]{20,})/);
    return m ? m[1] : null;
  };
  const ratioOf = (a) => {
    const m = /^(\d+(?:\.\d+)?)\s*[:x/]\s*(\d+(?:\.\d+)?)$/.exec(String(a || "").trim());
    return m ? Number(m[1]) / Number(m[2]) : null;
  };
  const platformOf = (u) =>
    /drive\.google\.com/.test(u) ? "drive"
    : /youtube\.com|youtu\.be/.test(u) ? "youtube"
    : /instagram\.com/.test(u) ? "instagram"
    : /tiktok\.com/.test(u) ? "tiktok"
    : /vimeo\.com/.test(u) ? "vimeo"
    : "link";
  const prettyDate = (s) => {
    const m = /^(\d{4})(?:-(\d{2}))?/.exec(String(s || ""));
    if (!m) return "";
    return m[2] ? MONTHS[Number(m[2]) - 1] + " " + m[1] : m[1];
  };
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };

  // Player dialog
  const dialog = document.querySelector("[data-screening]");
  const frame = document.querySelector("[data-screening-frame]");
  const dTitle = document.querySelector("[data-screening-title]");
  // kind: "embed" (YouTube/Vimeo/Drive iframe), "video" (a file on this site) or "image"
  const openPlayer = (kind, src, title, ratio, poster) => {
    frame.innerHTML = "";
    dialog.style.setProperty("--ar", ratio);
    let el;
    if (kind === "video") {
      el = document.createElement("video");
      el.src = src;
      if (poster) el.poster = poster;
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
      el.preload = "auto";
    } else if (kind === "image") {
      el = document.createElement("img");
      el.src = src;
      el.alt = title;
    } else {
      el = document.createElement("iframe");
      el.src = src;
      el.title = title;
      el.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      el.allowFullscreen = true;
    }
    frame.appendChild(el);
    dTitle.textContent = title;
    dialog.showModal();
    // pause the silent previews while the player is open
    document.querySelectorAll("video.daily-loop").forEach((v) => v.pause());
  };
  dialog.addEventListener("close", () => {
    frame.innerHTML = "";
    document.querySelectorAll("video.daily-loop[data-inview]").forEach((v) => v.play().catch(() => {}));
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  document.querySelector("[data-screening-close]").addEventListener("click", () => dialog.close());

  let longCount = 0;
  let shortCount = 0;
  // Silent looping previews: play only while on screen
  const loopIO = "IntersectionObserver" in window && !REDUCED
    ? new IntersectionObserver((entries) => entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          v.dataset.inview = "";
          if (v.preload === "none") v.preload = "auto";
          if (!dialog.open) v.play().catch(() => {});
        } else {
          delete v.dataset.inview;
          v.pause();
        }
      }), { rootMargin: "120px 0px", threshold: 0.25 })
    : null;

  DAILY_LIST.forEach((d, i) => {
    const platform = d.video ? "file" : d.image ? "image" : platformOf(d.url);
    const yt = platform === "youtube" ? youtubeId(d.url) : null;
    const vm = platform === "vimeo" ? vimeoId(d.url) : null;
    const dr = platform === "drive" ? driveId(d.url) : null;
    const given = ratioOf(d.aspect);
    const isShort = d.format
      ? d.format === "short"
      : given ? given < 1.2
      : platform === "instagram" || platform === "tiktok" || /\/shorts\//.test(d.url);
    const ratio = given || (isShort ? 9 / 16 : 16 / 9);

    const card = make("a", "daily " + (isShort ? "daily--short" : "daily--long"));
    card.style.setProperty("--ar", ratio.toFixed(4));
    if (/^still$/i.test(d.source || "")) card.classList.add("daily--still");
    card.href = d.video || d.image || d.url;
    card.target = "_blank";
    card.rel = "noopener";

    const thumb = make("span", "daily-thumb");
    const placeholder = () => {
      const ph = make("span", "daily-ph");
      ph.appendChild(make("span", "daily-ph-name", d.source || PLATFORM_LABEL[platform]));
      return ph;
    };
    const src =
      d.thumb || d.poster || (d.image && !d.video ? d.image : "") ||
      (yt ? "https://i.ytimg.com/vi/" + yt + "/hqdefault.jpg"
        : dr ? "https://lh3.googleusercontent.com/d/" + dr + "=w" + (isShort ? 600 : 960)
        : "");
    if (d.video) {
      // a file on this site: a silent, looping preview right in the card
      const v = make("video", "daily-loop");
      v.muted = true;
      v.defaultMuted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("muted", "");
      v.preload = "none";
      if (src) v.poster = src;
      v.src = d.preview || d.video;
      v.setAttribute("aria-hidden", "true");
      thumb.appendChild(v);
      if (loopIO) loopIO.observe(v);
    } else if (src) {
      const img = make("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("error", () => img.replaceWith(placeholder()));
      thumb.appendChild(img);
    } else {
      thumb.appendChild(placeholder());
    }
    thumb.appendChild(make("span", "daily-id", "B001_C" + String(i + 1).padStart(3, "0")));
    thumb.appendChild(make("span", "daily-plat", d.source || PLATFORM_LABEL[platform]));
    const play = make("span", "daily-play");
    play.setAttribute("aria-hidden", "true");
    thumb.appendChild(play);
    card.appendChild(thumb);

    const meta = make("span", "daily-meta");
    const bits = [d.tag, d.credit, prettyDate(d.date)].filter(Boolean).join(" · ");
    if (bits) meta.appendChild(make("span", "label", bits));
    meta.appendChild(make("span", "daily-title", d.title));
    card.appendChild(meta);

    const embed = d.video || d.image ? null : yt
      ? "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0"
      : vm ? "https://player.vimeo.com/video/" + vm + "?autoplay=1"
      : dr ? "https://drive.google.com/file/d/" + dr + "/preview"
      : null;
    const kind = d.video ? "video" : d.image ? "image" : embed ? "embed" : null;
    if (kind) {
      card.setAttribute("aria-label", (kind === "image" ? "View " : "Play ") + d.title);
      card.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab clicks through
        e.preventDefault();
        openPlayer(kind, d.video || d.image || embed, d.title, ratio.toFixed(4), src);
      });
    } else {
      card.setAttribute("aria-label", d.title + " (opens in a new tab)");
    }

    (isShort ? shortList : longList).appendChild(card);
    if (isShort) shortCount++; else longCount++;
  });

  document.querySelector("[data-dailies-long]").hidden = longCount === 0;
  document.querySelector("[data-dailies-short]").hidden = shortCount === 0;
  document.querySelector("[data-dailies-empty]").hidden = hasDailies;
  const count = document.querySelector("[data-dailies-count]");
  if (count) count.textContent = String(DAILY_LIST.length).padStart(2, "0");
}

// ---------- Home stage: cursor light, autofocus reticle, lens aberration (mouse only) ----------
const stage = document.querySelector("[data-stage]");
if (stage && !REDUCED && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const reticle = stage.querySelector("[data-reticle]");
  const rLabel = stage.querySelector("[data-reticle-label]");
  const spot = stage.querySelector("[data-spot]");
  const title = stage.querySelector("h1");
  let rect = stage.getBoundingClientRect();
  let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, raf = 0, locked = false;

  const frame = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    const px = x * rect.width, py = y * rect.height;
    reticle.style.transform = "translate3d(" + (px - 36) + "px," + (py - 36) + "px,0)";
    spot.style.transform = "translate3d(" + (px - 320) + "px," + (py - 320) + "px,0)";
    const dx = (x - 0.5) * 2, dy = (y - 0.5) * 2;
    title.style.transform = "translate3d(" + (-dx * 12).toFixed(1) + "px," + (-dy * 7).toFixed(1) + "px,0)";
    title.style.setProperty("--ab", ((dx < 0 ? -1 : 1) * (1.5 + Math.abs(dx) * 5)).toFixed(2) + "px");
    rLabel.textContent = (locked ? "Focus lock" : "AF-C") + " · " + x.toFixed(2) + ", " + y.toFixed(2);
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0008 ? requestAnimationFrame(frame) : 0;
  };
  stage.addEventListener("pointermove", (e) => {
    rect = stage.getBoundingClientRect();
    tx = (e.clientX - rect.left) / rect.width;
    ty = (e.clientY - rect.top) / rect.height;
    locked = !!e.target.closest("h1");
    reticle.classList.toggle("is-locked", locked);
    stage.classList.add("is-tracking");
    if (!raf) raf = requestAnimationFrame(frame);
  });
  stage.addEventListener("pointerleave", () => {
    stage.classList.remove("is-tracking");
    tx = 0.5; ty = 0.5;
    if (!raf) raf = requestAnimationFrame(frame);
  });
}

// ---------- Scroll reveals ----------
const revealEls = document.querySelectorAll(
  ".frame, .credit, .laurel, .clip, .sheet-row, .daily, .viewfinder, .logline, .bio-body, .take, .cut, .slate, .section-title, .dailies-empty"
);
revealEls.forEach((el) => {
  el.setAttribute("data-reveal", "");
  const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
  el.style.setProperty("--i", Math.min(i, 6));
});
if ("IntersectionObserver" in window && !REDUCED) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// ---------- Phone menu (scene select) ----------
const menu = document.querySelector("[data-menu]");
const menuBtn = document.querySelector("[data-menu-open]");
if (menu && menuBtn) {
  menuBtn.addEventListener("click", () => {
    menu.showModal();
    menuBtn.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
  menu.querySelector("[data-menu-close]").addEventListener("click", () => menu.close());
  menu.addEventListener("click", (e) => { if (e.target === menu) menu.close(); });
  // If the window grows past phone size, the regular nav takes over.
  window.matchMedia("(min-width: 721px)").addEventListener("change", (e) => { if (e.matches && menu.open) menu.close(); });
}

// ---------- Film-term definitions under page titles: tap to open on phones ----------
document.querySelectorAll(".term").forEach((term) => {
  term.addEventListener("click", (e) => {
    e.stopPropagation();
    term.classList.toggle("open");
  });
  term.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); term.classList.toggle("open"); }
    if (e.key === "Escape") { term.classList.remove("open"); term.blur(); }
  });
});
document.addEventListener("click", () => document.querySelectorAll(".term.open").forEach((t) => t.classList.remove("open")));

// ---------- About page: as many stills as fit beside the bio ----------
const stillsCol = document.querySelector("[data-stills]");
if (stillsCol) {
  const list = typeof PHOTOS !== "undefined" && Array.isArray(PHOTOS)
    ? PHOTOS.filter((p) => p && p.src && p.width && p.height) : [];
  const bio = document.querySelector(".about-grid .bio");
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };
  const DEFAULTS = {
    af: ["F2.0", "1/50", "AF-C"],
    letterbox: ["T2.0", "1/48", "ISO 800"],
    histogram: ["F5.6", "1/250", "ISO 200"],
    grid: ["F2.8", "1/125", "ISO 640"],
  };
  const TAGS = { af: "AF-C · Face", letterbox: "● Rec", histogram: "Exposure", grid: "Level 0.0°" };

  const stills = list.map((p, i) => {
    const n = i + 2;
    const kind = DEFAULTS[p.overlay] ? p.overlay : "grid";
    const fig = make("figure", "still still--" + kind);
    fig.hidden = true;
    fig.dataset.ar = String(p.width / p.height);
    fig.dataset.wf = n % 2 === 0 ? "0.86" : "1";

    const vf = make("div", "viewfinder");
    vf.style.aspectRatio = p.width + " / " + p.height;
    const img = make("img");
    img.dataset.src = p.src;
    img.alt = p.alt || "";
    img.width = p.width;
    img.height = p.height;
    img.decoding = "async";
    vf.appendChild(img);

    const deco = make("div", "still-overlay");
    deco.setAttribute("aria-hidden", "true");
    if (kind === "af") {
      deco.innerHTML = '<div class="corners corners--sm"><span></span><span></span><span></span><span></span></div><div class="focus-box"></div>';
      const fb = deco.querySelector(".focus-box");
      const f = Array.isArray(p.focus) ? p.focus : [50, 35];
      fb.style.left = f[0] + "%";
      fb.style.top = f[1] + "%";
      fb.style.width = "26%";
    } else if (kind === "letterbox") {
      deco.innerHTML = '<div class="lb lb--top"></div><div class="lb lb--bot"></div>';
    } else if (kind === "histogram") {
      deco.innerHTML = '<svg class="histo" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 40 L0 34 C8 30 12 18 20 20 S32 6 40 12 S52 26 60 18 S74 4 82 14 S94 30 100 32 L100 40 Z"/></svg>';
    } else {
      deco.innerHTML = '<div class="thirds-sm"></div><div class="level"></div>';
    }
    const tag = make("span", "vf-tag", TAGS[kind]);
    const bar = make("span", "vf-bar");
    (Array.isArray(p.settings) && p.settings.length ? p.settings : DEFAULTS[kind])
      .slice(0, 3).forEach((t) => bar.appendChild(make("span", "", t)));
    deco.append(tag, bar);
    vf.appendChild(deco);

    const cap = make("figcaption", "still-cap");
    cap.append(make("span", "", "Still " + String(n).padStart(2, "0")), make("span", "", p.caption || ""));
    fig.append(vf, cap);
    stillsCol.appendChild(fig);
    return fig;
  });

  const sheet = document.querySelector("[data-sheet]");
  const sheetGrid = document.querySelector("[data-sheet-grid]");
  const reveal = (fig) => {
    const img = fig.querySelector("img");
    if (!img.getAttribute("src")) {
      img.loading = "lazy";
      img.src = img.dataset.src;
    }
    if (fig.hidden) {
      fig.hidden = false;
      fig.classList.add("is-new");
    }
  };
  const fit = () => {
    if (!stills.length || !bio) return;
    const a = stillsCol.getBoundingClientRect();
    const b = bio.getBoundingClientRect();
    const sideBySide = a.right <= b.left + 1 && Math.abs(a.top - b.top) < 40;
    const gap = parseFloat(getComputedStyle(stillsCol).rowGap) || 0;
    const colW = stillsCol.clientWidth;
    let used = stillsCol.firstElementChild.offsetHeight;
    const room = sideBySide ? bio.offsetHeight : 0;
    let overflow = false;
    stills.forEach((fig) => {
      const h = (colW * Number(fig.dataset.wf)) / Number(fig.dataset.ar) + 40 + gap;
      if (!overflow && used + h <= room + 24) {
        used += h;
        fig.style.width = Number(fig.dataset.wf) * 100 + "%";
        if (fig.parentElement !== stillsCol) stillsCol.appendChild(fig);
      } else {
        overflow = true; // keep the order: everything after the first misfit goes to the sheet
        fig.style.width = "";
        if (fig.parentElement !== sheetGrid && sheetGrid) sheetGrid.appendChild(fig);
      }
      reveal(fig);
    });
    if (sheet) sheet.hidden = !sheetGrid || sheetGrid.children.length === 0;
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fit(); });
  };
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(schedule);
    if (bio) ro.observe(bio);
    ro.observe(stillsCol.parentElement);
  } else {
    window.addEventListener("resize", schedule);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
}

// Load the other camera angles once the page has finished loading and the browser is idle
window.addEventListener("load", () => {
  const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
  later(() => document.querySelectorAll("img.cam[data-src]").forEach((img) => {
    if (!img.getAttribute("src")) img.src = img.dataset.src;
  }));
});

// ---------- Projects: camera angles (thumbnail strip, arrows, swipe, tap) ----------
document.querySelectorAll(".cam-switch").forEach((sw) => {
  const media = sw.closest(".feature-media");
  const frame = media.querySelector("[data-cams]");
  const cams = [...frame.querySelectorAll("[data-cam]")];
  const btns = [...sw.querySelectorAll("[data-cam-btn]")];
  const counter = frame.querySelector("[data-cam-i]");
  let cur = 0;
  const load = (img) => { if (img.dataset.src && !img.getAttribute("src")) img.src = img.dataset.src; };
  const show = (i) => {
    cur = (i + cams.length) % cams.length;
    load(cams[cur]);
    cams.forEach((c, k) => c.classList.toggle("is-on", k === cur));
    btns.forEach((b, k) => {
      b.classList.toggle("is-on", k === cur);
      b.setAttribute("aria-pressed", String(k === cur));
    });
    if (counter) counter.textContent = String(cur + 1);
  };
  btns.forEach((b, k) => b.addEventListener("click", () => show(k)));
  frame.querySelectorAll("[data-cam-step]").forEach((b) =>
    b.addEventListener("click", (e) => { e.stopPropagation(); show(cur + Number(b.dataset.camStep)); }));
  frame.addEventListener("click", () => show(cur + 1));
  let x0 = null, y0 = null;
  frame.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  frame.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
});
