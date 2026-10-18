/**
 * Unified Test Locators Registry for Appium & BrowserStack Mobile Automation.
 *
 * Deterministic testID identifiers ensure resilience against UI localization changes
 * and allow Appium / WebdriverIO / Detox runners to reliably target interactive elements.
 */
export const TEST_LOCATORS = {
  // Navigation & Shell
  NAV: {
    TOP_BAR: 'nav-top-bar',
    HAMBURGER_BTN: 'nav-btn-hamburger',
    DRAWER_MODAL: 'nav-drawer-modal',
    DRAWER_CLOSE_BTN: 'nav-drawer-btn-close',
    ROUTE_PILL: 'nav-route-pill',
    LANG_TOGGLE: 'nav-btn-lang-toggle',
    ORIENTATION_BADGE: 'nav-orientation-badge',
    TAB_MEDICAL: 'nav-tab-medical',
    TAB_ECOMMERCE: 'nav-tab-ecommerce',
    TAB_STREAMING: 'nav-tab-streaming',
    TAB_PAYMENTS: 'nav-tab-payments',
    TAB_BANKING: 'nav-tab-banking',
    TAB_ENERGY: 'nav-tab-energy',
    TAB_PUBLIC_SECTOR: 'nav-tab-public-sector',
    TAB_CHAT: 'nav-tab-chat',
    TAB_DELIVERY: 'nav-tab-delivery',
    TAB_STORAGE: 'nav-tab-storage',
    TAB_MOBILITY: 'nav-tab-mobility',
    TAB_REELS: 'nav-tab-reels',
    TAB_ADMIN: 'nav-tab-admin',
    TAB_SETTINGS: 'nav-tab-settings',
  },

  // Common Role Selector
  ROLES: {
    SWITCHER_CONTAINER: 'role-switcher-container',
    ROLE_PRIMARY_BTN: 'role-btn-primary',
    ROLE_SECONDARY_BTN: 'role-btn-secondary',
    ACTIVE_ROLE_INDICATOR: 'role-active-indicator',
  },

  // 01. Medical
  MEDICAL: {
    CONTAINER: 'med-container',
    PATIENT_DOSE_BTN: 'med-btn-patient-take-dose',
    PATIENT_SOS_BTN: 'med-btn-patient-sos',
    CAREGIVER_SYNC_BADGE: 'med-caregiver-sync-badge',
    CAREGIVER_ADD_RX_BTN: 'med-btn-caregiver-add-rx',
    CAREGIVER_ACK_ALERT_BTN: 'med-btn-caregiver-ack-alert',
  },

  // 02. E-Commerce
  ECOMMERCE: {
    CONTAINER: 'ecom-container',
    SHOPPER_ADD_CART_BTN: 'ecom-btn-shopper-add-cart',
    SHOPPER_CART_COUNT: 'ecom-shopper-cart-count',
    SHOPPER_CHECKOUT_BTN: 'ecom-btn-shopper-checkout',
    MERCHANT_STOCK_INC_BTN: 'ecom-btn-merchant-stock-inc',
    MERCHANT_STOCK_DEC_BTN: 'ecom-btn-merchant-stock-dec',
    MERCHANT_RESERVE_TOGGLE: 'ecom-merchant-reserve-toggle',
    MERCHANT_STOCK_VALUE: 'ecom-merchant-stock-value',
  },

  // 03. Streaming
  STREAMING: {
    CONTAINER: 'stream-container',
    VIEWER_PLAY_PAUSE_BTN: 'stream-btn-viewer-play-pause',
    VIEWER_RESOLUTION_BTN: 'stream-btn-viewer-resolution',
    VIEWER_PIP_TOGGLE: 'stream-btn-viewer-pip',
    STUDIO_INGEST_BTN: 'stream-btn-studio-ingest',
    STUDIO_GEOBLOCK_TOGGLE: 'stream-studio-geoblock-toggle',
    STUDIO_DRM_STATUS: 'stream-studio-drm-status',
  },

  // 04. Payments & UPI
  PAYMENT: {
    CONTAINER: 'pay-container',
    CONSUMER_AMOUNT_INPUT: 'pay-input-consumer-amount',
    CONSUMER_SEND_UPI_BTN: 'pay-btn-consumer-send-upi',
    CONSUMER_SCAN_QR_BTN: 'pay-btn-consumer-scan-qr',
    MERCHANT_SOUNDBOX_TRIGGER: 'pay-btn-soundbox-test-chime',
    MERCHANT_DAILY_TOTAL: 'pay-merchant-daily-total',
    MERCHANT_SETTLE_BTN: 'pay-btn-merchant-instant-settle',
  },

  // 05. Banking
  BANKING: {
    CONTAINER: 'bank-container',
    CUSTOMER_CARD_FREEZE_SWITCH: 'bank-switch-customer-freeze',
    CUSTOMER_REVEAL_CVV_BTN: 'bank-btn-customer-reveal-cvv',
    CUSTOMER_LIMIT_SLIDER: 'bank-slider-customer-limit',
    COMPLIANCE_KYC_APPROVE_BTN: 'bank-btn-compliance-approve-kyc',
    COMPLIANCE_AML_FLAG_ITEM: 'bank-item-compliance-aml-flag',
    COMPLIANCE_RELEASE_HOLD_BTN: 'bank-btn-compliance-release-hold',
  },

  // 06. Energy
  ENERGY: {
    CONTAINER: 'energy-container',
    LINEMAN_PROBE_BLE_BTN: 'energy-btn-lineman-probe-ble',
    LINEMAN_CHECKLIST_SAFETY_ITEM: 'energy-check-lineman-safety',
    LINEMAN_COMPLETE_ORDER_BTN: 'energy-btn-lineman-complete-order',
    DISPATCHER_SUBSTATION_LOAD: 'energy-gauge-substation-load',
    DISPATCHER_BREAKER_TRIP_BTN: 'energy-btn-dispatcher-trip-breaker',
  },

  // 07. Public Sector 311
  PUBLIC_SECTOR: {
    CONTAINER: 'public-container',
    CITIZEN_REPORT_TITLE_INPUT: 'public-input-citizen-title',
    CITIZEN_SUBMIT_TICKET_BTN: 'public-btn-citizen-submit-ticket',
    CITIZEN_UPVOTE_BTN: 'public-btn-citizen-upvote',
    ENGINEER_STATUS_SELECT: 'public-select-engineer-status',
    ENGINEER_RESOLVE_TICKET_BTN: 'public-btn-engineer-resolve-ticket',
  },

  // 08. Chat & Collaboration
  CHAT: {
    CONTAINER: 'chat-container',
    USER_MESSAGE_INPUT: 'chat-input-user-message',
    USER_SEND_BTN: 'chat-btn-user-send',
    USER_RECORD_VOICE_BTN: 'chat-btn-user-voice-record',
    MOD_SLOWMODE_SWITCH: 'chat-switch-mod-slowmode',
    MOD_PURGE_CHAT_BTN: 'chat-btn-mod-purge',
  },

  // 09. Ultra-Fast Quick Commerce Delivery
  DELIVERY: {
    CONTAINER: 'deliv-container',
    CUSTOMER_ORDER_EXPRESS_BTN: 'deliv-btn-customer-order-express',
    CUSTOMER_OTP_BADGE: 'deliv-badge-customer-otp',
    CUSTOMER_TRACKING_PROGRESS: 'deliv-bar-customer-progress',
    RIDER_ACCEPT_ORDER_BTN: 'deliv-btn-rider-accept-order',
    RIDER_VERIFY_OTP_INPUT: 'deliv-input-rider-verify-otp',
    RIDER_COMPLETE_DELIVERY_BTN: 'deliv-btn-rider-complete-delivery',
  },

  // 10. Storage & Memory Consumption
  STORAGE: {
    CONTAINER: 'storage-container',
    USER_GAUGE: 'storage-gauge-user-usage',
    USER_CLEAN_DUPLICATES_BTN: 'storage-btn-user-clean-duplicates',
    ADMIN_MEMBER_QUOTA_SLIDER: 'storage-slider-admin-quota',
    ADMIN_TIER_UPGRADE_BTN: 'storage-btn-admin-tier-upgrade',
  },

  // 11. Mobility & Logistics
  MOBILITY: {
    CONTAINER: 'mob-container',
    RIDER_TIER_SELECTOR: 'mob-select-rider-tier',
    RIDER_REQUEST_RIDE_BTN: 'mob-btn-rider-request-ride',
    RIDER_FARE_ESTIMATE: 'mob-text-rider-fare',
    DRIVER_ONLINE_TOGGLE: 'mob-switch-driver-online',
    DRIVER_ACCEPT_DISPATCH_BTN: 'mob-btn-driver-accept-dispatch',
  },

  // 12. Short Video Reels
  REELS: {
    CONTAINER: 'reels-container',
    VIEWER_LIKE_BTN: 'reels-btn-viewer-like',
    VIEWER_SHARE_BTN: 'reels-btn-viewer-share',
    CREATOR_UPLOAD_DRAFT_BTN: 'reels-btn-creator-upload',
    CREATOR_ANALYTICS_PANEL: 'reels-panel-creator-analytics',
  },

  // 13. Super-Admin Console
  ADMIN: {
    CONTAINER: 'admin-container',
    KPI_ACTIVE_USERS: 'admin-kpi-active-users',
    KPI_TOTAL_GMV: 'admin-kpi-total-gmv',
    KPI_SLA_RATE: 'admin-kpi-sla-rate',
    KPI_FLEET_COUNT: 'admin-kpi-fleet-count',
    SWITCH_UPI_GATEWAY: 'admin-switch-upi-gateway',
    SWITCH_MAINTENANCE_MODE: 'admin-switch-maintenance-mode',
    SWITCH_SURGE_PRICING: 'admin-switch-surge-pricing',
    BTN_TRIGGER_OTA: 'admin-btn-trigger-ota',
    AUDIT_LOG_FEED: 'admin-audit-log-feed',
    HEALTH_CIRCUIT_STATUS: 'admin-health-circuit-status',
  },

  // Responsive & Orientation Layout
  RESPONSIVE: {
    CONTAINER: 'responsive-container',
    ORIENTATION_LABEL: 'responsive-orientation-label',
    DEVICE_TYPE_LABEL: 'responsive-device-type-label',
    SPLIT_LEFT: 'responsive-container-left-pane',
    SPLIT_RIGHT: 'responsive-container-right-pane',
  },
} as const;
