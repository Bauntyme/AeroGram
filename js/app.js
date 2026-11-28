(function () {
  "use strict";

  // 1. Scroll Reveal
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
    .map((l) => {
      const href = l.getAttribute("href");
      return href && href.startsWith("#") ? document.querySelector(href) : null;
    })
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

  // 3. Floating Theme Switcher (Default: Dark Mode)
  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("aero_theme_v3");
  document.documentElement.setAttribute("data-theme", savedTheme === "light" ? "light" : "dark");
  themeBtn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("aero_theme_v3", next);
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

  // 6. Interactive Studio Sandbox (Ghost Blur + Secret Vault PIN 2027)
  const sbStage = document.getElementById("sandbox-stage");
  const sbBlurBtn = document.getElementById("sandbox-blur-btn");
  const sbPinBtn = document.getElementById("sandbox-pin-btn");
  const sbResetBtn = document.getElementById("sandbox-reset-btn");
  const sbInput = document.getElementById("sandbox-pin-input");
  const sbPublic = document.getElementById("sandbox-public-list");
  const sbVault = document.getElementById("sandbox-vault-view");
  const sbKeys = ["sb-k1", "sb-k2", "sb-k3", "sb-k4"].map((id) => document.getElementById(id));
  let pinAnimTimers = [];

  function clearPinAnim() {
    pinAnimTimers.forEach((t) => clearTimeout(t));
    pinAnimTimers = [];
    sbKeys.forEach((k) => k?.classList.remove("is-pressed"));
  }

  function applyVaultPinState(val) {
    const clean = (val || "").trim();
    if (clean === "2027") {
      sbPublic?.setAttribute("hidden", "");
      sbVault?.removeAttribute("hidden");
    } else {
      sbVault?.setAttribute("hidden", "");
      sbPublic?.removeAttribute("hidden");
    }
  }

  sbBlurBtn?.addEventListener("click", () => {
    const on = sbStage?.classList.toggle("is-blurred");
    sbBlurBtn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  sbInput?.addEventListener("input", () => applyVaultPinState(sbInput.value));

  sbPinBtn?.addEventListener("click", () => {
    clearPinAnim();
    if (!sbInput) return;
    sbInput.value = "";
    applyVaultPinState("");
    const code = ["2", "0", "2", "7"];
    code.forEach((digit, idx) => {
      const t = setTimeout(() => {
        sbInput.value += digit;
        sbKeys[idx]?.classList.add("is-pressed");
        if (idx === code.length - 1) {
          applyVaultPinState(sbInput.value);
        }
      }, idx * 140);
      pinAnimTimers.push(t);
    });
  });

  sbResetBtn?.addEventListener("click", () => {
    clearPinAnim();
    sbStage?.classList.remove("is-blurred");
    sbBlurBtn?.setAttribute("aria-pressed", "false");
    if (sbInput) sbInput.value = "";
    applyVaultPinState("");
  });

  // 7. Language Dropdown (O‘Z / RU / EN)
  const langTrigger = document.getElementById("lang-trigger");
  const langMenu = document.getElementById("lang-menu");
  const currentFlag = document.getElementById("current-flag");
  const currentLabel = document.getElementById("current-lang-label");

  const dict = {
    uz: {
      nav_features: "Imkoniyatlar",
      nav_more: "Taqqoslash & FAQ",
      nav_laptop: "Laptop uchun",
      nav_tv: "Alohida TV uchun",
      nav_apk: "Yuklash",
      nav_web: "Saytda ochish",
      nav_download: "Yuklab olish",
      hero_chip: "2027 Yangi Yil Nashri • v1.5.0",
      hero_title: "Yengil, Tez va<br><em class=\"serif-accent\">Ishonchli</em> Muloqot",
      hero_desc: "Yaqinlaringiz va hamkasblaringiz bilan yuqori tezlikda xabar almashing, maxfiy suhbatlarni seyfda asrang — telefonda ham, Windows noutbukda ham.",
      hero_plat_t: "Yangi yilga tayyor reliz",
      hero_plat_s: "Android & Windows v1.5.0",
      hero_cta: "Hozir yuklab olish",
      hero_laptop: "Laptop uchun (.exe) →",
      hero_web: "AeroGram’ni saytda ochish →",
      hero_tv: "Alohida TV uchun →",
      hf_vault_t: "Maxfiy Seyf",
      hf_vault_s: "Yashirin PIN kirish",
      hf_studio_t: "Studio v1.5",
      offer_pill: "Nimalar mavjud",
      offer_title: "Foydali va Keng<br><em class=\"serif-accent\">Imkoniyatlar</em>",
      offer_sub: "Kundalik yozishmalaringizdan ko‘proq qulaylik oling",
      of1_t: "Yuqori Tezlik va Silliq Ishlash",
      of1_d: "Chatlar bir zumda ochiladi, animatsiyalar yengil ishlaydi va kuchsiz internetda ham barqaror aloqa ta’minlanadi.",
      of2_t: "Kristall Tiniq Qo‘ng‘iroqlar",
      of2_d: "Yaqinlaringiz bilan ovozli va video suhbatlarni kechikishsiz va trafikni tejagan holda amalga oshiring.",
      of3_t: "Maxfiy Chatlar Seyfi",
      of3_d: "Shaxsiy suhbatlar oddiy ro‘yxat va qidiruvdan butunlay yashiriladi — faqat sizning PIN kodingiz bilan ochiladi.",
      of4_t: "Windows Noutbuk va Telefon Birga",
      of4_d: "Telefon, Windows kompyuter va brauzer o‘rtasida barcha chatlar va katta fayllar bir zumda sinxronlanadi.",
      of6_t: "Cheksiz Akkauntlar (∞)",
      of6_d: "Bitta ilovada xohlagancha Telegram akkaunt ulang — Premium cheklovisiz, har biri mustaqil bildirishnomalar bilan ishlaydi.",
      of7_t: "Alohida TV uchun — Jonli Efir",
      of7_d: "Zo‘r TV, Sevimli TV, Toshkent va 29 ta O‘zbekiston kanallarini telefonda ham, kompyuterda ham to‘liq ekranda tomosha qiling.",
      of7_cta: "TV bo‘limini ochish →",
      sb_pill: "Jonli Studio Sinovi",
      sb_title: "Maxfiy Seyf va Ghost Blur’ni hoziroq sinab ko‘ring",
      sb_desc: "Yonimizdagi tugmalarni bosing yoki qidiruv qatoriga 2027 PIN kodini tering — chatlar qanday yashirinishi va xiralashishini ko‘rasiz.",
      sb_blur_btn: "Ghost Blur yoqish",
      sb_pin_btn: "PIN: 2027 terish",
      sb_reset: "Qaytarish",
      sb_input_ph: "Qidiruv yoki PIN (2027)...",
      sb_c1: "AeroGram Yangiliklari",
      sb_m1: "2027 Yangi Yil mavzusi faol",
      sb_c2: "Oila Guruhi",
      sb_m2: "Bayram tabriklari tayyor!",
      sb_c3: "Dizayn Jamoasi",
      sb_m3: "Desktop .exe yakuniy tekshiruv",
      sb_unlocked: "Maxfiy Chatlar Seyfi Ochildi",
      sb_sc1: "Shaxsiy Seyf Suhbat",
      sb_sm1: "Asosiy ro‘yxat va qidiruvdan yashirin",
      sb_sc2: "Muhim Hujjatlar 2027",
      sb_sm2: "Chiqqanda avtomatik qulflanadi",
      cap_pill_locked: "Yopiq 2027 Kapsulasi • 00:00 da ochiladi",
      cap_title_locked: "2027 kirishi bilan butun sayt yangi qiyofaga kiradi",
      cap_desc_locked: "Toshkent vaqti bilan 01.01.2027 soat 00:00 da 40 soniyalik 3D taqdimot, Cosmic Prism dizayni, haqiqiy studiya rasmlari va Fazoviy Platforma markazi avtomatik ishga tushadi.",
      cap_f1_t: "40 Soniyalik 3D Taqdimot & Ovoz",
      cap_f1_s: "WebGL fazoviy film va jonli O‘zbekcha sharh",
      cap_f2_t: "Cosmic Prism 2027 Dizayn & Rasmlar",
      cap_f2_s: "Sayt rasmlari, tugmalar va mavzu butunlay yangilanadi",
      cap_f3_t: "Interaktiv 2027 Fazoviy Markaz",
      cap_f3_s: "Android, Windows Desktop va Maxfiy Seyf birlashmasi",
      cap_pill_open: "2027-Yil Xush Kelibsiz! • Fazoviy Hub Ochildi",
      cap_title_open: "AeroGram 2027 Cosmic Prism Markazi",
      aura_prism: "Cosmic Prism",
      aura_glacier: "Muzlik",
      aura_nebula: "Nebula",
      replay_3d_btn: "▶ 2027 3D Taqdimot (40s)",
      deck_tab1: "01 · Yagona Fazo",
      deck_tab2: "02 · Maxfiy Seyf 2.0",
      deck_tab3: "03 · 29+ Hamjamiyat",
      deck_watch_btn: "3D Keynote’ni qayta tomosha qilish →",
      fut1_t: "Yashirin Seyf 2.0",
      fut1_d: "Barmoq izi va PIN asosida ko‘rinmas dialoglar himoyasi.",
      fut2_t: "Desktop & Mobile Hamkorligi",
      fut2_d: "Telefondan noutbukka soniya ichida fayl va sessiya uzatish.",
      fut3_t: "Full HD Jonli TV",
      fut3_d: "29 ta O‘zbekiston kanallari kechikishsiz va reklamasiz efirda.",
      tvs_pill: "Alohida TV uchun • Jonli efir",
      tvs_title: "Toshkent va O‘zbekiston TV kanallari — to‘liq ekranda",
      tvs_desc: "Zo‘r TV, Sevimli TV, Toshkent, Milliy TV, Futbol TV va 29 ta kanallarni telefonda ham, noutbukda ham qotishsiz Full HD formatda tomosha qiling.",
      tvs_btn: "TV bo‘limini ochish →",
      tvs_note: "29 ta jonli kanal • Full HD",
      cmp_pill: "Taqqoslash",
      cmp_title: "Nima uchun AeroGram v1.5.0?",
      cmp_sub: "Oddiy messenjer imkoniyatlaridan ko‘prog‘i — ortiqcha cheklovlarsiz.",
      cmp_col1: "Imkoniyat",
      cmp_col2: "Oddiy Telegram",
      cmp_r1_k: "Ulash mumkin bo‘lgan akkauntlar",
      cmp_r1_v1: "3–4 ta",
      cmp_r1_v2: "Cheksiz (∞)",
      cmp_r2_k: "Maxfiy chatlar seyfi",
      cmp_yes: "PIN & Stealth rejim",
      cmp_r3_k: "Windows Desktop + Jonli TV",
      cmp_tv_yes: ".exe + 29 kanal",
      cmp_r4_k: "O‘zbekcha qulay interfeys",
      cmp_part: "Qisman",
      cmp_full: "To‘liq moslashgan",
      faq_pill: "Ko‘p beriladigan savollar",
      faq_title: "Qisqacha ma’lumotlar",
      faq1_q: "AeroGram’ni o‘rnatsam eski Telegram va chatlarim o‘chmaydimi?",
      faq1_a: "Yo‘q! AeroGram alohida paket sifatida rasmiy Telegram yonida parallel o‘rnatiladi. Barcha chatlaringiz, kanallaringiz va media fayllaringiz xavfsiz saqlanadi.",
      faq2_q: "Nechta Telegram akkaunt ulash mumkin?",
      faq2_a: "v1.4.2 versiyadan boshlab cheksiz (∞) miqdorda akkaunt ulash mumkin — Premium obuna talab qilinmaydi va har bir akkaunt alohida bildirishnoma oladi.",
      faq3_q: "“Alohida TV uchun” bo‘limi telefonda ham katta ekranda ishlaydimi?",
      faq3_a: "Ha! Saytdagi Alohida TV bo‘limi telefon, planshet va kompyuterga moslashgan. “To‘liq ekran” belgisini bossangiz, efir ekraningizni to‘liq egallaydi.",
      faq4_q: "Maxfiy Chatlar Seyfi qayerda joylashgan?",
      faq4_a: "Android va Windows v1.5.0 da seyf sozlamalarda ko‘rinmaydi: uni qidiruv maydoniga PIN kodingizni yozib, Studio tugmasini bosib turib yoki Ctrl+Shift+H orqali ochasiz.",
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
      bt4_d: "O‘zbekcha qulay interfeys, tiniq dizayn va rasmiy Telegram yonida parallel ishlash.",
      sec_title: "Xavfsiz va Telegram bilan Yonma-Yon",
      sec_sub: "Rasmiy Telegram ilovangiz va eski chatlaringizga hech qanday zarar yetkazmasdan alohida ilova bo‘lib ishlaydi.",
      chk_1: "To‘g‘ridan-to‘g‘ri rasmiy Telegram serverlari orqali himoyalangan aloqa",
      chk_2: "Barcha shaxsiy sozlamalar faqat sizning qurilmangizda saqlanadi",
      chk_3: "Bepul, reklamasiz va cheklovlarsiz foydalanish",
      sec_btn: "AeroGram’ni yuklab olish",
      scr_pill: "AeroGram ko‘rinishi",
      scr_title: "Ichki muhitdan <em class=\"serif-accent\">jonli</em> lavhalar",
      sc1_t: "Oddiy, Tez, Ishonchli",
      sc1_d: "Rasmiy Telegram tezligi va cheksiz bulut xotirasi",
      sc2_t: "Qulay Suhbatlar",
      sc2_d: "Kuchli shifrlash va qulay muloqot muhiti",
      sc3_t: "Zamonaviy Interfeys",
      sc3_d: "Boshqaruv sizning qo‘lingizda — o‘zingizga moslang",
      dl_sub: "Yangi yilga munosib tezkorlik, maxfiy seyf va barcha qurilmalarda qulay ishlash.",
      dl_card_t: "AeroGram Android",
      dl_card_s: "Android v1.5.0 (.apk) • 52.13 MB",
      desk_card_t: "Laptop uchun (.exe)",
      desk_card_s: "Windows 10/11 Desktop & Maxfiy Seyf",
      web_card_t: "AeroGram Web",
      web_card_s: "Ilova o‘rnatmasdan hoziroq saytda ochish",
      well_pill: "2027 • Yangi bosqich",
      well_title: "Muloqotingizni yangi darajaga olib chiqishga tayyormisiz?",
      well_sub: "AeroGram’ni hozir yuklab oling — telefon va noutbukda yanada erkin va xavfsiz yozishing.",
      well_btn: "AeroGram’ni yuklab olish",
      footer_sub: "Android va Windows Laptop uchun tezkor messenjer",
      footer_privacy: "Maxfiylik siyosati",
      footer_contact: "Bog‘lanish",
      footer_copy: "© 2026–2027 AeroGram — Yangi yil bilan! • <a href=\"https://aerogram.website\">aerogram.website</a>",
      mod_pill: "v1.5.0 • Yangi reliz",
      mod_t: "AeroGram ilovasini yuklash",
      mod_sub: "Android (.apk) & Windows Laptop (.exe) • v1.5.0",
      mod_btn: "Android: AeroGram.apk yuklab olish (52.13 MB)",
      mod_btn_win: "Laptop: AeroGram-Setup.exe yuklab olish (152.9 MB)",
      mod_btn_desk_page: "Laptop uchun batafsil sahifa (Qo‘llanma & Portable .exe) →",
      mod_note: "<strong>O‘rnatish eslatmasi:</strong> Agar Android telefoningizda eski versiya ustidan o‘rnatishda imzo xatoligi chiqsa, avval eski AeroGram’ni o‘chirib yangi v1.5.0 ni o‘rnating — barcha Telegram chatlaringiz bulutda saqlanadi.",
      priv_t: "Maxfiylik siyosati",
      priv_body: "<p>AeroGram foydalanuvchilarning shaxsiy yozishmalarini yig‘maydi va uchinchi tomon serverlariga yubormaydi. Barcha chatlar, media fayllar va qo‘ng‘iroqlar rasmiy Telegram serverlari orqali himoyalangan tartibda ishlaydi.</p><p>Barcha interfeys va foydalanuvchi sozlamalari faqat qurilmangizning o‘zida saqlanadi.</p>",
    },
    ru: {
      nav_features: "Функции",
      nav_more: "Сравнение и FAQ",
      nav_laptop: "Для ноутбука",
      nav_tv: "Раздел для ТВ",
      nav_apk: "Скачать",
      nav_web: "Открыть веб",
      nav_download: "Скачать",
      hero_chip: "Новогодний выпуск 2027 • v1.5.0",
      hero_title: "Лёгкое, Быстрое и<br><em class=\"serif-accent\">Надёжное</em> Общение",
      hero_desc: "Общайтесь без ограничений, храните приватные переписки в секретном сейфе и оставайтесь на связи на смартфоне и ноутбуке Windows.",
      hero_plat_t: "Праздничный релиз",
      hero_plat_s: "Android и Windows v1.5.0",
      hero_cta: "Скачать сейчас",
      hero_laptop: "Для ноутбука (.exe) →",
      hero_web: "Открыть AeroGram на сайте →",
      hero_tv: "Раздел для ТВ →",
      hf_vault_t: "Секретный сейф",
      hf_vault_s: "Вход по скрытому PIN",
      hf_studio_t: "Studio v1.5",
      offer_pill: "Что внутри",
      offer_title: "Чистая Скорость и<br><em class=\"serif-accent\">Комфорт</em>",
      offer_sub: "Максимум удобства в ежедневном общении",
      of1_t: "Молниеносная Работа",
      of1_d: "Чаты открываются мгновенно, анимации плавные, а соединение остаётся стабильным даже при слабой сети.",
      of2_t: "Кристально Чистые Звонки",
      of2_d: "Аудио и видеозвонки с минимальной задержкой и бережным расходом трафика.",
      of3_t: "Секретный Сейф Чатов",
      of3_d: "Личные переписки полностью скрыты из основного списка и поиска — доступ открывается только по вашему PIN.",
      of4_t: "Ноутбук Windows и Телефон Вместе",
      of4_d: "Мгновенная синхронизация чатов, фото и крупных файлов между телефоном, Windows и браузером.",
      of6_t: "Безлимитные Аккаунты (∞)",
      of6_d: "Подключайте сколько угодно аккаунтов Telegram в одном приложении без Premium-лимитов и с отдельными уведомлениями.",
      of7_t: "Раздел для ТВ — Прямой Эфир",
      of7_d: "Смотрите Zo‘r TV, Sevimli TV, Toshkent и 29 каналов Узбекистана прямо на сайте — на весь экран с телефона и ПК.",
      of7_cta: "Открыть ТВ раздел →",
      sb_pill: "Живая Песочница Studio",
      sb_title: "Попробуйте Секретный Сейф и Ghost Blur прямо сейчас",
      sb_desc: "Нажмите кнопки рядом или введите PIN 2027 в поиск — посмотрите, как легко прячутся и размываются личные чаты.",
      sb_blur_btn: "Включить Ghost Blur",
      sb_pin_btn: "Ввести PIN: 2027",
      sb_reset: "Сбросить",
      sb_input_ph: "Поиск или PIN (2027)...",
      sb_c1: "Новости AeroGram",
      sb_m1: "Новогодняя тема 2027 активна",
      sb_c2: "Семейный чат",
      sb_m2: "Поздравления к празднику готовы!",
      sb_c3: "Команда Дизайна",
      sb_m3: "Финальная проверка сборки .exe",
      sb_unlocked: "Секретный Сейф Открыт",
      sb_sc1: "Секретный Диалог",
      sb_sm1: "Скрыт из общего списка и поиска",
      sb_sc2: "Важные Документы 2027",
      sb_sm2: "Автоблокировка при выходе",
      cap_pill_locked: "Закрытая Капсула 2027 • Откроется в 00:00",
      cap_title_locked: "Ровно в полночь сайт полностью обновится к 2027 году",
      cap_desc_locked: "В 00:00 01.01.2027 по Ташкенту автоматически запустится 40-секундный 3D-фильм, оформление Cosmic Prism, новые фото и Платформа 2027.",
      cap_f1_t: "40-сек 3D-Презентация и Озвучка",
      cap_f1_s: "Пространственный WebGL-фильм и голос",
      cap_f2_t: "Новый Дизайн и Фото Cosmic Prism",
      cap_f2_s: "Обновление всех разделов и кнопок сайта",
      cap_f3_t: "Пространственный Хаб AeroGram 2027",
      cap_f3_s: "Единая система Android, Windows и Сейфа",
      cap_pill_open: "С Новым 2027 Годом! • Хаб Открыт",
      cap_title_open: "Платформа AeroGram 2027 Cosmic Prism",
      aura_prism: "Cosmic Prism",
      aura_glacier: "Глетчер",
      aura_nebula: "Небула",
      replay_3d_btn: "▶ 2027 3D Фильм (40с)",
      deck_tab1: "01 · Единое пространство",
      deck_tab2: "02 · Секретный Сейф 2.0",
      deck_tab3: "03 · 29+ Каналов",
      deck_watch_btn: "Смотреть 3D-презентацию снова →",
      fut1_t: "Секретный Сейф 2.0",
      fut1_d: "Невидимая защита диалогов по PIN и биометрии.",
      fut2_t: "Связка Desktop и Mobile",
      fut2_d: "Мгновенная передача файлов и сессий с телефона на ПК.",
      fut3_t: "Full HD Прямое ТВ",
      fut3_d: "29 каналов Узбекистана без лагов и лишней рекламы.",
      tvs_pill: "Раздел для ТВ • Прямой эфир",
      tvs_title: "Телеканалы Ташкента и Узбекистана — во весь экран",
      tvs_desc: "Zo‘r TV, Sevimli TV, Toshkent, Milliy TV, Futbol TV и 29 каналов в плавном Full HD без лишней рекламы.",
      tvs_btn: "Открыть ТВ раздел →",
      tvs_note: "29 каналов онлайн • Full HD",
      cmp_pill: "Сравнение",
      cmp_title: "Почему AeroGram v1.5.0?",
      cmp_sub: "Больше возможностей без искусственных ограничений.",
      cmp_col1: "Функция",
      cmp_col2: "Обычный Telegram",
      cmp_r1_k: "Количество аккаунтов",
      cmp_r1_v1: "3–4 шт.",
      cmp_r1_v2: "Безлимит (∞)",
      cmp_r2_k: "Секретный сейф переписок",
      cmp_yes: "PIN и Stealth режим",
      cmp_r3_k: "Windows Desktop + Прямое ТВ",
      cmp_tv_yes: ".exe + 29 каналов",
      cmp_r4_k: "Узбекская локализация",
      cmp_part: "Частично",
      cmp_full: "Полностью адаптировано",
      faq_pill: "Вопросы и ответы",
      faq_title: "Полезная информация",
      faq1_q: "Сохранятся ли старый Telegram и мои чаты после установки AeroGram?",
      faq1_a: "Да! AeroGram устанавливается как независимое приложение рядом с официальным клиентом, не затрагивая ваши данные.",
      faq2_q: "Сколько аккаунтов Telegram можно подключить?",
      faq2_a: "Начиная с версии v1.4.2 количество подключаемых аккаунтов не ограничено (∞), без требования Premium-подписки.",
      faq3_q: "Работает ли раздел ТВ во весь экран на телефоне?",
      faq3_a: "Да! Нажмите кнопку полноэкранного режима — трансляция плавно займёт весь экран смартфона или монитора.",
      faq4_q: "Где находится Секретный Сейф чатов?",
      faq4_a: "В v1.5.0 для Android и Windows сейф скрыт из обычных настроек: открывайте его через PIN в поиске, удержанием Studio или клавишами Ctrl+Shift+H.",
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
      bt4_d: "Удобный узбекский интерфейс, современный дизайн и работа рядом с Telegram.",
      sec_title: "Безопасно и Рядом с Telegram",
      sec_sub: "Устанавливается как отдельное приложение рядом с официальным Telegram — ваши старые чаты останутся нетронутыми.",
      chk_1: "Прямое защищённое соединение через официальные серверы Telegram",
      chk_2: "Все локальные настройки хранятся исключительно на вашем устройстве",
      chk_3: "Бесплатно, без рекламы и ограничений",
      sec_btn: "Скачать AeroGram",
      scr_pill: "Скриншоты AeroGram",
      scr_title: "Живые кадры <em class=\"serif-accent\">интерфейса</em>",
      sc1_t: "Просто, Быстро, Надёжно",
      sc1_d: "Официальная скорость Telegram и безлимитное облако",
      sc2_t: "Приятное Общение",
      sc2_d: "Защищённое шифрование и удобная среда для переписок",
      sc3_t: "Современный Интерфейс",
      sc3_d: "Полный контроль над внешним видом и комфортом",
      dl_sub: "Новогодняя скорость, Секретный сейф и синхронизация на всех устройствах.",
      dl_card_t: "AeroGram Android",
      dl_card_s: "Android v1.5.0 (.apk) • 52.13 MB",
      desk_card_t: "Для ноутбука (.exe)",
      desk_card_s: "Windows 10/11 Desktop и Секретный сейф",
      web_card_t: "AeroGram Web",
      web_card_s: "Открыть мессенджер прямо в браузере",
      well_pill: "2027 • Новый уровень",
      well_title: "Готовы вывести своё общение на новый уровень?",
      well_sub: "Скачайте AeroGram прямо сейчас и оцените лёгкость на телефоне и ноутбуке.",
      well_btn: "Скачать AeroGram",
      footer_sub: "Быстрый и удобный мессенджер для Android и Windows",
      footer_privacy: "Политика конфиденциальности",
      footer_contact: "Связаться",
      footer_copy: "© 2026–2027 AeroGram — С Новым годом! • <a href=\"https://aerogram.website\">aerogram.website</a>",
      mod_pill: "v1.5.0 • Новый релиз",
      mod_t: "Скачать AeroGram",
      mod_sub: "Android (.apk) и Windows (.exe) • v1.5.0",
      mod_btn: "Android: Скачать AeroGram.apk (52.13 MB)",
      mod_btn_win: "Ноутбук: Скачать AeroGram-Setup.exe (152.9 MB)",
      mod_btn_desk_page: "Страница для ноутбука (Инструкция и Portable .exe) →",
      mod_note: "<strong>Примечание:</strong> Если на Android при обновлении возникнет ошибка подписи, сначала удалите старую версию и установите v1.5.0 заново — все ваши чаты надёжно хранятся в облаке.",
      priv_t: "Политика конфиденциальности",
      priv_body: "<p>AeroGram не собирает личные переписки пользователей и не передаёт их на сторонние серверы. Все чаты, медиа и звонки работают через официальные защищённые серверы Telegram.</p><p>Локальные параметры оформления и настройки хранятся исключительно на устройстве пользователя.</p>",
    },
    en: {
      nav_features: "Features",
      nav_more: "Compare & FAQ",
      nav_laptop: "For Laptop",
      nav_tv: "Live TV",
      nav_apk: "Download",
      nav_web: "Open Web",
      nav_download: "Download",
      hero_chip: "2027 New Year Edition • v1.5.0",
      hero_title: "Light, Fast &<br><em class=\"serif-accent\">Thoughtful</em> Messaging",
      hero_desc: "Enjoy ultra-fast messaging, hide private chats inside a stealth Secret Vault, and stay synced across Android and Windows laptops.",
      hero_plat_t: "Holiday Season Release",
      hero_plat_s: "Android & Windows v1.5.0",
      hero_cta: "Download now",
      hero_laptop: "For Laptop (.exe) →",
      hero_web: "Open AeroGram on Web →",
      hero_tv: "Dedicated Live TV →",
      hf_vault_t: "Secret Vault",
      hf_vault_s: "Stealth PIN Access",
      hf_studio_t: "Studio v1.5",
      offer_pill: "Highlights",
      offer_title: "Pure Speed &<br><em class=\"serif-accent\">Comfort</em>",
      offer_sub: "Make more out of your daily messaging",
      of1_t: "Ultra-Fast Performance",
      of1_d: "Chats load instantaneously with fluid animations and reliable connection even on slow networks.",
      of2_t: "Crystal-Clear Calls",
      of2_d: "High-definition voice and video calls with smart bandwidth optimization.",
      of3_t: "Stealth Secret Vault",
      of3_d: "Keep private chats hidden from main lists and search — unlockable exclusively with your secret PIN.",
      of4_t: "Windows Laptop & Mobile Sync",
      of4_d: "Switch effortlessly between Android, Windows Desktop and browser with instant cloud access.",
      of6_t: "Unlimited Accounts (∞)",
      of6_d: "Connect as many Telegram accounts as you want in one app — no Premium caps and independent notifications per account.",
      of7_t: "Dedicated Live TV Section",
      of7_d: "Watch Zo‘r TV, Sevimli TV, Toshkent and 29 Uzbekistan TV channels smoothly in fullscreen on mobile or desktop.",
      of7_cta: "Open Live TV →",
      sb_pill: "Interactive Studio Sandbox",
      sb_title: "Test Stealth Secret Vault & Ghost Blur live",
      sb_desc: "Click the controls beside the phone or type PIN 2027 into search to see hidden chats and Ghost Blur in action.",
      sb_blur_btn: "Toggle Ghost Blur",
      sb_pin_btn: "Enter PIN: 2027",
      sb_reset: "Reset",
      sb_input_ph: "Search or type PIN (2027)...",
      sb_c1: "AeroGram Updates",
      sb_m1: "2027 New Year visual edition is active",
      sb_c2: "Family Chat",
      sb_m2: "Holiday wishes are ready!",
      sb_c3: "Design Studio",
      sb_m3: "Desktop .exe final verification",
      sb_unlocked: "Secret Chats Vault Unlocked",
      sb_sc1: "Private Vault Thread",
      sb_sm1: "Hidden from main chat list and search",
      sb_sc2: "Important Notes 2027",
      sb_sm2: "Auto-locks cleanly on exit",
      cap_pill_locked: "Sealed 2027 Time Capsule • Opens at 00:00",
      cap_title_locked: "At Midnight 2027 the entire site transforms automatically",
      cap_desc_locked: "At 00:00 UZT on Jan 1, 2027, a 40-second 3D WebGL keynote film with narration, Cosmic Prism visuals, and the Spatial Hub launch automatically.",
      cap_f1_t: "40s 3D WebGL Keynote & Voice",
      cap_f1_s: "Spatial 3D film synchronized with narration",
      cap_f2_t: "Cosmic Prism 2027 Visuals & Photos",
      cap_f2_s: "All hero shots, UI surfaces & buttons upgrade",
      cap_f3_t: "Interactive Spatial Platform Deck",
      cap_f3_s: "Unified Android, Windows & Stealth Vault",
      cap_pill_open: "Welcome to 2027! • Spatial Hub Live",
      cap_title_open: "AeroGram 2027 Cosmic Prism Hub",
      aura_prism: "Cosmic Prism",
      aura_glacier: "Glacier",
      aura_nebula: "Nebula",
      replay_3d_btn: "▶ 2027 3D Film (40s)",
      deck_tab1: "01 · Unified Space",
      deck_tab2: "02 · Stealth Vault 2.0",
      deck_tab3: "03 · 29+ Live Channels",
      deck_watch_btn: "Replay 40s 3D Keynote →",
      fut1_t: "Stealth Vault 2.0",
      fut1_d: "PIN-shielded invisible threads with biometric lock.",
      fut2_t: "Desktop & Mobile Continuity",
      fut2_d: "Instant handoff between Android phones and Windows.",
      fut3_t: "Full HD Live TV",
      fut3_d: "29 Uzbekistan stations streaming smoothly in HD.",
      tvs_pill: "Dedicated TV Section • Live",
      tvs_title: "Tashkent & Uzbekistan TV Channels — Fullscreen Ready",
      tvs_desc: "Watch Zo‘r TV, Sevimli TV, Toshkent, Milliy TV, Futbol TV and 29 live streams smoothly in Full HD on mobile or desktop.",
      tvs_btn: "Open TV Section →",
      tvs_note: "29 live channels • Full HD",
      cmp_pill: "Comparison",
      cmp_title: "Why AeroGram v1.5.0?",
      cmp_sub: "Everyday freedom without artificial account limits.",
      cmp_col1: "Feature",
      cmp_col2: "Standard Telegram",
      cmp_r1_k: "Connected Accounts",
      cmp_r1_v1: "3–4 max",
      cmp_r1_v2: "Unlimited (∞)",
      cmp_r2_k: "Stealth Secret Vault",
      cmp_yes: "PIN & Stealth mode",
      cmp_r3_k: "Windows Desktop + Live TV",
      cmp_tv_yes: ".exe + 29 channels",
      cmp_r4_k: "Uzbek UI Localization",
      cmp_part: "Partial",
      cmp_full: "Complete UI",
      faq_pill: "Questions & Answers",
      faq_title: "Quick Details",
      faq1_q: "Will installing AeroGram affect my official Telegram or chats?",
      faq1_a: "No. AeroGram installs as a separate package beside official Telegram, keeping all existing chats untouched.",
      faq2_q: "How many Telegram accounts can I add?",
      faq2_a: "Starting in v1.4.2, you can add unlimited (∞) accounts without any Premium restriction.",
      faq3_q: "Does the Live TV section support fullscreen on mobile phones?",
      faq3_a: "Yes! Tap the Fullscreen icon on the player to expand live broadcasts across your entire phone or computer screen.",
      faq4_q: "Where do I open the Secret Chats Vault?",
      faq4_a: "In v1.5.0 on Android and Windows, the Vault stays hidden from normal settings: type your secret PIN into search, long-press Studio, or press Ctrl+Shift+H.",
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
      bt4_d: "Installs side-by-side next to official Telegram with clean Uzbek localization.",
      sec_title: "Secure & Side-by-Side Ready",
      sec_sub: "Installs cleanly right beside your official Telegram app without touching existing chats or data.",
      chk_1: "Direct encrypted connection to official Telegram servers",
      chk_2: "All interface preferences stay strictly local on your device",
      chk_3: "Free forever, zero ads and zero limits",
      sec_btn: "Download AeroGram",
      scr_pill: "AeroGram screenshots",
      scr_title: "Inside the <em class=\"serif-accent\">Studio</em> experience",
      sc1_t: "Simple, Fast, Reliable",
      sc1_d: "Official Telegram speed with unlimited cloud storage",
      sc2_t: "Fun Chatting",
      sc2_d: "Protected encryption and effortless daily conversations",
      sc3_t: "Modern Interface",
      sc3_d: "You are in control — customize AeroGram your way",
      dl_sub: "New Year performance, Secret Vault privacy, and seamless cross-device sync.",
      dl_card_t: "AeroGram Android",
      dl_card_s: "Android v1.5.0 (.apk) • 52.13 MB",
      desk_card_t: "For Laptop (.exe)",
      desk_card_s: "Windows 10/11 Desktop & Secret Vault",
      web_card_t: "AeroGram Web",
      web_card_s: "Open messenger right here in your browser",
      well_pill: "2027 • Ready for more",
      well_title: "Ready to level up your daily messaging?",
      well_sub: "Download AeroGram now and enjoy sleek speed and privacy on mobile and laptops.",
      well_btn: "Download AeroGram",
      footer_sub: "Fast & Thoughtful Client for Android and Windows",
      footer_privacy: "Privacy Policy",
      footer_contact: "Contact Us",
      footer_copy: "© 2026–2027 AeroGram — Happy New Year! • <a href=\"https://aerogram.website\">aerogram.website</a>",
      mod_pill: "v1.5.0 • Latest Release",
      mod_t: "Download AeroGram",
      mod_sub: "Android (.apk) & Windows (.exe) • v1.5.0",
      mod_btn: "Android: Download AeroGram.apk (52.13 MB)",
      mod_btn_win: "Laptop: Download AeroGram-Setup.exe (152.9 MB)",
      mod_btn_desk_page: "Open Dedicated Laptop Page (Walkthrough & Portable .exe) →",
      mod_note: "<strong>Install note:</strong> If Android shows a signing conflict updating over an older build, uninstall the old version once and install v1.5.0 cleanly — all your Telegram chats stay safe in the cloud.",
      priv_t: "Privacy Policy",
      priv_body: "<p>AeroGram does not collect personal messages or send user data to third-party servers. All chats, media and calls run directly over Telegram's encrypted network.</p><p>Local appearance and user interface preferences stay strictly on your device.</p>",
    },
  };

  function setLang(lang) {
    const t = dict[lang] || dict.uz;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (t[k]) el.innerHTML = t[k];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const k = el.getAttribute("data-i18n-ph");
      if (t[k]) el.setAttribute("placeholder", t[k]);
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

  // 8. Modals (Download & Privacy Policy)
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
      sheet?.setAttribute("hidden", "");
      burger?.setAttribute("aria-expanded", "false");
    }
  });
})();
