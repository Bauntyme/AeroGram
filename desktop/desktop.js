(function () {
  'use strict';

  // 1. Sync Theme
  const themeBtn = document.getElementById('desk-theme-toggle');
  const savedTheme = localStorage.getItem('aero_theme_v2');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aero_theme_v2', next);
  });

  // 2. Mobile Sheet
  const burger = document.getElementById('desk-burger');
  const sheet = document.getElementById('desk-mobile-sheet');
  burger?.addEventListener('click', () => {
    const hidden = sheet.hasAttribute('hidden');
    if (hidden) {
      sheet.removeAttribute('hidden');
      burger.setAttribute('aria-expanded', 'true');
    } else {
      sheet.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
  sheet?.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      sheet.setAttribute('hidden', '');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  // 3. Interactive Windows 11 App Simulator
  function switchLpTab(target) {
    document.querySelectorAll('.lp-tab').forEach((t) => t.classList.toggle('active', t.dataset.lpTab === target));
    document.querySelectorAll('.lp-pane').forEach((p) => p.classList.toggle('active', p.dataset.lpPane === target));
  }

  document.querySelectorAll('.lp-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchLpTab(tab.dataset.lpTab));
  });

  const lpSim = document.getElementById('lp-simulator');
  const lpPinInput = document.getElementById('lp-pin-input');
  const lpPinDemoBtn = document.getElementById('lp-test-pin-btn');
  const lpBlurBtn = document.getElementById('lp-toggle-blur');
  const lpBlurState = document.getElementById('lp-blur-state');
  const lpLockBtn = document.getElementById('lp-toggle-lock');
  const lpLockState = document.getElementById('lp-lock-state');

  lpPinInput?.addEventListener('input', () => {
    if (lpPinInput.value.trim() === '2027') {
      switchLpTab('vault');
    }
  });

  lpPinDemoBtn?.addEventListener('click', () => {
    if (!lpPinInput) {
      switchLpTab('vault');
      return;
    }
    lpPinInput.value = '';
    const digits = ['2', '0', '2', '7'];
    digits.forEach((d, idx) => {
      setTimeout(() => {
        lpPinInput.value += d;
        if (idx === digits.length - 1) {
          setTimeout(() => switchLpTab('vault'), 160);
        }
      }, idx * 100);
    });
  });

  lpBlurBtn?.addEventListener('click', () => {
    const on = lpSim?.classList.toggle('is-blurred');
    lpBlurBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (lpBlurState) {
      lpBlurState.textContent = on ? 'ON' : 'OFF';
      lpBlurState.classList.toggle('pill-on', Boolean(on));
    }
  });

  lpLockBtn?.addEventListener('click', () => {
    const wasOn = lpLockBtn.getAttribute('aria-pressed') === 'true';
    const nextOn = !wasOn;
    lpLockBtn.setAttribute('aria-pressed', nextOn ? 'true' : 'false');
    if (lpLockState) {
      lpLockState.textContent = nextOn ? 'ON' : 'OFF';
      lpLockState.classList.toggle('pill-on', nextOn);
    }
  });

  // 4. Bottom Interactive Walkthrough Carousel ("pastida o'tkazish bo'ladi")
  const track = document.getElementById('car-track');
  const viewport = document.getElementById('car-viewport');
  const counter = document.getElementById('car-counter');
  const progressFill = document.getElementById('car-progress-fill');
  const dots = Array.from(document.querySelectorAll('.car-dot'));
  const totalSlides = dots.length || 5;
  let slideIdx = 0;

  function goToSlide(nextIdx) {
    slideIdx = ((nextIdx % totalSlides) + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translate3d(-${slideIdx * 100}%, 0, 0)`;
    }
    if (counter) {
      counter.textContent = `0${slideIdx + 1} / 0${totalSlides}`;
    }
    if (progressFill) {
      progressFill.style.width = `${((slideIdx + 1) / totalSlides) * 100}%`;
    }
    dots.forEach((d, idx) => d.classList.toggle('active', idx === slideIdx));
  }

  document.getElementById('car-prev')?.addEventListener('click', () => goToSlide(slideIdx - 1));
  document.getElementById('car-next')?.addEventListener('click', () => goToSlide(slideIdx + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide || 0)));
  });

  let dragStartX = null;
  viewport?.addEventListener('pointerdown', (e) => { dragStartX = e.clientX; });
  viewport?.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const dx = e.clientX - dragStartX;
    dragStartX = null;
    if (Math.abs(dx) > 42) {
      goToSlide(dx < 0 ? slideIdx + 1 : slideIdx - 1);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') goToSlide(slideIdx + 1);
    if (e.key === 'ArrowLeft') goToSlide(slideIdx - 1);
  });

  // 5. Full O‘Z / RU / EN Localization (Zero raw emojis)
  const dict = {
    uz: {
      nav_home: 'Bosh sahifa',
      nav_laptop: 'Laptop uchun',
      nav_guide: 'Qo‘llanma',
      nav_tv: 'Alohida TV uchun',
      nav_web: 'AeroGram Web',
      nav_dl: 'Yuklash (.exe)',
      hero_chip: 'AeroGram Desktop v1.5.0 • 2027 Nashri',
      hero_title: 'Noutbuk va Kompyuter uchun<br><em class="serif-accent">Qulay</em> va Maxfiy AeroGram',
      hero_desc: 'Katta ekranda bir vaqtda o‘nlab akkauntlarni boshqaring, muhim suhbatlarni Maxfiy Seyfga yashiring va yangilangan Studio sozlamalaridan foydalaning.',
      btn_setup: 'AeroGram-Setup.exe yuklash (152.9 MB)',
      btn_portable: 'Portable .exe (143.9 MB)',
      sp1_k: 'O‘rnatgich (.exe)',
      sp1_v: 'Windows 10/11 • 152.9 MB',
      sp2_k: 'Maxfiy Seyf',
      sp2_v: 'PIN & Ctrl+Shift+H',
      sp3_k: 'Cheksiz Akkauntlar',
      sp3_v: 'Bitta oynada ∞ profil',
      tab_chats: 'Chatlar',
      tab_vault: 'Maxfiy Seyf',
      tab_studio: 'Studio',
      lp_search: 'Qidiruv (PIN: 2027)...',
      lp_try_pin: 'PIN sinash',
      lp_c1: 'AeroGram Rasmiy',
      lp_m1: 'v1.5.0 Windows relizi chiqdi!',
      lp_c2: 'Ish Guruhi',
      lp_m2: 'Loyiha fayllari yuborildi',
      lp_c3: 'Toshkent TV Klubi',
      lp_m3: 'Futbol TV jonli efir boshlandi',
      lp_online: 'Tezkor MTProto',
      lp_b1: 'O‘ng tugma bilan istalgan chatni Maxfiy Seyfga yashirishingiz mumkin.',
      lp_b2: 'Qidiruvga PIN kiritilsa darhol maxfiy seyf ochiladi!',
      lp_vh_t: 'Maxfiy Chatlar Seyfi Ochiq',
      lp_vh_s: 'Asosiy ro‘yxatdan yashirilgan • Ctrl+Shift+H',
      lp_vc1: 'Shaxsiy Hamkor',
      lp_vc2: 'VIP Mijozlar',
      lp_v_open: 'Ochish →',
      lp_st_t: 'AeroGram Desktop Studio v1.5.0',
      lp_st_s: 'O‘Z / RU / EN • Ghost Blur • Ilova Qulfi',
      lp_sr1: 'Chatlarni xiralashtirish (Ghost Blur)',
      lp_sr2: 'Yig‘ilganda avtomatik qulflash',
      lp_sr3: 'Akkauntlar uyasi (∞)',
      feat_pill: 'Windows Imkoniyatlari',
      feat_title: 'Laptopda ishlash uchun <em class="serif-accent">mukammal</em>',
      feat_sub: 'Oddiy brauzerdan farqli o‘laroq mustaqil oyna, System Tray va maxfiy vositalar bilan keladi.',
      f1_t: 'Yaxshilangan Maxfiy Chatlar Seyfi',
      f1_d: 'Maxfiy chatlar endi sozlamalarda ko‘rinib turmaydi. Ularni faqat Qidiruvga PIN kodingizni yozib, AeroGram Studio tugmasini bosib turib yoki Ctrl+Shift+H orqali ochasiz.',
      f2_t: 'Yangilangan Studio Sozlamalar',
      f2_d: 'Ctrl+, bilan zamonaviy Studio oynasini oching: O‘Z / RU / EN til almashtirish, Ghost Blur (chatlarni xiralashtirish), masshtab va Ctrl+L tezkor qulf.',
      f3_t: 'Cheksiz Akkauntlar (∞)',
      f3_d: 'Shaxsiy, ish va biznes Telegram profillaringizni bitta Windows dasturida parallel ishlating — cheklovlarsiz.',
      f4_t: 'Windows Tray & Jonli TV',
      f4_d: 'Soat yonidagi Tray ikonkasi orqali tezkor qulflang, seyfni oching yoki 29 ta Toshkent TV kanallarini alohida HD oynada tomosha qiling.',
      car_pill: 'Qadam-baqadam qo‘llanma',
      car_title: 'Laptopda qanday <em class="serif-accent">ishlatiladi?</em>',
      s1_tag: 'Yuklash va O‘rnatish',
      s1_t: 'Setup.exe yoki Portable.exe tanlang',
      s1_d: 'Doimiy foydalanish uchun AeroGram-Setup.exe ni o‘rnating (Ish stolida yorliq ochadi). O‘rnatmasdan yoki fleshkadan ishga tushirish uchun AeroGram-Desktop.exe ni bosing.',
      s2_tag: 'Tezkor Kirish',
      s2_t: 'QR-kod yoki telefon bilan 3 soniyada kiring',
      s2_d: 'Telefoningizdagi AeroGram orqali QR-kodni skanerlang yoki raqamingizni kiriting. Barcha chatlar, papkalar va fayllar darhol sinxronlanadi.',
      s2_vis: 'QR Skaner → Bulut Sinxron',
      s3_tag: 'Maxfiy Chatlar Seyfi',
      s3_t: 'Chatlarni ko‘zdan yashiring va Qidiruvda PIN bilan oching',
      s3_d: 'Suhbat ustida o‘ng tugmani bosib «Maxfiy seyfga yashirish»ni tanlang. Ochish uchun Qidiruv maydoniga PIN kodingizni yozing yoki Ctrl+Shift+H bosing.',
      s3_vis: 'PIN kiritish yoki tezkor tugma',
      s4_tag: 'Studio & Maxfiylik',
      s4_t: 'Ghost Blur, Ilova Qulfi va O‘Z / RU / EN til',
      s4_d: 'Pastki o‘ng burchakdagi «AeroGram Studio» tugmasini bosing (yoki Ctrl+,): chat sarlavhalarini xiralashtiring, masshtabni sozlang va Ctrl+L bilan qulflang.',
      s5_tag: 'Akkauntlar & Jonli TV',
      s5_t: 'Cheksiz akkauntlar va 29 ta Toshkent TV kanali',
      s5_d: 'Studio bo‘limidan istalgancha Telegram akkauntini almashtiring hamda System Tray orqali Zo‘r TV, Sevimli TV va Sport TV ni alohida oynada oching.',
      s5_vis: 'Akkaunt 1..∞ & Full HD TV',
      footer_sub: 'Android va Windows Laptop uchun tezkor messenjer',
      footer_contact: 'Bog‘lanish',
      footer_copy: '© 2026–2027 AeroGram — Yangi yil bilan! • <a href="https://aerogram.website">aerogram.website</a>',
    },
    ru: {
      nav_home: 'Главная',
      nav_laptop: 'Для ноутбука',
      nav_guide: 'Инструкция',
      nav_tv: 'Раздел для ТВ',
      nav_web: 'AeroGram Web',
      nav_dl: 'Скачать (.exe)',
      hero_chip: 'AeroGram Desktop v1.5.0 • Выпуск 2027',
      hero_title: 'Удобный и Секретный AeroGram<br><em class="serif-accent">для</em> Ноутбука и ПК',
      hero_desc: 'Ведите десятки аккаунтов на большом экране, прячьте важные переписки в Секретный сейф и настраивайте клиент в обновлённой панели Studio.',
      btn_setup: 'Скачать AeroGram-Setup.exe (152.9 MB)',
      btn_portable: 'Portable .exe (143.9 MB)',
      sp1_k: 'Установщик (.exe)',
      sp1_v: 'Windows 10/11 • 152.9 MB',
      sp2_k: 'Секретный сейф',
      sp2_v: 'PIN и Ctrl+Shift+H',
      sp3_k: 'Безлимит аккаунтов',
      sp3_v: '∞ профилей в одном окне',
      tab_chats: 'Чаты',
      tab_vault: 'Секретный сейф',
      tab_studio: 'Studio',
      lp_search: 'Поиск (PIN: 2027)...',
      lp_try_pin: 'Тест PIN',
      lp_c1: 'AeroGram Official',
      lp_m1: 'Вышел релиз v1.5.0 для Windows!',
      lp_c2: 'Рабочая группа',
      lp_m2: 'Файлы проекта отправлены',
      lp_c3: 'Ташкент ТВ Клуб',
      lp_m3: 'Прямой эфир Futbol TV начался',
      lp_online: 'Прямой MTProto',
      lp_b1: 'Правой кнопкой мыши можно скрыть любой чат в Секретный сейф.',
      lp_b2: 'Введите PIN в строку поиска — и сейф откроется мгновенно!',
      lp_vh_t: 'Секретный сейф открыт',
      lp_vh_s: 'Скрыт из общего списка • Ctrl+Shift+H',
      lp_vc1: 'Личный контакт',
      lp_vc2: 'VIP Клиенты',
      lp_v_open: 'Открыть →',
      lp_st_t: 'AeroGram Desktop Studio v1.5.0',
      lp_st_s: 'O‘Z / RU / EN • Ghost Blur • Блокировка',
      lp_sr1: 'Размытие списка чатов (Ghost Blur)',
      lp_sr2: 'Автоблокировка при сворачивании',
      lp_sr3: 'Слоты аккаунтов (∞)',
      feat_pill: 'Возможности для Windows',
      feat_title: 'Идеален для работы на <em class="serif-accent">ноутбуке</em>',
      feat_sub: 'Отдельное нативное окно, иконка в трее Windows, горячие клавиши и защита переписок.',
      f1_t: 'Улучшенный Секретный сейф чатов',
      f1_d: 'Скрытые чаты не выдают себя в настройках. Доступ к ним открывается только по вашему PIN в поиске, удержанием кнопки Studio или через Ctrl+Shift+H.',
      f2_t: 'Обновлённый дизайн настроек Studio',
      f2_d: 'Нажмите Ctrl+, — смена языка O‘Z / RU / EN, размытие чатов (Ghost Blur), выбор масштаба экрана и быстрая блокировка Ctrl+L.',
      f3_t: 'Безлимитные аккаунты (∞)',
      f3_d: 'Держите личный и рабочие профили Telegram в одном окне Windows без ограничений.',
      f4_t: 'Трей Windows и Прямое ТВ',
      f4_d: 'Быстрая блокировка и доступ к сейфу из системного трея, а также 29 каналов Ташкента в отдельном окне.',
      car_pill: 'Пошаговый гид',
      car_title: 'Как пользоваться на <em class="serif-accent">ноутбуке?</em>',
      s1_tag: 'Загрузка и установка',
      s1_t: 'Выберите Setup.exe или Portable.exe',
      s1_d: 'Для постоянной работы установите AeroGram-Setup.exe (создаст ярлык на Рабочем столе). Для запуска без установки или с флешки откройте AeroGram-Desktop.exe.',
      s2_tag: 'Быстрый вход',
      s2_t: 'Вход по QR-коду или номеру за 3 секунды',
      s2_d: 'Отсканируйте QR-код с телефона или введите номер. Все чаты, папки и медиа синхронизируются мгновенно.',
      s2_vis: 'Сканер QR → Синхронизация',
      s3_tag: 'Секретный сейф',
      s3_t: 'Прячьте чаты и открывайте через PIN в поиске',
      s3_d: 'Нажмите правой кнопкой по чату → «Скрыть в Секретный сейф». Чтобы открыть сейф, введите PIN в поиске или нажмите Ctrl+Shift+H.',
      s3_vis: 'Ввод PIN или горячие клавиши',
      s4_tag: 'Studio и Приватность',
      s4_t: 'Ghost Blur, Блокировка и языки O‘Z / RU / EN',
      s4_d: 'Нажмите «AeroGram Studio» внизу справа (или Ctrl+,): включите размытие чатов, настройте масштаб и блокируйте экран клавишами Ctrl+L.',
      s5_tag: 'Аккаунты и ТВ',
      s5_t: 'Безлимит аккаунтов и 29 каналов Ташкента',
      s5_d: 'Переключайте неограниченное число профилей прямо из Studio и открывайте Zo‘r TV, Sevimli TV и Sport TV из системного трея.',
      s5_vis: 'Аккаунт 1..∞ и Full HD ТВ',
      footer_sub: 'Быстрый мессенджер для Android и Windows',
      footer_contact: 'Связаться',
      footer_copy: '© 2026–2027 AeroGram — С Новым годом! • <a href="https://aerogram.website">aerogram.website</a>',
    },
    en: {
      nav_home: 'Home',
      nav_laptop: 'For Laptop',
      nav_guide: 'Walkthrough',
      nav_tv: 'Live TV',
      nav_web: 'AeroGram Web',
      nav_dl: 'Download (.exe)',
      hero_chip: 'AeroGram Desktop v1.5.0 • 2027 Edition',
      hero_title: 'Fast & Private AeroGram<br><em class="serif-accent">Built</em> for Windows Laptops',
      hero_desc: 'Run unlimited Telegram accounts on your big screen, tuck private chats inside the stealth Secret Vault, and customize everything in the redesigned Studio settings.',
      btn_setup: 'Download AeroGram-Setup.exe (152.9 MB)',
      btn_portable: 'Portable .exe (143.9 MB)',
      sp1_k: 'Windows (.exe)',
      sp1_v: 'Windows 10/11 • 152.9 MB',
      sp2_k: 'Secret Vault',
      sp2_v: 'PIN & Ctrl+Shift+H',
      sp3_k: 'Unlimited Accounts',
      sp3_v: '∞ profiles in one window',
      tab_chats: 'Chats',
      tab_vault: 'Secret Vault',
      tab_studio: 'Studio',
      lp_search: 'Search (PIN: 2027)...',
      lp_try_pin: 'Try PIN',
      lp_c1: 'AeroGram Official',
      lp_m1: 'v1.5.0 Windows release is live!',
      lp_c2: 'Work Team',
      lp_m2: 'Project files delivered',
      lp_c3: 'Tashkent TV Club',
      lp_m3: 'Futbol TV stream started',
      lp_online: 'Direct MTProto',
      lp_b1: 'Right-click any chat to hide it inside the stealth Secret Vault.',
      lp_b2: 'Type your PIN into Search to unlock hidden conversations right away!',
      lp_vh_t: 'Secret Chats Vault Unlocked',
      lp_vh_s: 'Hidden from main chat list • Ctrl+Shift+H',
      lp_vc1: 'Private Partner',
      lp_vc2: 'VIP Clients',
      lp_v_open: 'Open →',
      lp_st_t: 'AeroGram Desktop Studio v1.5.0',
      lp_st_s: 'O‘Z / RU / EN • Ghost Blur • App Lock',
      lp_sr1: 'Blur chat titles (Ghost Blur)',
      lp_sr2: 'Auto-lock on window minimize',
      lp_sr3: 'Account slots (∞)',
      feat_pill: 'Desktop Highlights',
      feat_title: 'Tailored for <em class="serif-accent">Laptops</em> & PCs',
      feat_sub: 'Native Windows windowing, system tray shortcuts, and discreet privacy protection.',
      f1_t: 'Upgraded Stealth Secret Vault',
      f1_d: 'Hidden chats never expose themselves in normal menus. Unlock only by typing your PIN into search, long-pressing the Studio pill, or pressing Ctrl+Shift+H.',
      f2_t: 'Redesigned Studio Settings',
      f2_d: 'Press Ctrl+, to switch O‘Z / RU / EN languages, toggle Ghost Blur, scale UI zoom, or lock instantaneously with Ctrl+L.',
      f3_t: 'Unlimited Accounts (∞)',
      f3_d: 'Switch effortlessly between personal, work, and community Telegram accounts inside one app.',
      f4_t: 'Windows System Tray & Live TV',
      f4_d: 'Quick-lock, open your Vault, or launch 29 Uzbekistan HD TV channels straight from the taskbar tray.',
      car_pill: 'Step-by-Step Guide',
      car_title: 'How AeroGram <em class="serif-accent">Works</em> on Laptop',
      s1_tag: 'Download & Install',
      s1_t: 'Pick Setup.exe or Portable.exe',
      s1_d: 'Install AeroGram-Setup.exe for Desktop and Start Menu shortcuts, or run AeroGram-Desktop.exe directly without installation.',
      s2_tag: 'Instant Sign In',
      s2_t: 'Sign in with QR or phone in 3 seconds',
      s2_d: 'Scan the QR code from AeroGram on your phone or enter your number for immediate cloud sync.',
      s2_vis: 'Scan QR → Instant Cloud Sync',
      s3_tag: 'Secret Chats Vault',
      s3_t: 'Hide chats & unlock via Search PIN',
      s3_d: 'Right-click any chat → Hide in Secret Vault. Reopen anytime by typing your PIN into search or pressing Ctrl+Shift+H.',
      s3_vis: 'Type PIN or shortcut key',
      s4_tag: 'Studio & Privacy',
      s4_t: 'Ghost Blur, App Lock & O‘Z / RU / EN UI',
      s4_d: 'Click AeroGram Studio at bottom-right (or Ctrl+,) to toggle Ghost Blur, UI scaling, and Ctrl+L screen lock.',
      s5_tag: 'Accounts & Live TV',
      s5_t: 'Unlimited accounts & 29 Uzbekistan TV channels',
      s5_d: 'Switch account slots from Studio and open live Full HD TV in a separate window from the system tray.',
      s5_vis: 'Account 1..∞ & Full HD TV',
      footer_sub: 'Fast & Private Client for Android and Windows Laptops',
      footer_contact: 'Contact Us',
      footer_copy: '© 2026–2027 AeroGram — Happy New Year! • <a href="https://aerogram.website">aerogram.website</a>',
    },
  };

  const langTrigger = document.getElementById('desk-lang-trigger');
  const langMenu = document.getElementById('desk-lang-menu');
  const currentFlag = document.getElementById('desk-current-flag');
  const currentLabel = document.getElementById('desk-current-lang-label');

  function setLang(lang) {
    const t = dict[lang] || dict.uz;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-desk-i18n]').forEach((el) => {
      const k = el.getAttribute('data-desk-i18n');
      if (t[k]) el.innerHTML = t[k];
    });
    document.querySelectorAll('[data-desk-ph]').forEach((el) => {
      const k = el.getAttribute('data-desk-ph');
      if (t[k]) el.setAttribute('placeholder', t[k]);
    });
    const opt = langMenu?.querySelector(`[data-lang="${lang}"]`);
    if (opt && currentFlag && currentLabel) {
      const svg = opt.querySelector('svg')?.cloneNode(true);
      if (svg) {
        currentFlag.innerHTML = '';
        currentFlag.appendChild(svg);
      }
      currentLabel.textContent = opt.querySelector('span')?.textContent || lang.toUpperCase();
    }
    langMenu?.querySelectorAll('.lang-opt').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    localStorage.setItem('aero_lang_v2', lang);
  }

  langTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = langMenu.hasAttribute('hidden');
    if (open) {
      langMenu.removeAttribute('hidden');
      langTrigger.setAttribute('aria-expanded', 'true');
    } else {
      langMenu.setAttribute('hidden', '');
      langTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  langMenu?.querySelectorAll('.lang-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
      langMenu.setAttribute('hidden', '');
      langTrigger?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', () => {
    langMenu?.setAttribute('hidden', '');
    langTrigger?.setAttribute('aria-expanded', 'false');
  });

  const savedLang = localStorage.getItem('aero_lang_v2');
  if (savedLang && dict[savedLang]) setLang(savedLang);
})();
