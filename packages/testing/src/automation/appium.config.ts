/**
 * Appium 2.x WebDriverIO Test Automation Configuration.
 *
 * Supports local execution via Appium Server (http://127.0.0.1:4723)
 * with capabilities for iOS XCUITest and Android UiAutomator2,
 * covering phone, tablet, and foldable aspect ratios in portrait & landscape.
 */

export interface AppiumDeviceCapability {
  platformName: 'iOS' | 'Android';
  'appium:automationName': 'XCUITest' | 'UiAutomator2';
  'appium:deviceName': string;
  'appium:platformVersion': string;
  'appium:orientation': 'PORTRAIT' | 'LANDSCAPE';
  'appium:app'?: string;
  'appium:bundleId'?: string;
  'appium:appPackage'?: string;
  'appium:appActivity'?: string;
  'appium:noReset'?: boolean;
  'appium:newCommandTimeout'?: number;
}

export const APPIUM_LOCAL_SERVER = {
  protocol: 'http',
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
};

export const APPIUM_DEVICE_CAPABILITIES: Record<string, AppiumDeviceCapability> = {
  // 1. Android Phone - Portrait (Pixel 8)
  androidPixelPhonePortrait: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Google Pixel 8',
    'appium:platformVersion': '14.0',
    'appium:orientation': 'PORTRAIT',
    'appium:appPackage': 'com.resonance.app',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:newCommandTimeout': 240,
  },

  // 2. Android Tablet - Landscape (Galaxy Tab S9)
  androidTabletLandscape: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Samsung Galaxy Tab S9',
    'appium:platformVersion': '14.0',
    'appium:orientation': 'LANDSCAPE',
    'appium:appPackage': 'com.resonance.app',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
  },

  // 3. iOS Phone - Portrait (iPhone 15 Pro)
  iosPhonePortrait: {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 15 Pro',
    'appium:platformVersion': '17.2',
    'appium:orientation': 'PORTRAIT',
    'appium:bundleId': 'com.resonance.app',
    'appium:noReset': false,
    'appium:newCommandTimeout': 240,
  },

  // 4. iOS iPad Tablet - Landscape (iPad Pro 12.9)
  iosIpadLandscape: {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPad Pro (12.9-inch) (6th generation)',
    'appium:platformVersion': '17.2',
    'appium:orientation': 'LANDSCAPE',
    'appium:bundleId': 'com.resonance.app',
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
  },
};

export const appiumWdioConfig = {
  runner: 'local',
  port: 4723,
  specs: ['./test/automation/**/*.e2e.ts'],
  maxInstances: 2,
  capabilities: [
    APPIUM_DEVICE_CAPABILITIES.androidPixelPhonePortrait,
    APPIUM_DEVICE_CAPABILITIES.iosPhonePortrait,
  ],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
