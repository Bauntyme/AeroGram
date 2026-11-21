import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const brandDir = path.dirname(__filename);
const siteDir = path.resolve(brandDir, '..');
const assetsDir = path.join(siteDir, 'assets');
const targetDir = path.resolve(process.argv[2] || path.join(siteDir, 'tweb-src'));

if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
  throw new Error(`Target telegram-tt directory not found: ${targetDir}`);
}

function readUtf8(relPath) {
  return fs.readFileSync(path.join(targetDir, relPath), 'utf8');
}

function writeUtf8(relPath, content) {
  fs.writeFileSync(path.join(targetDir, relPath), content, 'utf8');
}

function replaceExact(relPath, replacements) {
  let content = readUtf8(relPath);
  for (const [search, replace] of replacements) {
    if (!content.includes(search)) {
      throw new Error(`Expected snippet not found in ${relPath}: ${search.slice(0, 80)}`);
    }
    content = content.replaceAll(search, replace);
  }
  writeUtf8(relPath, content);
}

function copyAsset(srcAbs, destRelList) {
  for (const destRel of destRelList) {
    fs.copyFileSync(srcAbs, path.join(targetDir, destRel));
  }
}

// 1. Configure production environment for AeroGram Web under https://aerogram.website/web/
const envContent = [
  'APP_ENV=production',
  'APP_TITLE=AeroGram Web',
  'APP_NAME=AeroGram Web',
  'BASE_URL=https://aerogram.website/web/',
  'TELEGRAM_API_ID=23670216',
  'TELEGRAM_API_HASH=425e2d76316f01470824001110792bc8',
  '',
].join('\n');
writeUtf8('.env', envContent);
writeUtf8('.env.production', envContent);

// 2. Replace brand icons and favicons
const squircleSvg = fs.readFileSync(path.join(brandDir, 'aerogram-logo-squircle.svg'), 'utf8');
const circleSvg = fs.readFileSync(path.join(brandDir, 'aerogram-logo-circle.svg'), 'utf8');
const squareFullBleedSvg = squircleSvg.replace('<rect width="128" height="128" rx="30"', '<rect width="128" height="128" rx="0"');
const unreadFaviconSvg = squircleSvg.replace(
  '</svg>',
  '  <circle cx="102" cy="26" r="20" fill="#EF4444" stroke="#FFFFFF" stroke-width="5"/>\n</svg>'
);

copyAsset(path.join(assetsDir, 'favicon.svg'), ['public/favicon.svg']);
writeUtf8('public/favicon-unread.svg', unreadFaviconSvg);
copyAsset(path.join(assetsDir, 'favicon.ico'), ['public/favicon.ico']);
copyAsset(path.join(assetsDir, 'apple-touch-icon.png'), [
  'public/apple-touch-icon.png',
  'public/apple-touch-icon-dev.png',
]);
copyAsset(path.join(assetsDir, 'icon-192.png'), [
  'public/icon-192x192.png',
  'public/icon-square-192x192.png',
  'public/icon-dev-192x192.png',
  'public/icon-square-dev-192x192.png',
]);
copyAsset(path.join(assetsDir, 'icon-512.png'), [
  'public/icon-512x512.png',
  'public/icon-square-512x512.png',
  'public/icon-dev-512x512.png',
  'public/icon-square-dev-512x512.png',
]);
copyAsset(path.join(brandDir, 'icon-maskable-512x512.png'), [
  'public/icon-maskable-512x512.png',
  'public/icon-maskable-dev-512x512.png',
]);
writeUtf8('public/icon-maskable-dev.svg', circleSvg);
writeUtf8('src/assets/telegram-logo.svg', circleSvg);
writeUtf8('src/assets/telegram-logo-filled.svg', squareFullBleedSvg);

// 3. Rebrand HTML shell & Web Manifest metadata
replaceExact('index.html', [
  [
    'Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.',
    'AeroGram — cloud-based messaging app with a focus on security and speed.',
  ],
  ['<h1>Telegram Web</h1>', '<h1>AeroGram Web</h1>'],
]);

replaceExact('plugins/webManifest.ts', [
  [
    "const name = isProductionApp ? 'Telegram Web' : 'Telegram Web Beta';",
    "const name = isProductionApp ? 'AeroGram Web' : 'AeroGram Web Beta';",
  ],
  [
    "description: 'Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.',",
    "description: 'AeroGram — cloud-based messaging app with a focus on security and speed.',",
  ],
]);

replaceExact('src/config.ts', [
  ["export const PAGE_TITLE_TAURI = 'Telegram Air';", "export const PAGE_TITLE_TAURI = 'AeroGram';"],
]);

// 4. Show AeroGram Concept A mark inside the Auth QR code & phone login screen
replaceExact('src/components/auth/AuthQrCode.tsx', [
  [
    "import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';",
    "import telegramLogoPath from '../../assets/telegram-logo.svg';",
  ],
  ["import AnimatedIcon from '../common/AnimatedIcon';\n", ''],
  [
    `<AnimatedIcon
              tgsUrl={LOCAL_TGS_URLS.QrPlane}
              size={QR_PLANE_SIZE}
              className="qr-plane"
              nonInteractive
              noLoop={false}
            />`,
    `<img
              src={telegramLogoPath}
              alt="AeroGram"
              width={QR_PLANE_SIZE}
              height={QR_PLANE_SIZE}
              className="qr-plane"
            />`,
  ],
]);

replaceExact('src/components/auth/Auth.scss', [
  ['background-color: var(--color-telegram-blue);', 'background-color: transparent;'],
]);

// 5. Rebrand initial and fallback English auth strings
replaceExact('src/assets/localization/initialStrings.ts', [
  ['"AuthTitle": "Telegram",', '"AuthTitle": "AeroGram",'],
  ['"LoginQRTitle": "Log in to Telegram by QR Code",', '"LoginQRTitle": "Log in to AeroGram by QR Code",'],
  ['"LoginQRHelp1": "Open Telegram on your phone",', '"LoginQRHelp1": "Open AeroGram or Telegram on your phone",'],
]);

replaceExact('src/assets/localization/fallback.strings', [
  ['"AuthTitle" = "Telegram";', '"AuthTitle" = "AeroGram";'],
  ['"LoginQRTitle" = "Log in to Telegram by QR Code";', '"LoginQRTitle" = "Log in to AeroGram by QR Code";'],
  ['"LoginQRHelp1" = "Open Telegram on your phone";', '"LoginQRHelp1" = "Open AeroGram or Telegram on your phone";'],
  ['"WebSessionsTitle" = "Logged In with Telegram";', '"WebSessionsTitle" = "Logged In with AeroGram";'],
]);

replaceExact('src/util/localization/index.ts', [
  [
    `  const string = isPluralLangString(langPackStringValue)
    ? (langPackStringValue[pluralSuffix] ?? langPackStringValue.other)
    : langPackStringValue;

  return string;`,
    `  const string = isPluralLangString(langPackStringValue)
    ? (langPackStringValue[pluralSuffix] ?? langPackStringValue.other)
    : langPackStringValue;

  if (typeof string === 'string') {
    if (langKey === 'AuthTitle') return 'AeroGram';
    if (langKey === 'LoginQRHelp1' && !string.includes('AeroGram')) {
      return string.replaceAll('Telegram', 'AeroGram or Telegram');
    }
    if ((langKey === 'LoginQRTitle' || langKey === 'WebSessionsTitle') && string.includes('Telegram')) {
      return string.replaceAll('Telegram', 'AeroGram');
    }
  }

  return string;`,
  ],
]);

console.log(`AeroGram Web branding applied successfully in ${targetDir}`);
