(function () {
  "use strict";

  const CHANNELS = [
    { id: "zor-tv", code: "ZO‘R", logo: "logos/zor-tv.png", grad: "linear-gradient(135deg,#7C3AED,#EC4899)", name: "Zo‘r TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1016/playlist.m3u8" },
    { id: "sevimli", code: "SEV", logo: "logos/sevimli.png", grad: "linear-gradient(135deg,#E11D48,#F97316)", name: "Sevimli TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1017/playlist.m3u8" },
    { id: "toshkent", code: "TOSH", logo: "logos/toshkent.png", grad: "linear-gradient(135deg,#0284C7,#1D4ED8)", name: "Toshkent", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1003/playlist.m3u8" },
    { id: "milliy", code: "MLY", logo: "logos/milliy.png", grad: "linear-gradient(135deg,#0D9488,#059669)", name: "Milliy TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1014/playlist.m3u8" },
    { id: "my5", code: "MY5", logo: "logos/my5.png", grad: "linear-gradient(135deg,#2563EB,#38BDF8)", name: "MY5 (Mening Yurtim)", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1217/playlist.m3u8" },
    { id: "futbol-tv", code: "FTB", logo: "logos/futbol-tv.png", grad: "linear-gradient(135deg,#16A34A,#15803D)", name: "Futbol TV", cat: "sport", catLabel: { uz: "Sport", ru: "Спорт", en: "Sports" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1010/playlist.m3u8" },
    { id: "sport", code: "SPR", logo: "logos/sport.png", grad: "linear-gradient(135deg,#0369A1,#0EA5E9)", name: "Sport TV", cat: "sport", catLabel: { uz: "Sport", ru: "Спорт", en: "Sports" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1004/playlist.m3u8" },
    { id: "uzbekiston-24", code: "UZ24", logo: "logos/uzbekiston-24.png", grad: "linear-gradient(135deg,#DC2626,#991B1B)", name: "O‘zbekiston 24", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1011/playlist.m3u8" },
    { id: "ozbekiston", code: "O‘ZB", logo: "logos/ozbekiston.png", grad: "linear-gradient(135deg,#0EA5E9,#1E3A8A)", name: "O‘zbekiston", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1001/playlist.m3u8" },
    { id: "yoshlar", code: "YSH", logo: "logos/yoshlar.png", grad: "linear-gradient(135deg,#F59E0B,#EA580C)", name: "Yoshlar", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1002/playlist.m3u8" },
    { id: "kinoteatr", code: "KINO", logo: "logos/kinoteatr.png", grad: "linear-gradient(135deg,#6D28D9,#312E81)", name: "Kinoteatr", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1009/playlist.m3u8" },
    { id: "uzreport", code: "UZR", logo: "logos/uzreport.jpg", grad: "linear-gradient(135deg,#1D4ED8,#0F172A)", name: "UzReport TV", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1015/playlist.m3u8" },
    { id: "ftv", code: "FTV", logo: "logos/ftv.jpg", grad: "linear-gradient(135deg,#DB2777,#7C3AED)", name: "FTV (Musiqa)", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1018/playlist.m3u8" },
    { id: "muz-tv", code: "MUZ", logo: "logos/muz-tv.jpg", grad: "linear-gradient(135deg,#9333EA,#4F46E5)", name: "Muz TV", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1063/playlist.m3u8" },
    { id: "navo", code: "NAVO", logo: "logos/navo.png", grad: "linear-gradient(135deg,#EC4899,#F43F5E)", name: "Navo", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1008/playlist.m3u8" },
    { id: "bolajon", code: "BOL", logo: "logos/bolajon.png", grad: "linear-gradient(135deg,#F97316,#EAB308)", name: "Bolajon", cat: "kids", catLabel: { uz: "Bolalar", ru: "Детский", en: "Kids" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1007/playlist.m3u8" },
    { id: "aqlvoy", code: "AQL", logo: "logos/aqlvoy.png", grad: "linear-gradient(135deg,#06B6D4,#3B82F6)", name: "Aqlvoy", cat: "kids", catLabel: { uz: "Bolalar", ru: "Детский", en: "Kids" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1205/playlist.m3u8" },
    { id: "dunyo-boylab", code: "DNY", logo: "logos/dunyo-boylab.png", grad: "linear-gradient(135deg,#0891B2,#0F766E)", name: "Dunyo bo‘ylab", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1006/playlist.m3u8" },
    { id: "ozbekiston-tarixi", code: "TAR", logo: "logos/ozbekiston-tarixi.png", grad: "linear-gradient(135deg,#B45309,#78350F)", name: "O‘zbekiston Tarixi", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1209/playlist.m3u8" },
    { id: "madaniyat", code: "MAD", logo: "logos/madaniyat.png", grad: "linear-gradient(135deg,#7E22CE,#6B21A8)", name: "Madaniyat va ma‘rifat", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1005/playlist.m3u8" },
    { id: "mahalla", code: "MHL", logo: "logos/mahalla.png", grad: "linear-gradient(135deg,#059669,#10B981)", name: "Mahalla", cat: "tashkent", catLabel: { uz: "Toshkent & Asosiy", ru: "Ташкент и основные", en: "Tashkent & Main" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1013/playlist.m3u8" },
    { id: "renessans", code: "REN", logo: "logos/renessans.png", grad: "linear-gradient(135deg,#0284C7,#6366F1)", name: "Renessans TV", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1221/playlist.m3u8" },
    { id: "dasturxon", code: "DST", logo: "logos/dasturxon.jpg", grad: "linear-gradient(135deg,#EA580C,#DC2626)", name: "Dasturxon TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1206/playlist.m3u8" },
    { id: "makon", code: "MKN", logo: "logos/makon.png", grad: "linear-gradient(135deg,#4F46E5,#0EA5E9)", name: "Makon TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1497/playlist.m3u8" },
    { id: "nurafshon", code: "NUR", logo: "logos/nurafshon.jpg", grad: "linear-gradient(135deg,#0EA5E9,#2563EB)", name: "Nurafshon TV", cat: "regions", catLabel: { uz: "Hududiy", ru: "Региональный", en: "Regional" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1220/playlist.m3u8" },
    { id: "taraqqiyot", code: "TRQ", logo: "logos/taraqqiyot.jpg", grad: "linear-gradient(135deg,#0D9488,#0284C7)", name: "Taraqqiyot TV", cat: "regions", catLabel: { uz: "Hududiy", ru: "Региональный", en: "Regional" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1204/playlist.m3u8" },
    { id: "fargona", code: "FAR", logo: "logos/fargona.jpg", grad: "linear-gradient(135deg,#16A34A,#0D9488)", name: "Farg‘ona MTRK", cat: "regions", catLabel: { uz: "Hududiy", ru: "Региональный", en: "Regional" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1458/playlist.m3u8" },
    { id: "navoiy", code: "NVY", logo: "logos/navoiy.png", grad: "linear-gradient(135deg,#D97706,#B45309)", name: "Navoiy MTRK", cat: "regions", catLabel: { uz: "Hududiy", ru: "Региональный", en: "Regional" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1460/playlist.m3u8" },
    { id: "qaraqalpaqstan", code: "QQP", logo: "logos/qaraqalpaqstan.png", grad: "linear-gradient(135deg,#0369A1,#1E40AF)", name: "Qaraqalpaqstan", cat: "regions", catLabel: { uz: "Hududiy", ru: "Региональный", en: "Regional" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1467/playlist.m3u8" },
    { id: "biz-tv", code: "BIZ", logo: "logos/biz-tv.png", grad: "linear-gradient(135deg,#0EA5E9,#0284C7)", name: "BIZ TV", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1211/playlist.m3u8" },
    { id: "biz-cinema", code: "BIZC", logo: "logos/biz-cinema.png", grad: "linear-gradient(135deg,#4F46E5,#0EA5E9)", name: "BIZ Cinema", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1213/playlist.m3u8" },
    { id: "biz-music", code: "BIZM", logo: "logos/biz-music.jpg", grad: "linear-gradient(135deg,#EC4899,#BE185D)", name: "BIZ Music", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1212/playlist.m3u8" },
    { id: "kinopremyera", code: "PREM", logo: "logos/kinopremyera.png", grad: "linear-gradient(135deg,#DC2626,#7F1D1D)", name: "Kinopremyera", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1207/playlist.m3u8" },
    { id: "viju-action", code: "ACT", logo: "logos/viju-action.png", grad: "linear-gradient(135deg,#EA580C,#9A3412)", name: "viju TV1000 Action", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1225/playlist.m3u8" },
    { id: "kinohit", code: "KHIT", logo: "logos/kinohit.png", grad: "linear-gradient(135deg,#4338CA,#1E1B4B)", name: "KinoHit", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1055/playlist.m3u8" },
    { id: "dorama", code: "DORM", logo: "logos/dorama.png", grad: "linear-gradient(135deg,#DB2777,#831843)", name: "Dorama", cat: "entertainment", catLabel: { uz: "Ko‘ngilochar", ru: "Развлекательный", en: "Entertainment" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1273/playlist.m3u8" },
    { id: "viju-sport", code: "VSPT", logo: "logos/viju-sport.png", grad: "linear-gradient(135deg,#059669,#064E3B)", name: "viju+ Sport", cat: "sport", catLabel: { uz: "Sport", ru: "Спорт", en: "Sports" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1229/playlist.m3u8" },
    { id: "mma-tv", code: "MMA", logo: "logos/mma-tv.png", grad: "linear-gradient(135deg,#DC2626,#18181B)", name: "MMA-TV", cat: "sport", catLabel: { uz: "Sport", ru: "Спорт", en: "Sports" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1226/playlist.m3u8" },
    { id: "euronews", code: "EURO", logo: "logos/euronews.png", grad: "linear-gradient(135deg,#0284C7,#0F172A)", name: "Euronews", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1024/playlist.m3u8" },
    { id: "bbc-news", code: "BBC", logo: "logos/bbc-news.png", grad: "linear-gradient(135deg,#B91C1C,#7F1D1D)", name: "BBC News", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1251/playlist.m3u8" },
    { id: "mir-24", code: "MIR", logo: "logos/mir-24.png", grad: "linear-gradient(135deg,#16A34A,#14532D)", name: "Mir 24", cat: "news", catLabel: { uz: "Yangiliklar", ru: "Новости", en: "News" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1219/playlist.m3u8" },
    { id: "viju-nature", code: "NATR", logo: "logos/viju-nature.png", grad: "linear-gradient(135deg,#059669,#14532D)", name: "viju Nature", cat: "doc", catLabel: { uz: "Tabiat & Fan", ru: "Природа и Наука", en: "Nature & Science" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1228/playlist.m3u8" },
    { id: "da-vinci", code: "DVNC", logo: "logos/da-vinci.png", grad: "linear-gradient(135deg,#0284C7,#0C4A6E)", name: "Da Vinci", cat: "doc", catLabel: { uz: "Tabiat & Fan", ru: "Природа и Наука", en: "Nature & Science" }, maxQ: "1080p FHD", isFhd: true, url: "https://stream3.cinerama.uz/1231/playlist.m3u8" },
    { id: "mult", code: "MULT", logo: "logos/mult.png", grad: "linear-gradient(135deg,#2563EB,#1E3A8A)", name: "Mult", cat: "kids", catLabel: { uz: "Bolalar", ru: "Детский", en: "Kids" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1246/playlist.m3u8" },
    { id: "ru-tv", code: "RUTV", logo: "logos/ru-tv.png", grad: "linear-gradient(135deg,#7C3AED,#4C1D95)", name: "RU.TV", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1202/playlist.m3u8" },
    { id: "trt-muzik", code: "TRTM", logo: "logos/trt-muzik.png", grad: "linear-gradient(135deg,#0369A1,#082F49)", name: "TRT Muzik", cat: "music", catLabel: { uz: "Kino & Musiqa", ru: "Кино и музыка", en: "Movies & Music" }, maxQ: "576p SD", isFhd: false, url: "https://stream3.cinerama.uz/1208/playlist.m3u8" },
  ];

  const I18N = {
    uz: {
      badge_tv: "Alohida TV uchun",
      nav_home: "Bosh sahifa",
      nav_laptop: "Laptop uchun",
      nav_web: "AeroGram Web",
      loading_stream: "Efirga ulanmoqda...",
      tap_unmute: "Ovozni yoqish uchun bosing",
      stream_error: "Efir vaqtincha uzildi",
      retry_btn: "Qayta ulanish",
      live_word: "JONLI",
      low_delay: "Tezkor efir",
      channels_list: "Kanallar",
      mode_fast: "Tezkor",
      mode_stable: "Barqaror",
      fullscreen_btn: "To‘liq ekran",
      exit_fullscreen_btn: "Kichraytirish",
      expand_now: "Katta ekranda ko‘rish",
      prev_short: "Oldingi",
      next_short: "Keyingi",
      np_hint: "Burchakdagi “To‘liq ekran” tugmasini bossangiz, video butun telefon yoki monitor ekranini egallaydi.",
      stream_spec_note: "Barcha kanallar to‘g‘ridan-to‘g‘ri HTTPS HLS orqali efirga uzatiladi: kanallarning asl manba sifati <strong>1080p Full HD</strong> va <strong>576p</strong> gacha bo‘lib, adaptiv rejim internet tezligingizga qarab qotishsiz eng yuqori aniqlikni tanlaydi.",
      channels_heading: "O‘zbekiston & Jahon TV kanallari",
      search_ph: "Kanal nomini yozing (Zo‘r TV, BIZ TV, Sport)...",
      cat_all: "Barchasi",
      cat_fav: "★ Sevimli",
      cat_tashkent: "Toshkent",
      cat_ent: "Ko‘ngilochar",
      cat_sport: "Sport",
      cat_music: "Kino & Musiqa",
      cat_news: "Yangiliklar",
      cat_doc: "Tabiat & Fan",
      cat_kids: "Bolalar",
      cat_regions: "Hududiy",
      auto_q: "Avto (Tez)",
      max_hd: "Maksimal HD",
      pip_btn: "Kichik oyna",
      sleep_off: "Taymer",
      single_track: "Yagona oqim",
      count_fmt: (n) => `${n} ta jonli kanal`,
      empty_search: "Mos kanal topilmadi",
    },
    ru: {
      badge_tv: "Раздел для ТВ",
      nav_home: "Главная",
      nav_laptop: "Для ноутбука",
      nav_web: "AeroGram Web",
      loading_stream: "Подключение к эфиру...",
      tap_unmute: "Нажмите, чтобы включить звук",
      stream_error: "Эфир временно прерван",
      retry_btn: "Переподключить",
      live_word: "ПРЯМОЙ ЭФИР",
      low_delay: "Минимальная задержка",
      channels_list: "Каналы",
      mode_fast: "Быстрый",
      mode_stable: "Стабильный",
      fullscreen_btn: "На весь экран",
      exit_fullscreen_btn: "Свернуть",
      expand_now: "Открыть во весь экран",
      prev_short: "Назад",
      next_short: "Далее",
      np_hint: "Нажмите «На весь экран», чтобы развернуть трансляцию на весь экран телефона или монитора.",
      stream_spec_note: "Все каналы передаются напрямую через HTTPS HLS: оригинальное качество вещания достигает <strong>1080p Full HD</strong> (и <strong>576p</strong> для части каналов), а адаптивный поток держит стабильную картинку без зависаний.",
      channels_heading: "Каналы Узбекистана и Мира",
      search_ph: "Поиск канала (Zo‘r TV, BIZ TV, Sport)...",
      cat_all: "Все",
      cat_fav: "★ Избранное",
      cat_tashkent: "Ташкент",
      cat_ent: "Развлечения",
      cat_sport: "Спорт",
      cat_music: "Кино и Музыка",
      cat_news: "Новости",
      cat_doc: "Наука и Природа",
      cat_kids: "Детям",
      cat_regions: "Регионы",
      auto_q: "Авто (Быстро)",
      max_hd: "Максимум HD",
      pip_btn: "Мини-окно",
      sleep_off: "Таймер",
      single_track: "Единый поток",
      count_fmt: (n) => `Каналов в эфире: ${n}`,
      empty_search: "Каналы не найдены",
    },
    en: {
      badge_tv: "Dedicated Live TV",
      nav_home: "Home",
      nav_laptop: "For Laptop",
      nav_web: "AeroGram Web",
      loading_stream: "Connecting to live stream...",
      tap_unmute: "Tap to unmute audio",
      stream_error: "Stream temporarily interrupted",
      retry_btn: "Reconnect",
      live_word: "LIVE",
      low_delay: "Low Latency",
      channels_list: "Channels",
      mode_fast: "Fast Live",
      mode_stable: "Stable",
      fullscreen_btn: "Fullscreen",
      exit_fullscreen_btn: "Exit Fullscreen",
      expand_now: "Watch Fullscreen",
      prev_short: "Prev",
      next_short: "Next",
      np_hint: "Tap the Fullscreen icon to expand video seamlessly across your entire phone or desktop display.",
      stream_spec_note: "All channels stream directly over HTTPS HLS with adaptive quality up to each broadcaster’s native <strong>1080p Full HD</strong> (or <strong>576p</strong>) feed for smooth playback.",
      channels_heading: "Uzbekistan & International TV",
      search_ph: "Search channel (Zo‘r TV, BIZ TV, Sport)...",
      cat_all: "All",
      cat_fav: "★ Favorites",
      cat_tashkent: "Tashkent",
      cat_ent: "Entertainment",
      cat_sport: "Sports",
      cat_music: "Movies & Music",
      cat_news: "News",
      cat_doc: "Science & Nature",
      cat_kids: "Kids",
      cat_regions: "Regional",
      auto_q: "Auto (Fast)",
      max_hd: "Max HD",
      pip_btn: "Mini Window",
      sleep_off: "Timer",
      single_track: "Single feed",
      count_fmt: (n) => `${n} live channels`,
      empty_search: "No matching channels",
    },
  };

  // DOM References
  const stage = document.getElementById("player-stage");
  const video = document.getElementById("tv-video");
  const spinner = document.getElementById("stage-spinner");
  const unmuteFloating = document.getElementById("unmute-floating");
  const errorBox = document.getElementById("stage-error");
  const retryBtn = document.getElementById("retry-btn");

  const hudLogoBox = document.getElementById("hud-logo-box");
  const hudChannelName = document.getElementById("hud-channel-name");
  const hudChannelCat = document.getElementById("hud-channel-cat");
  const hudResReadout = document.getElementById("hud-res-readout");
  const hudLatencyReadout = document.getElementById("hud-latency-readout");
  const npLogo = document.getElementById("np-logo");
  const npTitle = document.getElementById("np-title");
  const npQualityBadge = document.getElementById("np-quality-badge");
  const npCat = document.getElementById("np-cat");
  const npPrevBtn = document.getElementById("np-prev-btn");
  const npNextBtn = document.getElementById("np-next-btn");
  const viewListBtn = document.getElementById("view-list-btn");
  const viewGridBtn = document.getElementById("view-grid-btn");

  const prevChBtn = document.getElementById("prev-ch-btn");
  const nextChBtn = document.getElementById("next-ch-btn");
  const favCurrentBtn = document.getElementById("fav-current-btn");
  const fsChannelsToggle = document.getElementById("fs-channels-toggle");
  const fsChannelDrawer = document.getElementById("fs-channel-drawer");
  const fsDrawerClose = document.getElementById("fs-drawer-close");
  const fsDrawerList = document.getElementById("fs-drawer-list");

  const playPauseBtn = document.getElementById("play-pause-btn");
  const liveEdgeBtn = document.getElementById("live-edge-btn");
  const muteBtn = document.getElementById("mute-btn");
  const volSlider = document.getElementById("vol-slider");
  const latencyModeBtn = document.getElementById("latency-mode-btn");
  const latencyModeLabel = document.getElementById("latency-mode-label");
  const clarityBtn = document.getElementById("clarity-btn");
  const pipBtn = document.getElementById("pip-btn");
  const sleepBtn = document.getElementById("sleep-btn");
  const sleepLabel = document.getElementById("sleep-label");
  const qualityBtn = document.getElementById("quality-btn");
  const qualityLabel = document.getElementById("quality-label");
  const qualityMenu = document.getElementById("quality-menu");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const npFsBig = document.getElementById("np-fs-big");
  const fsLabel = document.getElementById("fs-label");

  const searchInput = document.getElementById("channel-search");
  const catPills = document.getElementById("cat-pills");
  const channelsList = document.getElementById("channels-list");
  const channelsCount = document.getElementById("channels-count");

  const themeBtn = document.getElementById("tv-theme-btn");
  const langBtn = document.getElementById("tv-lang-btn");
  const langMenu = document.getElementById("tv-lang-menu");
  const langCode = document.getElementById("tv-lang-code");

  // State
  let lang = localStorage.getItem("aero_lang_v2");
  if (!I18N[lang]) lang = "uz";
  let latencyMode = localStorage.getItem("aero_tv_mode") || "fast"; // 'fast' | 'stable'
  let favorites = new Set(JSON.parse(localStorage.getItem("aero_tv_favs") || "[]"));
  let viewMode = localStorage.getItem("aero_tv_view") === "grid" ? "grid" : "list";
  let activeCategory = "all";
  let searchQuery = "";
  let currentChannel = CHANNELS[0];
  let hls = null;
  let desiredHeight = -1; // -1 = lock highest HD level, -2 = adaptive auto
  let clarityBoost = localStorage.getItem("aero_tv_clarity") !== "off";
  let sleepMins = 0;
  let sleepTimerId = null;
  let hudHideTimer = null;
  let retryCount = 0;
  let lastTapTime = 0;

  // Theme Init (Default: Dark Mode)
  const savedTheme = localStorage.getItem("aero_theme_v3");
  document.documentElement.setAttribute("data-theme", savedTheme === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("aero_theme_v3", next);
  });

  // Translations
  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.uz[key] || key;
  }

  function applyLang(nextLang) {
    if (!I18N[nextLang]) return;
    lang = nextLang;
    localStorage.setItem("aero_lang_v2", lang);
    document.documentElement.setAttribute("lang", lang);
    langCode.textContent = lang === "uz" ? "O‘Z" : lang.toUpperCase();
    langMenu.querySelectorAll(".tv-lang-opt").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));

    document.querySelectorAll("[data-tv-i18n]").forEach((el) => {
      const k = el.getAttribute("data-tv-i18n");
      const val = t(k);
      if (typeof val === "string") el.innerHTML = val;
    });
    document.querySelectorAll("[data-tv-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-tv-placeholder");
      el.setAttribute("placeholder", t(k));
    });

    latencyModeLabel.textContent = latencyMode === "fast" ? t("mode_fast") : t("mode_stable");
    updateFullscreenIcons();
    updateChannelHudMeta();
    renderChannels();
    renderQualityMenu();
  }

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = langMenu.hasAttribute("hidden");
    if (isHidden) {
      langMenu.removeAttribute("hidden");
      langBtn.setAttribute("aria-expanded", "true");
    } else {
      langMenu.setAttribute("hidden", "");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });
  langMenu.querySelectorAll(".tv-lang-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.lang);
      langMenu.setAttribute("hidden", "");
      langBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    langMenu.setAttribute("hidden", "");
    langBtn.setAttribute("aria-expanded", "false");
    if (!e.target.closest("#quality-wrap")) {
      qualityMenu.setAttribute("hidden", "");
      qualityBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Local Verified Channel Logo Image Renderer with Monogram Fallback
  function fillLogoBox(container, ch) {
    container.innerHTML = "";
    container.style.background = "#FFFFFF";
    const img = document.createElement("img");
    img.src = ch.logo;
    img.alt = ch.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      container.innerHTML = "";
      container.style.background = ch.grad || "linear-gradient(135deg,#0284C7,#1E3A8A)";
      container.style.color = "#FFFFFF";
      container.textContent = ch.code || ch.name.replace(/‘/g, "").slice(0, 3).toUpperCase();
    };
    container.appendChild(img);
  }

  // Channel Directory Filtering & Rendering
  function getFilteredChannels() {
    const q = searchQuery.trim().toLowerCase();
    return CHANNELS.filter((ch) => {
      if (activeCategory === "fav" && !favorites.has(ch.id)) return false;
      if (activeCategory !== "all" && activeCategory !== "fav" && ch.cat !== activeCategory) return false;
      if (q && !ch.name.toLowerCase().includes(q) && !(ch.catLabel[lang] || "").toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }

  function syncViewButtons() {
    channelsList.classList.toggle("is-grid", viewMode === "grid");
    viewListBtn?.classList.toggle("active", viewMode === "list");
    viewGridBtn?.classList.toggle("active", viewMode === "grid");
  }
  syncViewButtons();

  viewListBtn?.addEventListener("click", () => {
    viewMode = "list";
    localStorage.setItem("aero_tv_view", viewMode);
    syncViewButtons();
  });
  viewGridBtn?.addEventListener("click", () => {
    viewMode = "grid";
    localStorage.setItem("aero_tv_view", viewMode);
    syncViewButtons();
  });

  function toggleFavoriteById(id) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    localStorage.setItem("aero_tv_favs", JSON.stringify(Array.from(favorites)));
    updateChannelHudMeta();
    renderChannels();
  }

  function renderChannels() {
    const list = getFilteredChannels();
    channelsCount.textContent = I18N[lang].count_fmt(list.length);
    channelsList.innerHTML = "";

    // Update live category counts in cat-pills
    catPills.querySelectorAll(".cat-pill").forEach((pill) => {
      const cat = pill.dataset.cat;
      const cnt = cat === "all" ? CHANNELS.length : cat === "fav" ? favorites.size : CHANNELS.filter((c) => c.cat === cat).length;
      let badge = pill.querySelector(".cat-num");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cat-num";
        pill.appendChild(badge);
      }
      badge.textContent = ` ${cnt}`;
    });

    if (list.length === 0) {
      const emp = document.createElement("div");
      emp.className = "ch-empty";
      emp.textContent = t("empty_search");
      channelsList.appendChild(emp);
      return;
    }

    list.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ch-card" + (ch.id === currentChannel.id ? " active" : "");
      btn.dataset.channelId = ch.id;

      const logo = document.createElement("div");
      logo.className = "ch-logo";
      fillLogoBox(logo, ch);

      const info = document.createElement("div");
      info.className = "ch-info";
      const nameEl = document.createElement("div");
      nameEl.className = "ch-name";
      nameEl.textContent = ch.name;

      const sub = document.createElement("div");
      sub.className = "ch-sub";
      const catSpan = document.createElement("span");
      catSpan.textContent = ch.catLabel[lang] || ch.catLabel.uz;
      const qSpan = document.createElement("span");
      qSpan.className = "ch-q" + (ch.isFhd ? " is-fhd" : "");
      qSpan.textContent = ch.maxQ;
      sub.append(catSpan, qSpan);
      info.append(nameEl, sub);

      const favBtn = document.createElement("span");
      favBtn.className = "ch-fav-toggle" + (favorites.has(ch.id) ? " is-fav" : "");
      favBtn.setAttribute("role", "button");
      favBtn.setAttribute("aria-label", "Sevimli");
      favBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      favBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleFavoriteById(ch.id);
      });

      const eq = document.createElement("div");
      eq.className = "ch-eq";
      eq.innerHTML = "<span></span><span></span><span></span>";

      btn.append(logo, info, favBtn, eq);
      btn.addEventListener("click", () => switchChannel(ch, true));
      channelsList.appendChild(btn);
    });

    // Also populate Fullscreen quick drawer
    fsDrawerList.innerHTML = "";
    CHANNELS.forEach((ch) => {
      const dBtn = document.createElement("button");
      dBtn.type = "button";
      dBtn.className = "fs-drawer-item" + (ch.id === currentChannel.id ? " active" : "");
      const sLeft = document.createElement("span");
      sLeft.textContent = ch.name;
      const sRight = document.createElement("small");
      sRight.textContent = ch.isFhd ? "1080p" : "576p";
      sRight.style.opacity = "0.7";
      dBtn.append(sLeft, sRight);
      dBtn.addEventListener("click", () => {
        switchChannel(ch, true);
        fsChannelDrawer.setAttribute("hidden", "");
      });
      fsDrawerList.appendChild(dBtn);
    });
  }

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const n = parseInt(clean, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  // Update HUD Meta + Zero-Filter Cinema Ambilight Halo
  function updateChannelHudMeta() {
    fillLogoBox(hudLogoBox, currentChannel);
    if (npLogo) fillLogoBox(npLogo, currentChannel);
    hudChannelName.textContent = currentChannel.name;
    hudChannelCat.textContent = currentChannel.catLabel[lang] || currentChannel.catLabel.uz;
    npTitle.textContent = currentChannel.name;
    if (npCat) npCat.textContent = currentChannel.catLabel[lang] || currentChannel.catLabel.uz;
    npQualityBadge.textContent = currentChannel.maxQ;
    favCurrentBtn.classList.toggle("is-fav", favorites.has(currentChannel.id));
    const ambi = document.getElementById("stage-ambilight");
    if (ambi && currentChannel.grad) {
      const hexes = currentChannel.grad.match(/#[0-9a-fA-F]{6}/g);
      if (hexes && hexes.length >= 2) {
        ambi.style.setProperty("--ambi-c1", hexToRgba(hexes[0], 0.28));
        ambi.style.setProperty("--ambi-c2", hexToRgba(hexes[1], 0.11));
      }
    }
    updateLiveResolutionReadout();
  }

  function updateLiveResolutionReadout() {
    if (video.videoWidth && video.videoHeight) {
      const h = video.videoHeight;
      const tag = h >= 1080 ? "Full HD" : h >= 720 ? "HD" : "SD";
      hudResReadout.textContent = `${video.videoWidth}×${h} (${tag})`;
      npQualityBadge.textContent = h >= 1080 ? "1080p Full HD" : h >= 720 ? "720p HD" : `${h}p ${tag}`;
    } else {
      hudResReadout.textContent = currentChannel.maxQ;
      npQualityBadge.textContent = currentChannel.maxQ;
    }
  }

  // HLS Player Initialization & Error Recovery
  function getHlsConfig() {
    const fast = latencyMode === "fast";
    return {
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 16,
      maxBufferLength: fast ? 14 : 24,
      maxMaxBufferLength: fast ? 24 : 40,
      liveSyncDurationCount: fast ? 2 : 3,
      liveMaxLatencyDurationCount: fast ? 5 : 8,
      maxLiveSyncPlaybackRate: 1.06,
      abrEwmaDefaultEstimate: 5500000,
      capLevelToPlayerSize: false,
      manifestLoadingTimeOut: 12000,
      manifestLoadingMaxRetry: 4,
      levelLoadingMaxRetry: 4,
      fragLoadingTimeOut: 14000,
      fragLoadingMaxRetry: 6,
      startLevel: -1,
    };
  }

  function showSpinner(visible) {
    if (visible) spinner.removeAttribute("hidden");
    else spinner.setAttribute("hidden", "");
  }

  function showError(visible) {
    if (visible) errorBox.removeAttribute("hidden");
    else errorBox.setAttribute("hidden", "");
  }

  function tryPlayVideo(fromUserGesture) {
    if (fromUserGesture) {
      video.muted = false;
      updateMuteIcons();
    }
    const p = video.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        stage.classList.add("is-playing");
        updatePlayIcons();
        if (video.muted) {
          unmuteFloating.removeAttribute("hidden");
        } else {
          unmuteFloating.setAttribute("hidden", "");
        }
        scheduleHudHide();
      }).catch(() => {
        // Fallback to muted autoplay if browser blocked audio
        video.muted = true;
        updateMuteIcons();
        video.play().then(() => {
          stage.classList.add("is-playing");
          updatePlayIcons();
          unmuteFloating.removeAttribute("hidden");
          scheduleHudHide();
        }).catch(() => {
          showSpinner(false);
          updatePlayIcons();
        });
      });
    }
  }

  function switchChannel(ch, fromUserGesture) {
    currentChannel = ch;
    retryCount = 0;
    try {
      history.replaceState(null, "", `#channel=${encodeURIComponent(ch.id)}`);
    } catch (_) {}

    updateChannelHudMeta();
    renderChannels();
    showError(false);
    showSpinner(true);
    bumpHud();

    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls(getHlsConfig());
      hls.loadSource(ch.url);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, (_e, data) => {
        if (data.levels && data.levels.length > 0) {
          let bestIdx = 0;
          data.levels.forEach((lv, i) => {
            if ((lv.height || 0) >= (data.levels[bestIdx].height || 0)) bestIdx = i;
          });
          if (desiredHeight === -2) {
            // Adaptive ABR mode requested manually by user
            hls.currentLevel = -1;
          } else if (desiredHeight > 0) {
            const matchIdx = data.levels.findIndex((lv) => lv.height === desiredHeight);
            hls.currentLevel = matchIdx >= 0 ? matchIdx : bestIdx;
          } else {
            // Force highest native resolution (1080p Full HD when available) immediately!
            hls.startLevel = bestIdx;
            hls.currentLevel = bestIdx;
          }
        }
        renderQualityMenu();
        tryPlayVideo(fromUserGesture);
      });

      hls.on(window.Hls.Events.LEVEL_LOADED, (_e, data) => {
        const u = data?.details?.url || "";
        if (u.includes("/blocked/") && !ch.url.includes("tracks-v1a1")) {
          const fallback = ch.url.replace("/playlist.m3u8", "/tracks-v1a1/mono.m3u8");
          hls.loadSource(fallback);
        }
      });

      hls.on(window.Hls.Events.LEVEL_SWITCHED, () => {
        updateLiveResolutionReadout();
        renderQualityMenu();
      });

      hls.on(window.Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && retryCount < 4) {
          retryCount++;
          showSpinner(true);
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR && retryCount < 4) {
          retryCount++;
          hls.recoverMediaError();
        } else {
          showSpinner(false);
          showError(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = ch.url;
      video.addEventListener("loadedmetadata", () => {
        renderQualityMenu();
        tryPlayVideo(fromUserGesture);
      }, { once: true });
    } else {
      showSpinner(false);
      showError(true);
    }
  }

  // Quality Selector
  function renderQualityMenu() {
    qualityMenu.innerHTML = "";
    const levels = hls && hls.levels ? hls.levels : [];

    if (levels.length <= 1) {
      qualityLabel.textContent = levels[0]?.height ? `${levels[0].height}p` : currentChannel.maxQ.split(" ")[0];
      const note = document.createElement("div");
      note.className = "quality-opt active";
      note.textContent = `${qualityLabel.textContent} (${t("single_track")})`;
      qualityMenu.appendChild(note);
      return;
    }

    const isAutoAbr = desiredHeight === -2 || hls.autoLevelEnabled;
    const isForcedMax = desiredHeight === -1 && !isAutoAbr;
    const activeLvl = levels[hls.currentLevel] || levels[hls.loadLevel];
    qualityLabel.textContent = isAutoAbr
      ? `${t("auto_q")}${activeLvl?.height ? ` (${activeLvl.height}p)` : ""}`
      : (activeLvl?.height ? `${activeLvl.height}p${activeLvl.height >= 1080 ? " FHD" : ""}` : t("max_hd"));

    const maxBtn = document.createElement("button");
    maxBtn.type = "button";
    maxBtn.className = "quality-opt" + (isForcedMax ? " active" : "");
    maxBtn.innerHTML = `<span>${t("max_hd")} (FHD)</span><span>${isForcedMax ? "✓" : ""}</span>`;
    maxBtn.addEventListener("click", () => {
      desiredHeight = -1;
      let bestIdx = 0;
      levels.forEach((lv, i) => {
        if ((lv.height || 0) >= (levels[bestIdx].height || 0)) bestIdx = i;
      });
      hls.currentLevel = bestIdx;
      qualityMenu.setAttribute("hidden", "");
      renderQualityMenu();
    });
    qualityMenu.appendChild(maxBtn);

    const autoBtn = document.createElement("button");
    autoBtn.type = "button";
    autoBtn.className = "quality-opt" + (isAutoAbr ? " active" : "");
    autoBtn.innerHTML = `<span>${t("auto_q")}</span><span>${isAutoAbr ? "✓" : ""}</span>`;
    autoBtn.addEventListener("click", () => {
      desiredHeight = -2;
      hls.currentLevel = -1;
      qualityMenu.setAttribute("hidden", "");
      renderQualityMenu();
    });
    qualityMenu.appendChild(autoBtn);

    // Highest resolution first
    const indexed = levels.map((lv, idx) => ({ lv, idx })).sort((a, b) => (b.lv.height || 0) - (a.lv.height || 0));
    indexed.forEach(({ lv, idx }) => {
      const h = lv.height || 0;
      const isSelected = !isAutoAbr && !isForcedMax && hls.currentLevel === idx;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quality-opt" + (isSelected ? " active" : "");
      const label = h >= 1440 ? `${h}p QHD` : h >= 1080 ? "1080p Full HD" : h >= 720 ? "720p HD" : `${h}p`;
      btn.innerHTML = `<span>${label}</span><span>${isSelected ? "✓" : ""}</span>`;
      btn.addEventListener("click", () => {
        desiredHeight = h;
        hls.currentLevel = idx;
        qualityMenu.setAttribute("hidden", "");
        renderQualityMenu();
      });
      qualityMenu.appendChild(btn);
    });
  }

  qualityBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = qualityMenu.hasAttribute("hidden");
    if (isHidden) {
      renderQualityMenu();
      qualityMenu.removeAttribute("hidden");
      qualityBtn.setAttribute("aria-expanded", "true");
    } else {
      qualityMenu.setAttribute("hidden", "");
      qualityBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Video Events & Live Drift Monitor
  video.addEventListener("playing", () => {
    showSpinner(false);
    showError(false);
    stage.classList.add("is-playing");
    updatePlayIcons();
    updateLiveResolutionReadout();
    scheduleHudHide();
  });

  video.addEventListener("waiting", () => showSpinner(true));
  video.addEventListener("pause", () => {
    stage.classList.remove("is-playing");
    stage.classList.remove("hud-idle");
    updatePlayIcons();
  });
  video.addEventListener("loadedmetadata", updateLiveResolutionReadout);
  video.addEventListener("resize", updateLiveResolutionReadout);

  setInterval(() => {
    if (!hls || video.paused) return;
    const syncPos = hls.liveSyncPosition;
    if (typeof syncPos === "number" && syncPos > 0) {
      const drift = syncPos - video.currentTime;
      const behind = drift > 12;
      liveEdgeBtn.classList.toggle("is-behind", behind);
      liveEdgeBtn.classList.toggle("is-at-live", !behind);
      hudLatencyReadout.textContent = drift > 0 && drift < 60
        ? `~${Math.max(1, Math.round(drift))}s`
        : t("low_delay");
    }
  }, 1500);

  liveEdgeBtn.addEventListener("click", () => {
    if (hls && typeof hls.liveSyncPosition === "number" && hls.liveSyncPosition > 0) {
      video.currentTime = hls.liveSyncPosition;
    }
    if (video.paused) tryPlayVideo(true);
  });

  // Playback / Audio Controls
  function updatePlayIcons() {
    const paused = video.paused;
    playPauseBtn.querySelector(".ic-pause").style.display = paused ? "none" : "block";
    playPauseBtn.querySelector(".ic-play").style.display = paused ? "block" : "none";
  }

  function updateMuteIcons() {
    const muted = video.muted || video.volume === 0;
    muteBtn.querySelector(".ic-vol-on").style.display = muted ? "none" : "block";
    muteBtn.querySelector(".ic-vol-off").style.display = muted ? "block" : "none";
  }

  playPauseBtn.addEventListener("click", () => {
    if (video.paused) tryPlayVideo(true);
    else video.pause();
  });

  unmuteFloating.addEventListener("click", () => {
    video.muted = false;
    if (video.volume === 0) video.volume = 0.9;
    volSlider.value = String(video.volume);
    updateMuteIcons();
    unmuteFloating.setAttribute("hidden", "");
    if (video.paused) tryPlayVideo(true);
  });

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.85;
      volSlider.value = "0.85";
    }
    updateMuteIcons();
    unmuteFloating.setAttribute("hidden", "");
  });

  volSlider.addEventListener("input", () => {
    const v = parseFloat(volSlider.value);
    video.volume = v;
    video.muted = v === 0;
    updateMuteIcons();
    unmuteFloating.setAttribute("hidden", "");
  });

  latencyModeBtn.addEventListener("click", () => {
    latencyMode = latencyMode === "fast" ? "stable" : "fast";
    localStorage.setItem("aero_tv_mode", latencyMode);
    latencyModeBtn.classList.toggle("is-stable", latencyMode === "stable");
    latencyModeLabel.textContent = latencyMode === "fast" ? t("mode_fast") : t("mode_stable");
    switchChannel(currentChannel, !video.muted);
  });
  latencyModeBtn.classList.toggle("is-stable", latencyMode === "stable");

  retryBtn.addEventListener("click", () => switchChannel(currentChannel, true));

  // Prev / Next / Favorite
  function stepChannel(delta) {
    const idx = CHANNELS.findIndex((c) => c.id === currentChannel.id);
    const nextIdx = (idx + delta + CHANNELS.length) % CHANNELS.length;
    switchChannel(CHANNELS[nextIdx], true);
  }
  prevChBtn.addEventListener("click", () => stepChannel(-1));
  nextChBtn.addEventListener("click", () => stepChannel(1));
  npPrevBtn?.addEventListener("click", () => stepChannel(-1));
  npNextBtn?.addEventListener("click", () => stepChannel(1));

  favCurrentBtn.addEventListener("click", () => toggleFavoriteById(currentChannel.id));

  // Search & Category Tabs
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderChannels();
  });

  catPills.querySelectorAll(".cat-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      catPills.querySelectorAll(".cat-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.cat;
      renderChannels();
    });
  });

  // Fullscreen Handling: immediate full-viewport expansion + non-blocking native Fullscreen upgrade
  let nativeFsActive = false;

  function isNativeFullscreen() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function isFullscreenActive() {
    return isNativeFullscreen() || stage.classList.contains("is-css-fullscreen");
  }

  function updateFullscreenIcons() {
    const active = isFullscreenActive();
    fullscreenBtn.querySelector(".ic-expand").style.display = active ? "none" : "block";
    fullscreenBtn.querySelector(".ic-compress").style.display = active ? "block" : "none";
    fsLabel.textContent = active ? t("exit_fullscreen_btn") : t("fullscreen_btn");
    document.body.classList.toggle("tv-fs-lock", active);
    if (!active) fsChannelDrawer.setAttribute("hidden", "");
  }

  function toggleFullscreen() {
    bumpHud();
    if (isFullscreenActive()) {
      nativeFsActive = false;
      stage.classList.remove("is-css-fullscreen");
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } catch (_) {}
      try { window.screen?.orientation?.unlock?.(); } catch (_) {}
      updateFullscreenIcons();
      return;
    }

    // Apply full-viewport CSS fullscreen synchronously so mobile/webviews never hang
    stage.classList.add("is-css-fullscreen");
    updateFullscreenIcons();

    // Non-blocking attempt to promote OS/browser into hardware fullscreen as well
    try {
      const req = stage.requestFullscreen
        ? stage.requestFullscreen({ navigationUI: "hide" })
        : (stage.webkitRequestFullscreen ? stage.webkitRequestFullscreen() : null);
      if (req && typeof req.catch === "function") req.catch(() => {});
    } catch (_) {}

    if (window.matchMedia("(pointer: coarse)").matches) {
      try {
        const lockP = window.screen?.orientation?.lock?.("landscape");
        if (lockP && typeof lockP.catch === "function") lockP.catch(() => {});
      } catch (_) {}
    }
  }

  function handleNativeFsChange() {
    const nowNative = isNativeFullscreen();
    if (nativeFsActive && !nowNative) {
      // User exited native fullscreen via Esc / system back
      stage.classList.remove("is-css-fullscreen");
    }
    nativeFsActive = nowNative;
    updateFullscreenIcons();
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  npFsBig.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", handleNativeFsChange);
  document.addEventListener("webkitfullscreenchange", handleNativeFsChange);

  fsChannelsToggle.addEventListener("click", () => {
    if (fsChannelDrawer.hasAttribute("hidden")) fsChannelDrawer.removeAttribute("hidden");
    else fsChannelDrawer.setAttribute("hidden", "");
  });
  fsDrawerClose.addEventListener("click", () => fsChannelDrawer.setAttribute("hidden", ""));

  // HUD Auto-Hide & Tap Interactions
  function bumpHud() {
    stage.classList.remove("hud-idle");
    scheduleHudHide();
  }

  function scheduleHudHide() {
    clearTimeout(hudHideTimer);
    if (!stage.classList.contains("is-playing")) return;
    hudHideTimer = setTimeout(() => {
      if (qualityMenu.hasAttribute("hidden") && fsChannelDrawer.hasAttribute("hidden")) {
        stage.classList.add("hud-idle");
      }
    }, 4500);
  }

  stage.addEventListener("mousemove", bumpHud);
  stage.addEventListener("click", (e) => {
    if (e.target.closest("button, input, .quality-menu, .fs-channel-drawer")) {
      bumpHud();
      return;
    }
    const now = Date.now();
    if (now - lastTapTime < 280) {
      toggleFullscreen();
      lastTapTime = 0;
      return;
    }
    lastTapTime = now;
    if (stage.classList.contains("hud-idle")) {
      bumpHud();
    } else if (!video.paused) {
      stage.classList.add("hud-idle");
    }
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "Escape" && stage.classList.contains("is-css-fullscreen")) {
      stage.classList.remove("is-css-fullscreen");
      updateFullscreenIcons();
    } else if (e.key === " " || e.key === "k") {
      e.preventDefault();
      if (video.paused) tryPlayVideo(true);
      else video.pause();
    } else if (e.key === "m" || e.key === "M") {
      muteBtn.click();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      stepChannel(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      stepChannel(1);
    }
  });

  // Boot from URL Hash (?channel=, #channel=, or category hash like #sport, #music, #news, #doc)
  function resolveInitialChannel() {
    const cleanHash = location.hash.replace(/^#/, "");
    const knownCats = ["tashkent", "entertainment", "sport", "music", "news", "doc", "kids", "regions"];
    if (knownCats.includes(cleanHash)) {
      activeCategory = cleanHash;
      catPills.querySelectorAll(".cat-pill").forEach((p) => p.classList.toggle("active", p.dataset.cat === cleanHash));
      const firstMatch = CHANNELS.find((c) => c.cat === cleanHash);
      if (firstMatch) return firstMatch;
    }
    const hashMatch = location.hash.match(/channel=([^&]+)/);
    const paramMatch = new URLSearchParams(location.search).get("channel");
    const targetId = decodeURIComponent((hashMatch && hashMatch[1]) || paramMatch || "zor-tv");
    return CHANNELS.find((c) => c.id === targetId) || CHANNELS[0];
  }

  // Clarity Boost (HD+), Picture-in-Picture (PiP), and Sleep Timer
  stage.classList.toggle("is-clarity", clarityBoost);
  clarityBtn?.classList.toggle("is-clarity-on", clarityBoost);
  clarityBtn?.addEventListener("click", () => {
    clarityBoost = !clarityBoost;
    localStorage.setItem("aero_tv_clarity", clarityBoost ? "on" : "off");
    stage.classList.toggle("is-clarity", clarityBoost);
    clarityBtn.classList.toggle("is-clarity-on", clarityBoost);
  });

  if (pipBtn && !("pictureInPictureEnabled" in document)) {
    pipBtn.style.display = "none";
  }
  pipBtn?.addEventListener("click", async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
      }
    } catch (_) {}
  });

  const SLEEP_CYCLE = [0, 15, 30, 60];
  sleepBtn?.addEventListener("click", () => {
    clearTimeout(sleepTimerId);
    const nextIdx = (SLEEP_CYCLE.indexOf(sleepMins) + 1) % SLEEP_CYCLE.length;
    sleepMins = SLEEP_CYCLE[nextIdx];
    sleepBtn.classList.toggle("is-timer-on", sleepMins > 0);
    sleepLabel.textContent = sleepMins > 0 ? `${sleepMins}m` : t("sleep_off");
    if (sleepMins > 0) {
      sleepTimerId = setTimeout(() => {
        video.pause();
        sleepMins = 0;
        sleepBtn.classList.remove("is-timer-on");
        sleepLabel.textContent = t("sleep_off");
      }, sleepMins * 60 * 1000);
    }
  });

  applyLang(lang);
  switchChannel(resolveInitialChannel(), false);
})();
