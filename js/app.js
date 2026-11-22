(function () {
  "use strict";

  // 1. Subtle Hero Particle Drift
  const canvas = document.getElementById("hero-mist");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dots = [];

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(85, Math.max(35, Math.floor(w / 16)));
      dots = Array.from({ length: count }, (_, i) => {
        const band = i / count;
        return {
          x: band * w + (Math.random() - 0.5) * 80,
          y: h * 0.72 - band * h * 0.48 + (Math.random() - 0.5) * 180,
          r: 1.0 + Math.random() * 2.1,
          a: 0.14 + Math.random() * 0.34,
          vx: 0.12 + Math.random() * 0.18,
          vy: (Math.random() - 0.5) * 0.08,
        };
      });
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x > w + 20) {
          d.x = -20;
          d.y = h * 0.72 + (Math.random() - 0.5) * 220;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${d.a})`;
        ctx.fill();
      }
      if (!reduced && !document.hidden) {
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener("resize", resize);
    resize();
    tick();
  }

  // 2. Blur-to-Sharp Scroll Reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // 3. Active Scroll Section Highlight
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(navLinks)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  function updateActiveNav() {
    const pos = window.scrollY + 220;
    let current = "";
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = "#" + sec.id;
    });
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === current));
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // 4. Floating Theme Switcher
  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("aero_theme_v2");
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("aero_theme_v2", next);
  });

  // 5. Mobile Drawer
  const burger = document.getElementById("mobile-burger");
  const sheet = document.getElementById("mobile-sheet");
  burger?.addEventListener("click", () => {
    const hidden = sheet.hasAttribute("hidden");
    if (hidden) {
      sheet.removeAttribute("hidden");
      burger.setAttribute("aria-expanded", "true");
    } else {
      sheet.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", "false");
    }
  });
  sheet?.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      sheet.setAttribute("hidden", "");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  // 6. Language Dropdown (O‘Z / RU / EN) — Human product copy, zero dev jargon
  const langTrigger = document.getElementById("lang-trigger");
  const langMenu = document.getElementById("lang-menu");
  const currentFlag = document.getElementById("current-flag");
  const currentLabel = document.getElementById("current-lang-label");

  const dict = {
    uz: {
      nav_features: "Imkoniyatlar",
      nav_why: "Nega AeroGram?",
      nav_security: "Xavfsizlik",
      nav_screens: "Skrinshotlar",
      nav_apk: "Yuklash",
      nav_web: "Saytda ochish",
      nav_download: "Yuklab olish",
      hero_title: "Tez va Qulay<br>Muloqot",
      hero_desc: "AeroGram bilan yaqinlaringizga bepul qo‘ng‘iroq qiling, maxfiylikni boshqaring va Telegram’ning kengaytirilgan imkoniyatlaridan bahramand bo‘ling.",
      hero_plat_t: "Ishonchli va Tezkor",
      hero_plat_s: "Android uchun tayyor • 52.11 MB",
      hero_cta: "Hozir yuklab olish",
      hero_web: "AeroGram’ni saytda ochish →",
      offer_pill: "Nimalar mavjud",
      offer_title: "Foydali va Keng<br>Imkoniyatlar",
      offer_sub: "Kundalik yozishmalaringizdan ko‘proq qulaylik oling",
      of1_t: "Ghost Mode (Ko‘rinmas Rejim)",
      of1_d: "Xabarlarni o‘qish, yozayotganlik holati, onlayn maqomi va Stories ko‘rishni alohida yashiring.",
      of2_t: "Qulay AeroGram Sozlamalari",
      of2_d: "Qidiruv satriga ega toza ro‘yxat: qo‘shimcha funksiyalar standartda o‘chiq keladi, faqat keraklisini yoqasiz.",
      of3_t: "O‘chirilgan Xabarlar va Tahrirlar Tarixi",
      of3_d: "Suhbatdosh o‘chirgan xabarlar o‘chib ketmaydi; tahrirlangan xabarning esa oldingi matnlarini ko‘rasiz.",
      of4_t: "Qo‘ng‘iroqdan Oldin Tasdiqlash",
      of4_d: "Chat yoki profilda tasodifan ovozli va video qo‘ng‘iroq bosib yuborishning oldini oluvchi qulay himoya oynasi.",
      of5_t: "Galereyadan Dumaloq Video va Alifbo",
      of5_d: "Galereyadagi oddiy videoni dumaloq video-xabar qilib yuboring hamda matnlarni yangi o‘zbek alifbosiga (ş ç ō ḡ) o‘giring.",
      why_pill: "Nega AeroGram?",
      why_title: "Abadiy Bepul | Cheksiz Bulut va Yuqori Shifrlash",
      why_btn: "AeroGram’ni yuklab olish",
      bt1_t: "Doim Yangilanib Boradi",
      bt1_d: "Rasmiy Telegram bazasiga asoslangan muntazam sifat va tezlik yangilanishlari.",
      bt2_t: "Yuqori Xavfsizlik",
      bt2_d: "Shaxsiy raqamli sertifikat bilan imzolangan toza va ishonchli ilova.",
      bt3_t: "Ortiqcha Ruxsatlarsiz",
      bt3_d: "Ilova faqat muloqot va qo‘ng‘iroqlar uchun zarur ruxsatlarnigina so‘raydi.",
      aud_1: "Ovozli va Video Qo‘ng‘iroq",
      aud_2: "Tezkor Yozishmalar",
      aud_3: "Ortiqcha Kuzatuvlar",
      aud_4: "Keraksiz Ruxsatlar",
      bt4_t: "O‘zbekiston Uchun Mos",
      bt4_d: "O‘zbekcha qulay interfeys, yangi alifbo va rasmiy Telegram yonida parallel ishlash.",
      sec_title: "Xavfsiz va Telegram bilan Yonma-Yon",
      sec_sub: "Rasmiy Telegram ilovangiz va eski chatlaringizga hech qanday zarar yetkazmasdan alohida ilova bo‘lib ishlaydi.",
      chk_1: "To‘g‘ridan-to‘g‘ri rasmiy Telegram serverlari orqali himoyalangan aloqa",
      chk_2: "Barcha sozlamalar va chat tarixlari faqat telefoningizda saqlanadi",
      chk_3: "Bepul, reklamasiz va cheklovlarsiz foydalanish",
      sec_btn: "AeroGram’ni yuklab olish",
      scr_pill: "AeroGram ko‘rinishi",
      scr_title: "bir nechta jonli lavhalar!",
      sc1_t: "Oddiy, Tez, Ishonchli",
      sc1_d: "Rasmiy Telegram tezligi va cheksiz bulut xotirasi",
      sc2_t: "Qulay Suhbatlar",
      sc2_d: "Ghost Mode va kuchli shifrlash ostidagi erkin muloqot",
      sc3_t: "Zamonaviy Interfeys",
      sc3_d: "Boshqaruv sizning qo‘lingizda — o‘zingizga moslang",
      dl_sub: "Oddiy Telegram’dan ham qulayroq, tezroq va xavfsizroq.",
      dl_card_t: "AeroGram ilovasi",
      dl_card_s: "Android uchun bevosita yuklab olish (52.11 MB)",
      web_card_t: "AeroGram Web",
      web_card_s: "Ilova o‘rnatmasdan hoziroq saytda ochish",
      well_pill: "Xo‘sh!",
      well_title: "Telegram’ingizni yangi darajaga olib chiqishga tayyormisiz?",
      well_sub: "AeroGram’ni hozir yuklab oling va oddiy Telegram bera olmaydigan imkoniyatlardan foydalaning.",
      well_btn: "AeroGram’ni yuklab olish",
      footer_sub: "Android uchun qulay va tezkor messenjer",
      footer_privacy: "Maxfiylik siyosati",
      footer_contact: "Bog‘lanish",
      mod_pill: "Yangi versiya",
      mod_t: "AeroGram ilovasini yuklash",
      mod_sub: "Android 8.0+ • Bepul • 52.11 MB",
      mod_btn: "AeroGram.apk ni yuklab olish (52.11 MB)",
      mod_note: "<strong>O‘rnatish eslatmasi:</strong> Agar telefonda avvalgi versiya o‘rnatilgan bo‘lsa, avval uni o‘chirib keyin yangisini o‘rnating. Rasmiy Telegram ilovangiz va chatlaringiz saqlanib qoladi.",
      priv_t: "Maxfiylik siyosati",
      priv_body: "<p>AeroGram foydalanuvchilarning shaxsiy yozishmalarini yig‘maydi va uchinchi tomon serverlariga yubormaydi. Barcha chatlar, media fayllar va qo‘ng‘iroqlar rasmiy Telegram serverlari orqali himoyalangan tartibda ishlaydi.</p><p>Qo‘shimcha funksiyalar (Ghost Mode, tahrirlar tarixi va interfeys sozlamalari) faqat foydalanuvchining o‘z qurilmasida saqlanadi.</p>",
    },
    ru: {
      nav_features: "Функции",
      nav_why: "Почему AeroGram?",
      nav_security: "Безопасность",
      nav_screens: "Скриншоты",
      nav_apk: "Скачать",
      nav_web: "Открыть веб",
      nav_download: "Скачать",
      hero_title: "Быстрое и Удобное<br>Общение",
      hero_desc: "Звоните бесплатно, управляйте приватностью и используйте расширенные возможности Telegram с AeroGram.",
      hero_plat_t: "Надёжный и Быстрый",
      hero_plat_s: "Доступен для Android • 52.11 MB",
      hero_cta: "Скачать сейчас",
      hero_web: "Открыть AeroGram на сайте →",
      offer_pill: "Что внутри",
      offer_title: "Полезные и Продвинутые<br>Функции",
      offer_sub: "Получайте больше от ежедневного общения",
      of1_t: "Ghost Mode (Режим Призрака)",
      of1_d: "Скрывайте статус прочтения, набор текста, онлайн и просмотр Историй по отдельности.",
      of2_t: "Удобные Настройки AeroGram",
      of2_d: "Аккуратный список с поиском: дополнительные опции выключены по умолчанию — включайте только нужное.",
      of3_t: "Удалённые и История Правок",
      of3_d: "Удалённые сообщения не пропадают, а у отредактированных сохраняется исходный текст.",
      of4_t: "Подтверждение Звонка",
      of4_d: "Защита перед началом голосового или видеозвонка, чтобы исключить случайное нажатие.",
      of5_t: "Кружки из Галереи и Новый Алфавит",
      of5_d: "Отправляйте обычное видео как видеокружок и автоматически переводите текст на ş ç ō ḡ.",
      why_pill: "Почему AeroGram?",
      why_title: "Бесплатно Навсегда | Безлимитное Облако и Шифрование",
      why_btn: "Скачать AeroGram",
      bt1_t: "Всегда Актуален",
      bt1_d: "Регулярные улучшения скорости и безопасности на актуальной базе Telegram.",
      bt2_t: "Высокая Защита",
      bt2_d: "Чистая сборка с индивидуальной цифровой подписью и проверкой.",
      bt3_t: "Без Лишних Разрешений",
      bt3_d: "Приложение запрашивает только разрешения, необходимые для общения и звонков.",
      aud_1: "Аудио и Видеозвонки",
      aud_2: "Быстрые Переписки",
      aud_3: "Лишнее Слежение",
      aud_4: "Ненужные Разрешения",
      bt4_t: "Создан для Узбекистана",
      bt4_d: "Удобный узбекский интерфейс, алфавит ş ç ō ḡ и работа рядом с Telegram.",
      sec_title: "Безопасно и Рядом с Telegram",
      sec_sub: "Устанавливается как отдельное приложение рядом с официальным Telegram — ваши старые чаты останутся нетронутыми.",
      chk_1: "Прямое защищённое соединение через официальные серверы Telegram",
      chk_2: "Все настройки и история правок хранятся только на вашем телефоне",
      chk_3: "Бесплатно, без рекламы и ограничений",
      sec_btn: "Скачать AeroGram",
      scr_pill: "Скриншоты AeroGram",
      scr_title: "несколько взглядов внутрь!",
      sc1_t: "Просто, Быстро, Надёжно",
      sc1_d: "Официальная скорость Telegram и безлимитное облако",
      sc2_t: "Приятное Общение",
      sc2_d: "Ваши переписки под защитой режима Призрака",
      sc3_t: "Современный Интерфейс",
      sc3_d: "Полный контроль над внешним видом и функциями",
      dl_sub: "Удобнее, быстрее и приватнее обычного Telegram.",
      dl_card_t: "Приложение AeroGram",
      dl_card_s: "Прямая загрузка для Android (52.11 MB)",
      web_card_t: "AeroGram Web",
      web_card_s: "Открыть мессенджер прямо в браузере",
      well_pill: "Ну что!",
      well_title: "Готовы вывести свой Telegram на новый уровень?",
      well_sub: "Скачайте AeroGram прямо сейчас и оцените возможности за пределами обычного клиента.",
      well_btn: "Скачать AeroGram",
      footer_sub: "Быстрый и удобный мессенджер для Android",
      footer_privacy: "Политика конфиденциальности",
      footer_contact: "Связаться",
      mod_pill: "Новая версия",
      mod_t: "Скачать AeroGram",
      mod_sub: "Android 8.0+ • Бесплатно • 52.11 MB",
      mod_btn: "Скачать AeroGram.apk (52.11 MB)",
      mod_note: "<strong>Примечание:</strong> Если у вас установлена предыдущая версия, удалите её перед установкой новой. Официальный Telegram и все ваши чаты сохранятся.",
      priv_t: "Политика конфиденциальности",
      priv_body: "<p>AeroGram не собирает личные переписки пользователей и не передаёт их на сторонние серверы. Все чаты, медиа и звонки работают через официальные защищённые серверы Telegram.</p><p>Дополнительные функции (режим Призрака, история изменений и настройки) хранятся исключительно локально на устройстве пользователя.</p>",
    },
    en: {
      nav_features: "Features",
      nav_why: "Why AeroGram?",
      nav_security: "Security",
      nav_screens: "Screenshots",
      nav_apk: "Download",
      nav_web: "Open Web",
      nav_download: "Download",
      hero_title: "Fun and Easy<br>Messaging",
      hero_desc: "With AeroGram, enjoy free video calls, thoughtful privacy controls and effortless messaging built for speed.",
      hero_plat_t: "Fast & Trusted",
      hero_plat_s: "Ready for Android • 52.11 MB",
      hero_cta: "Download now",
      hero_web: "Open AeroGram on Web →",
      offer_pill: "What we offer",
      offer_title: "Useful & Advanced<br>Features",
      offer_sub: "Make more out of your daily messaging",
      of1_t: "Ghost Mode",
      of1_d: "Independently hide read receipts, typing indicators, online status and story views.",
      of2_t: "Clean AeroGram Settings",
      of2_d: "Searchable grouped list where extra features stay OFF by default until you turn them on.",
      of3_t: "Deleted Messages & Edit History",
      of3_d: "Keep deleted messages visible locally and view earlier versions of edited messages.",
      of4_t: "Call Confirmation Guard",
      of4_d: "Prevents accidental voice or video calls with a clear confirmation dialog.",
      of5_t: "Gallery Round Video & Script",
      of5_d: "Send gallery videos as round video notes and convert outgoing Uzbek text to ş ç ō ḡ.",
      why_pill: "Why AeroGram?",
      why_title: "Forever Free | Infinite Storage & High Encryption",
      why_btn: "Download AeroGram",
      bt1_t: "Always Up to Date",
      bt1_d: "Built on current official Telegram speed and security improvements.",
      bt2_t: "Trusted Protection",
      bt2_d: "Clean release signed with a dedicated private digital certificate.",
      bt3_t: "No Extra Permissions",
      bt3_d: "Only asks for the essential permissions needed for messaging and calls.",
      aud_1: "Voice & Video Calls",
      aud_2: "Private Messaging",
      aud_3: "Extra Tracking",
      aud_4: "Unneeded Permissions",
      bt4_t: "Tailored Experience",
      bt4_d: "Installs side-by-side next to official Telegram with Uzbek script support.",
      sec_title: "Secure & Side-by-Side Ready",
      sec_sub: "Installs cleanly right beside your official Telegram app without touching existing chats or data.",
      chk_1: "Direct encrypted connection to official Telegram servers",
      chk_2: "All preferences and local history stay strictly on your device",
      chk_3: "Free forever, zero ads and zero limits",
      sec_btn: "Download AeroGram",
      scr_pill: "AeroGram screenshots",
      scr_title: "a few sneak peeks!",
      sc1_t: "Simple, Fast, Reliable",
      sc1_d: "Official Telegram speed with unlimited cloud storage",
      sc2_t: "Fun Chatting",
      sc2_d: "Your chats stay protected under Ghost Mode and encryption",
      sc3_t: "Modern Interface",
      sc3_d: "You are in control — customize AeroGram your way",
      dl_sub: "Cleaner, faster and even more private than stock Telegram.",
      dl_card_t: "AeroGram App",
      dl_card_s: "Direct Android Download (52.11 MB)",
      web_card_t: "AeroGram Web",
      web_card_s: "Open messenger right here in your browser",
      well_pill: "Well!",
      well_title: "Ready to level up your Telegram?",
      well_sub: "Download AeroGram now and experience thoughtful privacy and control beyond stock Telegram.",
      well_btn: "Download AeroGram",
      footer_sub: "Fast & Thoughtful Telegram Client for Android",
      footer_privacy: "Privacy Policy",
      footer_contact: "Contact Us",
      mod_pill: "Latest Version",
      mod_t: "Download AeroGram",
      mod_sub: "Android 8.0+ • Free • 52.11 MB",
      mod_btn: "Download AeroGram.apk (52.11 MB)",
      mod_note: "<strong>Install note:</strong> If you previously installed an older version, please uninstall it before installing the latest release. Your official Telegram stays untouched.",
      priv_t: "Privacy Policy",
      priv_body: "<p>AeroGram does not collect personal messages or send user data to third-party servers. All chats, media and calls run directly over Telegram's encrypted network.</p><p>Extra client features (Ghost Mode, edit history and interface preferences) are stored strictly locally on your device.</p>",
    },
  };

  function setLang(lang) {
    const t = dict[lang] || dict.uz;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (t[k]) el.innerHTML = t[k];
    });
    const opt = langMenu?.querySelector(`[data-lang="${lang}"]`);
    if (opt && currentFlag && currentLabel) {
      const svg = opt.querySelector("svg")?.cloneNode(true);
      if (svg) {
        currentFlag.innerHTML = "";
        currentFlag.appendChild(svg);
      }
      currentLabel.textContent = opt.querySelector("span")?.textContent || lang.toUpperCase();
    }
    langMenu?.querySelectorAll(".lang-opt").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    localStorage.setItem("aero_lang_v2", lang);
  }

  langTrigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = langMenu.hasAttribute("hidden");
    if (open) {
      langMenu.removeAttribute("hidden");
      langTrigger.setAttribute("aria-expanded", "true");
    } else {
      langMenu.setAttribute("hidden", "");
      langTrigger.setAttribute("aria-expanded", "false");
    }
  });

  langMenu?.querySelectorAll(".lang-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      langMenu.setAttribute("hidden", "");
      langTrigger?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => {
    langMenu?.setAttribute("hidden", "");
    langTrigger?.setAttribute("aria-expanded", "false");
  });

  const savedLang = localStorage.getItem("aero_lang_v2");
  if (savedLang && dict[savedLang]) setLang(savedLang);

  // 7. Modals (Download & Privacy Policy)
  const dlModal = document.getElementById("download-modal");
  const dlClose = document.getElementById("modal-close");
  document.querySelectorAll(".open-download").forEach((btn) => {
    btn.addEventListener("click", () => dlModal?.removeAttribute("hidden"));
  });
  dlClose?.addEventListener("click", () => dlModal?.setAttribute("hidden", ""));
  dlModal?.addEventListener("click", (e) => {
    if (e.target === dlModal) dlModal.setAttribute("hidden", "");
  });

  const privModal = document.getElementById("privacy-modal");
  const privOpen = document.getElementById("open-privacy-btn");
  const privClose = document.getElementById("privacy-close");
  privOpen?.addEventListener("click", () => privModal?.removeAttribute("hidden"));
  privClose?.addEventListener("click", () => privModal?.setAttribute("hidden", ""));
  privModal?.addEventListener("click", (e) => {
    if (e.target === privModal) privModal.setAttribute("hidden", "");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dlModal?.setAttribute("hidden", "");
      privModal?.setAttribute("hidden", "");
    }
  });
})();
