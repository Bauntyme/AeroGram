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

// 4. Show AeroGram Concept A mark inside the Auth QR code & preload QR module for faster rendering
replaceExact('src/util/qrCode/buildStyledQrCode.ts', [
  ['function ensureQrCodeStyling() {', 'export function ensureQrCodeStyling() {'],
]);

replaceExact('src/components/auth/AuthQrCode.tsx', [
  [
    "import { createStyledQrCode } from '../../util/qrCode/buildStyledQrCode';",
    "import { createStyledQrCode, ensureQrCodeStyling } from '../../util/qrCode/buildStyledQrCode';\n\nvoid ensureQrCodeStyling();",
  ],
  [
    "import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';",
    "import telegramLogoPath from '../../assets/telegram-logo.svg';",
  ],
  ["import AnimatedIcon from '../common/AnimatedIcon';\n", ''],
  ['    if (!isConnected) {', '    if (!isConnected && !authQrCode) {'],
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

// 4b. Speed up initial QR code generation and ensure signOut / revoked sessions never hang on "Updating..."
replaceExact('src/lib/gramjs/client/TelegramClient.ts', [
  [
    `    if (await checkAuthorization(this, authParams.shouldThrowIfUnauthorized)) {
      return;
    }`,
    `    if (authParams.shouldThrowIfUnauthorized && await checkAuthorization(this, true)) {
      return;
    }`,
  ],
]);

replaceExact('src/lib/gramjs/client/auth.ts', [
  [
    `  refreshPasskeyLoginOption(client, apiCredentials, authParams);

  if (initialMethod === 'phoneNumber') {
    return signInUser(client, apiCredentials, authParams);
  } else {
    return signInUserWithQrCode(client, apiCredentials, authParams);
  }`,
    `  if (initialMethod === 'phoneNumber') {
    refreshPasskeyLoginOption(client, apiCredentials, authParams);
    return signInUser(client, apiCredentials, authParams);
  } else {
    setTimeout(() => refreshPasskeyLoginOption(client, apiCredentials, authParams), 350);
    return signInUserWithQrCode(client, apiCredentials, authParams);
  }`,
  ],
]);

replaceExact('src/lib/gramjs/network/MTProtoSender.ts', [
  [
    `          if (e.errorMessage === 'AUTH_KEY_UNREGISTERED'
            || e.errorMessage === 'SESSION_REVOKED'
            || e.errorMessage === 'USER_DEACTIVATED') {
            // 'AUTH_KEY_UNREGISTERED' for the main sender is thrown when unauthorized and should be ignored
            this._handleBadAuthKey(true);
          }`,
    `          if (e.errorMessage === 'AUTH_KEY_UNREGISTERED') {
            // 'AUTH_KEY_UNREGISTERED' for the main sender is thrown when unauthorized and should be ignored
            this._handleBadAuthKey(true);
          } else if (e.errorMessage === 'SESSION_REVOKED' || e.errorMessage === 'USER_DEACTIVATED') {
            this._handleBadAuthKey(false);
          }`,
  ],
]);

replaceExact('src/api/gramjs/methods/client.ts', [
  [
    `let client: TelegramClient;
let currentUserId: string | undefined;`,
    `let client: TelegramClient;
let currentUserId: string | undefined;
let hasAuthenticatedSession = false;`,
  ],
  [
    `  const session = new sessions.CallbackSession(sessionData, onSessionUpdate);`,
    `  hasAuthenticatedSession = Object.values(sessionData?.keys || {}).length > 0;
  currentUserId = undefined;

  const session = new sessions.CallbackSession(sessionData, onSessionUpdate);`,
  ],
  [
    `      if (err.message !== 'Disconnect' && err.message !== 'Cannot send requests while disconnected') {
        sendApiUpdate({
          '@type': 'updateConnectionState',
          connectionState: 'connectionStateBroken',
        });

        return;
      }`,
    `      if (err.message !== 'Disconnect' && err.message !== 'Cannot send requests while disconnected') {
        hasAuthenticatedSession = false;
        currentUserId = undefined;
        sendApiUpdate({
          '@type': 'updateConnectionState',
          connectionState: 'connectionStateBroken',
        });

        return;
      }`,
  ],
  [
    `    onAuthReady();`,
    `    hasAuthenticatedSession = true;
    onAuthReady();`,
  ],
  [
    `export async function destroy(noLogOut = false, noClearLocalDb = false) {
  if (!noLogOut && client.isConnected()) {`,
    `export async function destroy(noLogOut = false, noClearLocalDb = false) {
  hasAuthenticatedSession = false;
  currentUserId = undefined;
  if (!noLogOut && client.isConnected()) {`,
  ],
  [
    `  } catch (err: any) {
    if (shouldIgnoreErrors) return undefined;`,
    `  } catch (err: any) {
    const rpcError = err instanceof RPCError ? err.errorMessage : undefined;
    if (hasAuthenticatedSession && rpcError && TERMINATED_SESSION_ERRORS.has(rpcError)) {
      hasAuthenticatedSession = false;
      currentUserId = undefined;
      sendApiUpdate({
        '@type': 'updateConnectionState',
        connectionState: 'connectionStateBroken',
      });
      return undefined;
    }

    if (shouldIgnoreErrors) return undefined;`,
  ],
]);

replaceExact('src/global/actions/api/initial.ts', [
  [
    `import { getCurrentTabId } from '../../../util/establishMultitabRole';`,
    `import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { initGlobal } from '../../../util/init';`,
  ],
  [
    `import {
  addActionHandler, getGlobal, setGlobal,
} from '../../index';`,
    `import {
  addActionHandler, getGlobal, type RequiredGlobalActions, setGlobal,
} from '../../index';`,
  ],
  [
    `let resetStoragePromise: Promise<boolean> | undefined;
let isInitializingApi = false;`,
    `let resetStoragePromise: Promise<boolean> | undefined;
let isInitializingApi = false;
let isSigningOut = false;`,
  ],
  [
    `addActionHandler('signOut', async (global, actions, payload): Promise<void> => {
  if ('hangUp' in actions) actions.hangUp({ tabId: getCurrentTabId() });
  if ('leaveGroupCall' in actions) actions.leaveGroupCall({ tabId: getCurrentTabId() });

  try {
    resetInitialLocationHash();
    resetLocationHash();
    await unregisterPushAccount();
    await Promise.race([callApi('destroy'), pause(API_DESTROY_TIMEOUT_MS)]);
    await forceWebsync(false);
  } catch (err) {
    // Do nothing
  }

  actions.reset();
  await resetStorage();

  const targetAccountSlot = getFirstLoggedInAccountSlot() || 1;
  if (targetAccountSlot !== (ACCOUNT_SLOT || 1)) {
    window.location.replace(getAccountSlotUrl(targetAccountSlot));
    return;
  }

  if (payload?.forceInitApi) {
    actions.initApi();
  }
});

addActionHandler('requestChannelDifference', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;

  void callApi('requestChannelDifference', chatId);
});

addActionHandler('reset', async (global, actions): Promise<void> => {
  global = { ...global, messageWidgetStorage: {} };
  setGlobal(global);
  void cacheApi.clear(MEDIA_CACHE_NAME);
  void cacheApi.clear(MEDIA_CACHE_NAME_AVATARS);
  void cacheApi.clear(MEDIA_PROGRESSIVE_CACHE_NAME);

  const hasAccounts = await resetStorage();
  await unregisterPushAccount().catch(() => undefined);
  if (hasAccounts) {
    destroySharedStatePort();
  } else {
    resetSharedStatePort();
  }

  if (!hasAccounts) {
    await clearPasscodeStore();
    localStorage.removeItem(IS_SCREEN_LOCKED_CACHE_KEY);
    await clearWallpaperBlobs();
  }

  updateAppBadge(0);

  if (hasAccounts) {
    return;
  }

  actions.initShared({ force: true });
  Object.values(global.byTabId).forEach(({ id: otherTabId, isMasterTab }) => {
    actions.init({ tabId: otherTabId, isMasterTab });
  });
});`,
    `addActionHandler('signOut', async (global, actions, payload): Promise<void> => {
  if (isSigningOut) return;
  isSigningOut = true;

  try {
    if ('hangUp' in actions) actions.hangUp({ tabId: getCurrentTabId() });
    if ('leaveGroupCall' in actions) actions.leaveGroupCall({ tabId: getCurrentTabId() });

    const nextAuthState = PLATFORM_ENV === 'iOS' || PLATFORM_ENV === 'Android'
      ? 'authorizationStateWaitPhoneNumber'
      : 'authorizationStateWaitQrCode';

    // Immediately drop active session and switch off main chat screen so "Updating..." never stalls
    await clearStoredSession(ACCOUNT_SLOT).catch(() => undefined);
    global = getGlobal();
    global = {
      ...global,
      currentUserId: undefined,
      connectionState: 'connectionStateConnecting',
      isSyncing: false,
      isFetchingDifference: false,
      auth: {
        state: nextAuthState,
        rememberMe: global.auth.rememberMe,
        isLoading: false,
        isLoadingQrCode: false,
      },
    };
    setGlobal(global);

    try {
      resetInitialLocationHash();
      resetLocationHash();
      await Promise.race([
        Promise.allSettled([
          unregisterPushAccount(),
          callApi('destroy'),
          forceWebsync(false),
        ]),
        pause(1500),
      ]);
    } catch (err) {
      // Do nothing
    }

    const hasAccounts = await performReset(actions);

    if (!hasAccounts) {
      global = getGlobal();
      setGlobal({
        ...global,
        currentUserId: undefined,
        connectionState: 'connectionStateConnecting',
        isSyncing: false,
        isFetchingDifference: false,
        auth: {
          ...global.auth,
          state: nextAuthState,
          isLoading: false,
          isLoadingQrCode: false,
        },
      });
    }

    const targetAccountSlot = getFirstLoggedInAccountSlot() || 1;
    if (targetAccountSlot !== (ACCOUNT_SLOT || 1)) {
      window.location.replace(getAccountSlotUrl(targetAccountSlot));
      return;
    }

    if (payload?.forceInitApi) {
      actions.initApi();
    }
  } finally {
    isSigningOut = false;
  }
});

addActionHandler('requestChannelDifference', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;

  void callApi('requestChannelDifference', chatId);
});

async function performReset(actions: RequiredGlobalActions) {
  let global = getGlobal();
  global = { ...global, messageWidgetStorage: {} };
  setGlobal(global);
  void cacheApi.clear(MEDIA_CACHE_NAME);
  void cacheApi.clear(MEDIA_CACHE_NAME_AVATARS);
  void cacheApi.clear(MEDIA_PROGRESSIVE_CACHE_NAME);

  const hasAccounts = await resetStorage();
  await Promise.race([unregisterPushAccount(), pause(1000)]).catch(() => undefined);
  if (hasAccounts) {
    destroySharedStatePort();
  } else {
    resetSharedStatePort();
  }

  if (!hasAccounts) {
    await clearPasscodeStore().catch(() => undefined);
    localStorage.removeItem(IS_SCREEN_LOCKED_CACHE_KEY);
    await clearWallpaperBlobs().catch(() => undefined);
  }

  updateAppBadge(0);

  if (hasAccounts) {
    return true;
  }

  await initGlobal(true, getGlobal());
  Object.values(getGlobal().byTabId).forEach(({ id: otherTabId, isMasterTab }) => {
    actions.init({ tabId: otherTabId, isMasterTab });
  });
  return false;
}

addActionHandler('reset', async (global, actions): Promise<void> => {
  await performReset(actions);
});`,
  ],
]);

// 5. Rebrand all user-visible localization strings (initial, fallback, and cloud packs)
const SKIP_BRAND_KEY_RE = /(?:Username|Url|URL|Link)$/;
const UI_BRAND_RE = /(https?:\/\/[^\s)<>"']+|@[a-zA-Z0-9_]+)|(?:Telegram\s+Web(?:\s+[AZK])?|Telegram)/g;

function rebrandUiText(text) {
  return text.replace(UI_BRAND_RE, (match, keep) => (
    keep || (match.includes('Web') ? 'AeroGram Web' : 'AeroGram')
  ));
}

replaceExact('src/assets/localization/initialStrings.ts', [
  ['"AuthTitle": "Telegram",', '"AuthTitle": "AeroGram",'],
  [
    '"SentAppCode": "We\'ve sent the code to the **Telegram** app on your other device.",',
    '"SentAppCode": "We\'ve sent the code to the **AeroGram** app on your other device.",',
  ],
  ['"LoginQRTitle": "Log in to Telegram by QR Code",', '"LoginQRTitle": "Log in to AeroGram by QR Code",'],
  ['"LoginQRHelp1": "Open Telegram on your phone",', '"LoginQRHelp1": "Open AeroGram on your phone",'],
]);

const rebrandedFallback = readUtf8('src/assets/localization/fallback.strings')
  .split('\n')
  .map((line) => {
    const match = line.match(/^"([^"]+)"(\s*=\s*")(.*)(";\s*\r?)$/);
    if (!match || SKIP_BRAND_KEY_RE.test(match[1])) {
      return line;
    }
    return `"${match[1]}"${match[2]}${rebrandUiText(match[3])}${match[4]}`;
  })
  .join('\n');
writeUtf8('src/assets/localization/fallback.strings', rebrandedFallback);

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
    if (!/(?:Username|Url|URL|Link)$/.test(langKey)) {
      return string.replace(
        /(https?:\\/\\/[^\\s)<>"']+|@[a-zA-Z0-9_]+)|(?:Telegram\\s+Web(?:\\s+[AZK])?|Telegram)/g,
        (match, keep) => (keep || (match.includes('Web') ? 'AeroGram Web' : 'AeroGram')),
      );
    }
  }

  return string;`,
  ],
]);

// Ensure static sub-pages (Alohida TV uchun) & SEO files are staged in _site for Render Static Site builds
const outSiteDir = path.join(siteDir, '_site');
const tvSrcDir = path.join(siteDir, 'tv');
if (fs.existsSync(tvSrcDir)) {
  fs.cpSync(tvSrcDir, path.join(outSiteDir, 'tv'), { recursive: true });
}
for (const extraFile of ['robots.txt', 'sitemap.xml']) {
  const srcPath = path.join(siteDir, extraFile);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(outSiteDir, { recursive: true });
    fs.copyFileSync(srcPath, path.join(outSiteDir, extraFile));
  }
}

console.log(`AeroGram Web branding applied successfully in ${targetDir}`);
