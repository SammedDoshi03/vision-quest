import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TEST_LOCATORS,
  APPIUM_DEVICE_CAPABILITIES,
  BROWSERSTACK_DEVICE_MATRIX,
  getBrowserStackConfig,
  runVerticalRoleSwitchAutomationFlow,
} from '../src/index';

describe('Appium & BrowserStack Mobile Automation Suite', () => {
  it('defines valid test locators across all 12 verticals and admin console', () => {
    assert.ok(TEST_LOCATORS.MEDICAL.PATIENT_DOSE_BTN);
    assert.ok(TEST_LOCATORS.ECOMMERCE.SHOPPER_ADD_CART_BTN);
    assert.ok(TEST_LOCATORS.STREAMING.VIEWER_PLAY_PAUSE_BTN);
    assert.ok(TEST_LOCATORS.PAYMENT.CONSUMER_SEND_UPI_BTN);
    assert.ok(TEST_LOCATORS.BANKING.CUSTOMER_CARD_FREEZE_SWITCH);
    assert.ok(TEST_LOCATORS.ENERGY.LINEMAN_PROBE_BLE_BTN);
    assert.ok(TEST_LOCATORS.PUBLIC_SECTOR.CITIZEN_SUBMIT_TICKET_BTN);
    assert.ok(TEST_LOCATORS.CHAT.USER_SEND_BTN);
    assert.ok(TEST_LOCATORS.DELIVERY.CUSTOMER_ORDER_EXPRESS_BTN);
    assert.ok(TEST_LOCATORS.STORAGE.USER_GAUGE);
    assert.ok(TEST_LOCATORS.MOBILITY.RIDER_REQUEST_RIDE_BTN);
    assert.ok(TEST_LOCATORS.REELS.VIEWER_LIKE_BTN);
    assert.ok(TEST_LOCATORS.ADMIN.KPI_ACTIVE_USERS);
  });

  it('provides Appium device capabilities for portrait and landscape testing', () => {
    const androidPhone = APPIUM_DEVICE_CAPABILITIES.androidPixelPhonePortrait;
    assert.equal(androidPhone.platformName, 'Android');
    assert.equal(androidPhone['appium:orientation'], 'PORTRAIT');

    const iosIpad = APPIUM_DEVICE_CAPABILITIES.iosIpadLandscape;
    assert.equal(iosIpad.platformName, 'iOS');
    assert.equal(iosIpad['appium:orientation'], 'LANDSCAPE');
  });

  it('configures BrowserStack cloud device matrix covering phone, tablet, and foldable aspect ratios', () => {
    const s24 = BROWSERSTACK_DEVICE_MATRIX.samsungS24Portrait;
    assert.equal(s24.aspectRatio, '19.5:9');
    assert.equal(s24.category, 'phone');

    const ipad = BROWSERSTACK_DEVICE_MATRIX.iPadPro12Landscape;
    assert.equal(ipad.aspectRatio, '4:3');
    assert.equal(ipad.category, 'tablet');

    const fold = BROWSERSTACK_DEVICE_MATRIX.pixelFoldUnfolded;
    assert.equal(fold.category, 'foldable');

    const bstack = getBrowserStackConfig({ user: 'test-user', key: 'test-key', local: true });
    assert.equal(bstack.user, 'test-user');
    assert.equal(bstack.commonCapabilities['bstack:options'].local, true);
    assert.ok(bstack.capabilities.length >= 5);
  });

  it('executes automated role switcher flow mock successfully', async () => {
    const clicked: string[] = [];
    const mockDriver = {
      findElementByTestId: async (id: string) => ({
        click: async () => {
          clicked.push(id);
        },
        getText: async () => 'mock text',
        setValue: async (_val: string) => {},
        isDisplayed: async () => true,
      }),
      setOrientation: async () => {},
      getOrientation: async () => 'PORTRAIT' as const,
    };

    const res = await runVerticalRoleSwitchAutomationFlow(
      mockDriver,
      TEST_LOCATORS.NAV.TAB_ECOMMERCE,
      TEST_LOCATORS.ECOMMERCE.SHOPPER_ADD_CART_BTN,
      TEST_LOCATORS.ECOMMERCE.MERCHANT_STOCK_INC_BTN,
    );

    assert.equal(res.success, true);
    assert.equal(clicked.length, 2);
  });
});
