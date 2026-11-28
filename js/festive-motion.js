(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = window.innerWidth < 768;

  // 1. Default Dark Mode + Holiday FX Preference ("on" by default)
  let fxEnabled = localStorage.getItem("aero_ny_fx") !== "off";
  root.setAttribute("data-ny-fx", fxEnabled ? "on" : "off");

  function syncFxButtons() {
    document.querySelectorAll(".ny-fx-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", fxEnabled ? "true" : "false");
    });
  }

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".ny-fx-toggle");
    if (!toggle) return;
    fxEnabled = !fxEnabled;
    localStorage.setItem("aero_ny_fx", fxEnabled ? "on" : "off");
    root.setAttribute("data-ny-fx", fxEnabled ? "on" : "off");
    syncFxButtons();
    if (fxEnabled && !reducedMotion) startSnowLoop();
  });
  syncFxButtons();

  // 2. Santa Cap ("Qalpoqcha") on Top-Left Brand Logo
  const SANTA_SVG = `<svg class="aero-santa-cap" viewBox="0 0 64 52" fill="none" aria-hidden="true">
    <path d="M12 36C13 17 26 5 46 8C53 9 58 14 57 20C52 17 44 17 38 22C34 26 37 32 41 36H12Z" fill="#DC2626"/>
    <path d="M12 36C16 24 27 14 41 11C34 15 26 24 23 36H12Z" fill="#EF4444"/>
    <rect x="7" y="34" width="38" height="10" rx="5" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
    <circle cx="56" cy="20" r="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  </svg>`;

  document.querySelectorAll(".brand-logo, .tv-brand-logo").forEach((el) => {
    if (!el.querySelector(".aero-santa-cap")) {
      el.insertAdjacentHTML("beforeend", SANTA_SVG);
    }
  });

  // 3. Top Reading Progress Rail
  let scrollBar = document.getElementById("aero-scroll-bar");
  if (!scrollBar) {
    scrollBar = document.createElement("div");
    scrollBar.id = "aero-scroll-bar";
    scrollBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(scrollBar);
  }

  function updateScrollBar() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    scrollBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });
  window.addEventListener("resize", updateScrollBar, { passive: true });
  updateScrollBar();

  // 4. Feather-Light Sprite-Cached Snowfall (auto-paused when TV video plays!)
  let snowCanvas = document.getElementById("aero-snow-canvas");
  if (!snowCanvas) {
    snowCanvas = document.createElement("canvas");
    snowCanvas.id = "aero-snow-canvas";
    snowCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(snowCanvas);
  }

  const sCtx = snowCanvas.getContext("2d");
  const tvVideo = document.getElementById("tv-video");
  let sWidth = 0;
  let sHeight = 0;
  let flakes = [];
  let snowRaf = 0;
  let lastSnowDraw = 0;
  let sprites = [];
  let burstParticles = [];
  let tickTime = 0;

  function makeSprite(type, isGold, isLight) {
    const c = document.createElement("canvas");
    c.width = 24;
    c.height = 24;
    const g = c.getContext("2d");
    const col = isGold
      ? isLight ? "217, 119, 6" : "253, 230, 138"
      : isLight ? "14, 165, 233" : "224, 242, 254";
    if (type === 0) {
      g.fillStyle = `rgba(${col}, 0.65)`;
      g.beginPath();
      g.arc(12, 12, 2.1, 0, Math.PI * 2);
      g.fill();
    } else if (type === 1) {
      g.strokeStyle = `rgba(${col}, 0.72)`;
      g.lineWidth = 1.25;
      g.lineCap = "round";
      g.translate(12, 12);
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI) / 3;
        const cx = Math.cos(a) * 5.4;
        const sy = Math.sin(a) * 5.4;
        g.beginPath();
        g.moveTo(-cx, -sy);
        g.lineTo(cx, sy);
        g.stroke();
      }
    } else {
      const grad = g.createRadialGradient(12, 12, 0, 12, 12, 9);
      grad.addColorStop(0, `rgba(${col}, 0.55)`);
      grad.addColorStop(1, `rgba(${col}, 0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(12, 12, 9, 0, Math.PI * 2);
      g.fill();
    }
    return c;
  }

  function rebuildSprites() {
    const isLight = root.getAttribute("data-theme") === "light";
    sprites = [
      makeSprite(0, false, isLight),
      makeSprite(1, false, isLight),
      makeSprite(2, true, isLight),
    ];
  }

  function spawnFlake(randomY) {
    const r = Math.random();
    const sIdx = r < 0.55 ? 0 : r < 0.85 ? 1 : 2;
    return {
      sIdx,
      x: Math.random() * (sWidth || window.innerWidth),
      y: randomY ? Math.random() * (sHeight || window.innerHeight) : -24,
      vy: sIdx === 0 ? 0.45 + Math.random() * 0.4 : sIdx === 1 ? 0.7 + Math.random() * 0.5 : 0.95 + Math.random() * 0.5,
      vx: (Math.random() - 0.35) * 0.25,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function isTvVideoPlaying() {
    if (!tvVideo) return false;
    const playing = !tvVideo.paused && !tvVideo.ended;
    document.body.classList.toggle("is-tv-playing", playing);
    return playing;
  }

  if (tvVideo) {
    tvVideo.addEventListener("playing", () => {
      document.body.classList.add("is-tv-playing");
      if (snowRaf) {
        cancelAnimationFrame(snowRaf);
        snowRaf = 0;
      }
      sCtx?.clearRect(0, 0, sWidth, sHeight);
    });
    tvVideo.addEventListener("pause", () => {
      document.body.classList.remove("is-tv-playing");
      startSnowLoop();
    });
  }

  function resizeSnow() {
    sWidth = window.innerWidth;
    sHeight = window.innerHeight;
    snowCanvas.width = sWidth;
    snowCanvas.height = sHeight;
    const count = sWidth < 768 ? 14 : 28;
    flakes = Array.from({ length: count }, () => spawnFlake(true));
    rebuildSprites();
  }

  function renderSnowFrame(now) {
    snowRaf = 0;
    if (!fxEnabled || reducedMotion || document.hidden || !sCtx || isTvVideoPlaying()) return;

    const minFrameMs = sWidth < 768 ? 33 : 16;
    if (now - lastSnowDraw < minFrameMs) {
      snowRaf = requestAnimationFrame(renderSnowFrame);
      return;
    }
    lastSnowDraw = now;
    tickTime += 0.02;

    sCtx.clearRect(0, 0, sWidth, sHeight);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const wind = Math.sin(tickTime + f.phase) * 0.25;
      f.x += f.vx + wind;
      f.y += f.vy;
      if (f.y > sHeight + 24) {
        flakes[i] = spawnFlake(false);
        continue;
      }
      if (f.x > sWidth + 24) f.x = -20;
      else if (f.x < -24) f.x = sWidth + 20;
      sCtx.drawImage(sprites[f.sIdx], (f.x - 12) | 0, (f.y - 12) | 0);
    }

    if (burstParticles.length > 0) {
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.vy += 0.07;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        if (p.life <= 0) {
          burstParticles.splice(i, 1);
        } else {
          sCtx.globalAlpha = Math.max(0, p.life);
          sCtx.drawImage(sprites[2], (p.x - 12) | 0, (p.y - 12) | 0);
          sCtx.globalAlpha = 1;
        }
      }
    }

    snowRaf = requestAnimationFrame(renderSnowFrame);
  }

  function startSnowLoop() {
    if (!snowRaf && fxEnabled && !reducedMotion && !document.hidden && !isTvVideoPlaying()) {
      snowRaf = requestAnimationFrame(renderSnowFrame);
    }
  }

  function trigger2027Burst() {
    if (reducedMotion || isTvVideoPlaying()) return;
    const cx = sWidth * 0.5;
    const cy = Math.min(260, sHeight * 0.35);
    burstParticles = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const spd = 2.2 + Math.random() * 4.2;
      return { x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 2, life: 1 };
    });
    startSnowLoop();
  }

  new MutationObserver(() => rebuildSprites()).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", resizeSnow, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startSnowLoop();
  });
  resizeSnow();
  startSnowLoop();

  // 5. Event-Driven Holiday Garland Physics (0% idle RAF cost!)
  const BULB_COLORS = ["#F59E0B", "#38BDF8", "#10B981", "#F43F5E", "#FDE68A"];
  const bulbSprings = [];
  let bulbRaf = 0;
  let bulbWakeUntil = 0;

  function wakeBulbs(ms) {
    if (reducedMotion) return;
    bulbWakeUntil = Math.max(bulbWakeUntil, performance.now() + ms);
    if (!bulbRaf) bulbRaf = requestAnimationFrame(tickBulbs);
  }

  function tickBulbs(now) {
    bulbRaf = 0;
    if (!fxEnabled || document.hidden || now > bulbWakeUntil) return;
    for (let i = 0; i < bulbSprings.length; i++) {
      const b = bulbSprings[i];
      b.vel = (b.vel - 0.08 * b.angle) * 0.9;
      b.angle += b.vel;
      b.el.style.transform = `rotate(${b.angle.toFixed(2)}deg)`;
    }
    bulbRaf = requestAnimationFrame(tickBulbs);
  }

  document.querySelectorAll(".ny-garland-slot").forEach((slot) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1200 64");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("ny-garland-svg");

    const count = 15;
    const step = 1200 / (count + 1);
    let pathD = "M 0 6 ";
    const anchors = [];

    for (let i = 1; i <= count; i++) {
      const x = i * step;
      const sag = 10 + Math.sin((i / (count + 1)) * Math.PI) * 12;
      const midX = ((i - 1) * step + x) / 2;
      pathD += `Q ${midX} ${sag + 5} ${x} ${sag} `;
      anchors.push({ x, y: sag });
    }
    pathD += "Q 1166 16 1200 6";

    const wire = document.createElementNS(svgNS, "path");
    wire.setAttribute("d", pathD);
    wire.classList.add("ny-wire");
    svg.appendChild(wire);

    anchors.forEach((pt, idx) => {
      const g = document.createElementNS(svgNS, "g");
      g.classList.add("ny-bulb-group");
      const color = BULB_COLORS[idx % BULB_COLORS.length];
      g.style.color = color;

      const cap = document.createElementNS(svgNS, "rect");
      cap.setAttribute("x", pt.x - 2.4);
      cap.setAttribute("y", pt.y);
      cap.setAttribute("width", "4.8");
      cap.setAttribute("height", "4.2");
      cap.setAttribute("rx", "1");
      cap.setAttribute("fill", "#64748B");

      const bulb = document.createElementNS(svgNS, "ellipse");
      bulb.setAttribute("cx", pt.x);
      bulb.setAttribute("cy", pt.y + 11);
      bulb.setAttribute("rx", "4.2");
      bulb.setAttribute("ry", "6.4");
      bulb.setAttribute("fill", color);
      bulb.classList.add("ny-bulb-core");

      g.append(cap, bulb);
      svg.appendChild(g);

      const spring = { el: g, angle: 0, vel: 0 };
      bulbSprings.push(spring);

      g.addEventListener("pointerenter", () => {
        spring.vel += (Math.random() > 0.5 ? 1 : -1) * 5;
        g.classList.add("is-Lit");
        setTimeout(() => g.classList.remove("is-Lit"), 650);
        wakeBulbs(2200);
      });

      g.addEventListener("click", () => {
        wakeBulbs(2400);
        bulbSprings.forEach((b, bIdx) => {
          setTimeout(() => {
            b.vel += (bIdx % 2 === 0 ? 1 : -1) * 4.5;
            b.el.classList.add("is-Lit");
            setTimeout(() => b.el.classList.remove("is-Lit"), 500);
          }, Math.abs(bIdx - idx) * 32);
        });
      });
    });

    slot.appendChild(svg);
  });

  // 6. Lightweight 3D Card Tilt & Magnetic Buttons (Fine-pointer Desktop Only)
  if (finePointer && !reducedMotion && !isMobile) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 4.2;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 5.2;
        card.style.transform = `perspective(920px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // 7. Smooth Grid Accordions
  document.querySelectorAll(".faq-acc-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-acc-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // 8. Uzbekistan Time (UTC+5) 2027 Countdown & 00:00 Automatic Era Upgrade
  // 2027-01-01 00:00:00 UZT (UTC+5) === 2026-12-31 19:00:00 UTC
  const TARGET_2027_UTC = Date.UTC(2026, 11, 31, 19, 0, 0);
  const CD_I18N = {
    uz: {
      pre_title: "Toshkent 00:00 • 2027 & Yangi Update’gacha",
      pre_sub: "00:00 bo‘lganda sayt avtomatik 2027 rejimiga yangilanadi",
      live_title: "2027-Yil Kirib Keldi! • Yangi Update Faol",
      live_sub: "Toshkent vaqti bilan 00:00 avtomatik yangilanish ishga tushdi",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "KUN", h: "SOAT", m: "DAQ", s: "SON",
    },
    ru: {
      pre_title: "Ташкент 00:00 • До 2027 и Авто-Update",
      pre_sub: "В 00:00 сайт автоматически перейдёт в режим 2027 года",
      live_title: "С Новым 2027 Годом! • Обновление Активно",
      live_sub: "Новогодний режим 2027 активирован автоматически в 00:00",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "ДНИ", h: "ЧАС", m: "МИН", s: "СЕК",
    },
    en: {
      pre_title: "Tashkent 00:00 • 2027 Auto-Update Countdown",
      pre_sub: "Site and holiday mode automatically upgrade at 00:00 UZT",
      live_title: "Happy New Year 2027! • New Update Live",
      live_sub: "Automatic 00:00 Uzbekistan time 2027 upgrade is now active",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "DAYS", h: "HRS", m: "MIN", s: "SEC",
    },
  };

  function getLangPack() {
    const l = (root.getAttribute("lang") || "uz").slice(0, 2);
    return CD_I18N[l] || CD_I18N.uz;
  }

  let hasTriggeredArrival = false;
  let prevVals = {};
  const cdMounts = Array.from(document.querySelectorAll("[data-ny-countdown]"));

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function renderCountdown(isArrivedNow, dStr, hStr, mStr, sStr) {
    const tr = getLangPack();
    cdMounts.forEach((mount) => {
      let bar = mount.querySelector(".ny-countdown-bar");
      if (!bar || bar.dataset.mode !== (isArrivedNow ? "live" : "pre") || bar.dataset.lang !== root.getAttribute("lang")) {
        mount.innerHTML = isArrivedNow
          ? `<div class="ny-countdown-bar is-arrived" data-mode="live" data-lang="${root.getAttribute("lang") || "uz"}">
              <div class="ny-cd-meta">
                <div class="ny-cd-title-row"><span class="ny-cd-dot"></span><span>${tr.live_title}</span></div>
                <span class="ny-cd-sub">${tr.live_sub}</span>
              </div>
              <div class="ny-arrived-badge">${tr.live_badge}</div>
            </div>`
          : `<div class="ny-countdown-bar" data-mode="pre" data-lang="${root.getAttribute("lang") || "uz"}">
              <div class="ny-cd-meta">
                <div class="ny-cd-title-row"><span class="ny-cd-dot"></span><span>${tr.pre_title}</span></div>
                <span class="ny-cd-sub">${tr.pre_sub}</span>
              </div>
              <div class="ny-cd-tiles">
                <div class="ny-cd-unit" data-u="d"><strong class="ny-cd-val">${dStr}</strong><small class="ny-cd-lbl">${tr.d}</small></div>
                <div class="ny-cd-unit" data-u="h"><strong class="ny-cd-val">${hStr}</strong><small class="ny-cd-lbl">${tr.h}</small></div>
                <div class="ny-cd-unit" data-u="m"><strong class="ny-cd-val">${mStr}</strong><small class="ny-cd-lbl">${tr.m}</small></div>
                <div class="ny-cd-unit" data-u="s"><strong class="ny-cd-val">${sStr}</strong><small class="ny-cd-lbl">${tr.s}</small></div>
              </div>
            </div>`;
        return;
      }

      if (!isArrivedNow) {
        const nextMap = { d: dStr, h: hStr, m: mStr, s: sStr };
        ["d", "h", "m", "s"].forEach((k) => {
          const unit = bar.querySelector(`.ny-cd-unit[data-u="${k}"]`);
          const valEl = unit?.querySelector(".ny-cd-val");
          if (valEl && valEl.textContent !== nextMap[k]) {
            valEl.textContent = nextMap[k];
            unit.classList.remove("is-tick");
            void unit.offsetWidth;
            unit.classList.add("is-tick");
          }
        });
      }
    });
  }

  function tick2027Clock() {
    const force2027 = window.location.search.includes("ny2027=1");
    const diffMs = TARGET_2027_UTC - Date.now();
    const arrived = force2027 || diffMs <= 0;

    if (arrived) {
      if (root.getAttribute("data-era") !== "2027-live") {
        root.setAttribute("data-era", "2027-live");
      }
      renderCountdown(true, "00", "00", "00", "00");
      if (!hasTriggeredArrival) {
        hasTriggeredArrival = true;
        trigger2027Burst();
      }
      return;
    }

    const totalSec = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    prevVals = { d: pad2(days), h: pad2(hrs), m: pad2(mins), s: pad2(secs) };
    renderCountdown(false, prevVals.d, prevVals.h, prevVals.m, prevVals.s);
  }

  if (cdMounts.length > 0) {
    tick2027Clock();
    setInterval(tick2027Clock, 1000);
    new MutationObserver(() => tick2027Clock()).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  window.__AERO_FESTIVE__ = {
    syncFxButtons,
    isFxEnabled: () => fxEnabled,
    tick2027Clock,
  };
})();
