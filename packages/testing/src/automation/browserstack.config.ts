/**
 * BrowserStack App Automate Configuration.
 *
 * Configures cloud-hosted real mobile device execution across an exhaustive
 * matrix of screen aspect ratios (standard phones, foldables, tablets)
 * and dual orientations (portrait and landscape).
 */

export interface BrowserStackDeviceSpec {
  device: string;
  os_version: string;
  platformName: 'ios' | 'android';
  orientation: 'portrait' | 'landscape';
  aspectRatio: string;
  category: 'phone' | 'tablet' | 'foldable';
}

export const BROWSERSTACK_DEVICE_MATRIX: Record<string, BrowserStackDeviceSpec> = {
  // Compact / Modern Phone (19.5:9)
  iPhone15ProPortrait: {
    device: 'iPhone 15 Pro',
    os_version: '17',
    platformName: 'ios',
    orientation: 'portrait',
    aspectRatio: '19.5:9',
    category: 'phone',
  },
  samsungS24Portrait: {
    device: 'Samsung Galaxy S24',
    os_version: '14.0',
    platformName: 'android',
    orientation: 'portrait',
    aspectRatio: '19.5:9',
    category: 'phone',
  },

  // Phone in Landscape (horizontal media / games)
  samsungS24Landscape: {
    device: 'Samsung Galaxy S24',
    os_version: '14.0',
    platformName: 'android',
    orientation: 'landscape',
    aspectRatio: '19.5:9',
    category: 'phone',
  },

  // Tablet Form Factor (4:3 and 16:10)
  iPadPro12Landscape: {
    device: 'iPad Pro 12.9 2022',
    os_version: '17',
    platformName: 'ios',
    orientation: 'landscape',
    aspectRatio: '4:3',
    category: 'tablet',
  },
  samsungTabS9Portrait: {
    device: 'Samsung Galaxy Tab S9',
    os_version: '13.0',
    platformName: 'android',
    orientation: 'portrait',
    aspectRatio: '16:10',
    category: 'tablet',
  },

  // Foldable Device (Square / Unfolded ~8:7.1)
  pixelFoldUnfolded: {
    device: 'Google Pixel Fold',
    os_version: '14.0',
    platformName: 'android',
    orientation: 'portrait',
    aspectRatio: '8:7.1',
    category: 'foldable',
  },
};

export interface BrowserStackOptions {
  user?: string;
  key?: string;
  appUrl?: string;
  local?: boolean;
  localIdentifier?: string;
}

export const BROWSERSTACK_DEFAULTS = {
  USERNAME: 'rnstuff_EHn4lO',
  ACCESS_KEY: 'Ca9UVoyfkAVgrX9jmgWb',
  LOCAL_FOLDER_URL: 'http://rnstuff_ehn4lo.browserstack.com',
  HUB_HOST: 'hub-cloud.browserstack.com',
};

export function getBrowserStackConfig(options: BrowserStackOptions = {}) {
  const user = options.user || process.env.BROWSERSTACK_USERNAME || BROWSERSTACK_DEFAULTS.USERNAME;
  const key = options.key || process.env.BROWSERSTACK_ACCESS_KEY || BROWSERSTACK_DEFAULTS.ACCESS_KEY;
  const isLocal = options.local ?? (process.env.BROWSERSTACK_LOCAL === 'true');
  const localId = options.localIdentifier || process.env.BROWSERSTACK_LOCAL_IDENTIFIER || 'rnstuff-local';

  return {
    user,
    key,
    server: BROWSERSTACK_DEFAULTS.HUB_HOST,
    commonCapabilities: {
      'bstack:options': {
        projectName: 'Resonance Enterprise Platform',
        buildName: `Multi-Vertical Mobile Suite - Build ${process.env.BUILD_NUMBER || 'Local'}`,
        sessionName: 'Cross-Vertical Multi-Role & Device Aspect Automation',
        debug: true,
        networkLogs: true,
        video: true,
        deviceOrientation: 'portrait',
        local: isLocal,
        ...(isLocal ? { localIdentifier: localId } : {}),
      },
    },
    capabilities: Object.entries(BROWSERSTACK_DEVICE_MATRIX).map(([key, spec]) => ({
      key,
      platformName: spec.platformName,
      'appium:deviceName': spec.device,
      'appium:platformVersion': spec.os_version,
      ...(options.appUrl ? { 'appium:app': options.appUrl } : {}),
      'bstack:options': {
        deviceOrientation: spec.orientation,
        appiumVersion: '2.0.1',
        local: isLocal,
        ...(isLocal ? { localIdentifier: localId } : {}),
      },
    })),
  };
}
