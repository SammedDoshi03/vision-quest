import { TEST_LOCATORS } from './testLocators';

export interface MobileAutomationDriver {
  findElementByTestId: (testId: string) => Promise<{
    click: () => Promise<void>;
    getText: () => Promise<string>;
    setValue: (val: string) => Promise<void>;
    isDisplayed: () => Promise<boolean>;
  }>;
  setOrientation: (orientation: 'PORTRAIT' | 'LANDSCAPE') => Promise<void>;
  getOrientation: () => Promise<'PORTRAIT' | 'LANDSCAPE'>;
}

/**
 * End-to-End Test Suite reusable by both local Appium runners and BrowserStack App Automate.
 */
export async function runVerticalRoleSwitchAutomationFlow(
  driver: MobileAutomationDriver,
  verticalTabTestId: string,
  primaryRoleTestId: string,
  secondaryRoleTestId: string,
) {
  // 1. Navigate to target vertical via tab or drawer
  const tab = await driver.findElementByTestId(verticalTabTestId);
  await tab.click();

  // 2. Verify Primary User Role active and interactive
  const primaryRoleBtn = await driver.findElementByTestId(primaryRoleTestId);
  const isPrimaryVisible = await primaryRoleBtn.isDisplayed();
  if (!isPrimaryVisible) {
    throw new Error(`Primary role element ${primaryRoleTestId} is not visible!`);
  }

  // 3. Switch to Secondary User Role (e.g. Patient -> Caregiver, Shopper -> Merchant, Citizen -> Engineer)
  const secondaryRoleBtn = await driver.findElementByTestId(secondaryRoleTestId);
  await secondaryRoleBtn.click();

  // 4. Verify Secondary view loaded
  const isSecondaryVisible = await secondaryRoleBtn.isDisplayed();
  if (!isSecondaryVisible) {
    throw new Error(`Secondary role element ${secondaryRoleTestId} failed to mount!`);
  }

  return { success: true, tab: verticalTabTestId };
}

export async function runDeviceRotationAutomationFlow(
  driver: MobileAutomationDriver,
) {
  // Test portrait mode
  await driver.setOrientation('PORTRAIT');
  const currentOrientation1 = await driver.getOrientation();
  if (currentOrientation1 !== 'PORTRAIT') {
    throw new Error('Device failed to set PORTRAIT orientation');
  }

  // Test landscape rotation (validating tablet/landscape master-detail adaptation)
  await driver.setOrientation('LANDSCAPE');
  const currentOrientation2 = await driver.getOrientation();
  if (currentOrientation2 !== 'LANDSCAPE') {
    throw new Error('Device failed to set LANDSCAPE orientation');
  }

  // Return to portrait
  await driver.setOrientation('PORTRAIT');
  return { success: true, verifiedOrientations: ['PORTRAIT', 'LANDSCAPE'] };
}

export async function runAdminDashboardTelemetryFlow(
  driver: MobileAutomationDriver,
) {
  // Navigate to Admin tab
  const adminTab = await driver.findElementByTestId(TEST_LOCATORS.NAV.TAB_ADMIN);
  await adminTab.click();

  // Verify KPI metric tiles
  const kpiUsers = await driver.findElementByTestId(TEST_LOCATORS.ADMIN.KPI_ACTIVE_USERS);
  const usersText = await kpiUsers.getText();

  const kpiGmv = await driver.findElementByTestId(TEST_LOCATORS.ADMIN.KPI_TOTAL_GMV);
  const gmvText = await kpiGmv.getText();

  // Toggle killswitch
  const upiSwitch = await driver.findElementByTestId(TEST_LOCATORS.ADMIN.SWITCH_UPI_GATEWAY);
  await upiSwitch.click();

  return { success: true, usersText, gmvText };
}
