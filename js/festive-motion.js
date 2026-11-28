(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // 1. Holiday FX Preference ("on" by default for New Year 2027 season)
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
    if (fxEnabled && !reducedMotion) {
      startSnowLoop();
    }
  });
  syncFxButtons();

  // 2. Top Scroll Progress Rail
  let scrollBar = document.getElementById("aero-scroll-bar");
  if (!scrollBar) {
    scrollBar = document.createElement("div");
    scrollBar.id = "aero-scroll-bar";
    scrollBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(scrollBar);
  }

  function updateScrollBar() {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    scrollBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });
  window.addEventListener("resize", updateScrollBar, { passive: true });
  updateScrollBar();

  // 3. 3-Layer Depth-of-Field Wind-Curled Snowfall + Cursor Wake
  let snowCanvas = document.getElementById("aero-snow-canvas");
  if (!snowCanvas) {
    snowCanvas = document.createElement("canvas");
    snowCanvas.id = "aero-snow-canvas";
    snowCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(snowCanvas);
  }

  const sCtx = snowCanvas.getContext("2d");
  let sWidth = 0;
  let sHeight = 0;
  let flakes = [];
  let snowRaf = 0;
  let pointerX = -999;
  let pointerY = -999;
  let pointerVX = 0;
  let pointerVY = 0;
  let lastPointerX = -999;
  let lastPointerY = -999;
  let tickTime = 0;

  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (e) => {
        if (lastPointerX > -900) {
          pointerVX = Math.max(-18, Math.min(18, e.clientX - lastPointerX));
          pointerVY = Math.max(-18, Math.min(18, e.clientY - lastPointerY));
        }
        lastPointerX = pointerX = e.clientX;
        lastPointerY = pointerY = e.clientY;
      },
      { passive: true }
    );
  }

  function spawnFlake(randomY) {
    const roll = Math.random();
    const layer = roll < 0.56 ? 0 : roll < 0.88 ? 1 : 2; // 0=far dust, 1=crystal, 2=bokeh orb
    const isGold = Math.random() < 0.16;
    return {
      layer,
      isGold,
      x: Math.random() * (sWidth || window.innerWidth),
      y: randomY ? Math.random() * (sHeight || window.innerHeight) : -18 - Math.random() * 40,
      r: layer === 0 ? 1.0 + Math.random() * 1.4 : layer === 1 ? 3.2 + Math.random() * 2.6 : 5.5 + Math.random() * 5.0,
      vy: layer === 0 ? 0.35 + Math.random() * 0.45 : layer === 1 ? 0.65 + Math.random() * 0.6 : 1.05 + Math.random() * 0.75,
      vxBase: (Math.random() - 0.35) * 0.25,
      vxPush: 0,
      vyPush: 0,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.016,
      alpha: layer === 0 ? 0.35 + Math.random() * 0.35 : layer === 1 ? 0.45 + Math.random() * 0.38 : 0.16 + Math.random() * 0.18,
    };
  }

  function resizeSnow() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sWidth = window.innerWidth;
    sHeight = window.innerHeight;
    snowCanvas.width = sWidth * dpr;
    snowCanvas.height = sHeight * dpr;
    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.min(72, Math.max(28, Math.floor((sWidth * sHeight) / 22000)));
    flakes = Array.from({ length: target }, () => spawnFlake(true));
  }

  function drawCrystal(x, y, radius, angle, strokeStyle) {
    sCtx.save();
    sCtx.translate(x, y);
    sCtx.rotate(angle);
    sCtx.strokeStyle = strokeStyle;
    sCtx.lineWidth = 1.1;
    sCtx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3;
      const cos = Math.cos(a) * radius;
      const sin = Math.sin(a) * radius;
      sCtx.beginPath();
      sCtx.moveTo(-cos, -sin);
      sCtx.lineTo(cos, sin);
      sCtx.stroke();
    }
    sCtx.restore();
  }

  function renderSnowFrame() {
    snowRaf = 0;
    if (!fxEnabled || reducedMotion || document.hidden || !sCtx) return;

    tickTime += 0.015;
    pointerVX *= 0.88;
    pointerVY *= 0.88;

    const isLight = root.getAttribute("data-theme") === "light";
    sCtx.clearRect(0, 0, sWidth, sHeight);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // Sinusoidal wind curl
      const wind = Math.sin(tickTime + f.phase + f.y * 0.004) * (0.28 + f.layer * 0.16);

      // Gentle cursor wake deflection
      if (pointerX > -500) {
        const dx = f.x - pointerX;
        const dy = f.y - pointerY;
        const distSq = dx * dx + dy * dy;
        const radius = 115;
        if (distSq < radius * radius && distSq > 4) {
          const force = (1 - Math.sqrt(distSq) / radius) * 0.65;
          f.vxPush += (dx / Math.sqrt(distSq)) * force + pointerVX * 0.018;
          f.vyPush += (dy / Math.sqrt(distSq)) * force * 0.4 + pointerVY * 0.012;
        }
      }

      f.vxPush *= 0.94;
      f.vyPush *= 0.94;
      f.x += f.vxBase + wind + f.vxPush;
      f.y += f.vy + f.vyPush;
      f.rot += f.rotSpeed;

      if (f.y > sHeight + 22) {
        flakes[i] = spawnFlake(false);
        continue;
      }
      if (f.x > sWidth + 24) f.x = -20;
      else if (f.x < -24) f.x = sWidth + 20;

      const baseRgb = f.isGold
        ? isLight ? "217, 119, 6" : "253, 230, 138"
        : isLight ? "14, 165, 233" : "224, 242, 254";

      if (f.layer === 0) {
        sCtx.beginPath();
        sCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(${baseRgb}, ${f.alpha * (isLight ? 0.55 : 0.9)})`;
        sCtx.fill();
      } else if (f.layer === 1) {
        drawCrystal(f.x, f.y, f.r, f.rot, `rgba(${baseRgb}, ${f.alpha * (isLight ? 0.52 : 0.85)})`);
      } else {
        const grad = sCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.4);
        grad.addColorStop(0, `rgba(${baseRgb}, ${f.alpha * (isLight ? 0.45 : 0.9)})`);
        grad.addColorStop(1, `rgba(${baseRgb}, 0)`);
        sCtx.beginPath();
        sCtx.arc(f.x, f.y, f.r * 1.4, 0, Math.PI * 2);
        sCtx.fillStyle = grad;
        sCtx.fill();
      }
    }

    snowRaf = requestAnimationFrame(renderSnowFrame);
  }

  function startSnowLoop() {
    if (!snowRaf && fxEnabled && !reducedMotion && !document.hidden) {
      snowRaf = requestAnimationFrame(renderSnowFrame);
    }
  }

  window.addEventListener("resize", resizeSnow, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startSnowLoop();
  });
  resizeSnow();
  startSnowLoop();

  // 4. Interactive Catenary Holiday Light Strand Physics (.ny-garland-slot)
  const BULB_COLORS = ["#F59E0B", "#38BDF8", "#10B981", "#F43F5E", "#FDE68A"];
  const bulbSprings = [];

  document.querySelectorAll(".ny-garland-slot").forEach((slot) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1200 68");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("ny-garland-svg");

    const count = 17;
    const step = 1200 / (count + 1);
    let pathD = "M 0 6 ";
    const anchors = [];

    for (let i = 1; i <= count; i++) {
      const x = i * step;
      const sag = 10 + Math.sin((i / (count + 1)) * Math.PI) * 14;
      const prevX = (i - 1) * step;
      const midX = (prevX + x) / 2;
      pathD += `Q ${midX} ${sag + 6} ${x} ${sag} `;
      anchors.push({ x, y: sag });
    }
    pathD += "Q 1166 18 1200 6";

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
      cap.setAttribute("x", pt.x - 2.5);
      cap.setAttribute("y", pt.y);
      cap.setAttribute("width", "5");
      cap.setAttribute("height", "4.5");
      cap.setAttribute("rx", "1");
      cap.setAttribute("fill", "#64748B");

      const bulb = document.createElementNS(svgNS, "ellipse");
      bulb.setAttribute("cx", pt.x);
      bulb.setAttribute("cy", pt.y + 11.5);
      bulb.setAttribute("rx", "4.4");
      bulb.setAttribute("ry", "6.8");
      bulb.setAttribute("fill", color);
      bulb.classList.add("ny-bulb-core");

      g.append(cap, bulb);
      svg.appendChild(g);

      const spring = {
        el: g,
        angle: ((idx % 2) * 2 - 1) * 1.4,
        vel: 0,
        phase: idx * 0.55,
      };
      bulbSprings.push(spring);

      g.addEventListener("pointerenter", () => {
        spring.vel += (Math.random() > 0.5 ? 1 : -1) * 5.2;
        g.classList.add("is-Lit");
        setTimeout(() => g.classList.remove("is-Lit"), 700);
      });

      g.addEventListener("click", () => {
        bulbSprings.forEach((b, bIdx) => {
          setTimeout(() => {
            b.vel += (bIdx % 2 === 0 ? 1 : -1) * 4.5;
            b.el.classList.add("is-Lit");
            setTimeout(() => b.el.classList.remove("is-Lit"), 550);
          }, Math.abs(bIdx - idx) * 35);
        });
      });
    });

    slot.appendChild(svg);
  });

  if (bulbSprings.length > 0 && !reducedMotion) {
    let garlandTime = 0;
    function tickBulbs() {
      if (fxEnabled && !document.hidden) {
        garlandTime += 0.03;
        for (let i = 0; i < bulbSprings.length; i++) {
          const b = bulbSprings[i];
          const ambient = Math.sin(garlandTime + b.phase) * 0.06;
          const force = -0.075 * b.angle + ambient;
          b.vel = (b.vel + force) * 0.92;
          b.angle += b.vel;
          b.el.style.transform = `rotate(${b.angle.toFixed(2)}deg)`;
        }
      }
      requestAnimationFrame(tickBulbs);
    }
    requestAnimationFrame(tickBulbs);
  }

  // 5. 3D Specular Tilt & Magnetic Button Physics (Fine Pointer Only)
  if (finePointer && !reducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 5.2;
        const ry = (px - 0.5) * 6.4;
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        card.style.transform = `perspective(920px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // 6. Smooth Grid Accordions (.faq-acc-item)
  document.querySelectorAll(".faq-acc-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-acc-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // Expose light helper if pages re-sync buttons dynamically
  window.__AERO_FESTIVE__ = {
    syncFxButtons,
    isFxEnabled: () => fxEnabled,
  };
})();
