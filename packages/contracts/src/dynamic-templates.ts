import { DynamicPageDefinition } from './dynamic-ui';

export const DYNAMIC_ECOMMERCE_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-ecommerce',
  title: '02. Luxury Retail & Commerce',
  subtitle: 'Server-Driven UI • Real-Time Inventory & Reservation Engine',
  roles: [
    { id: 'primary', label: 'Shopper', icon: '🛍️' },
    { id: 'secondary', label: 'Store Merchant', icon: '🏬' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-metrics',
      title: 'Channel Real-Time Telemetry',
      layout: 'grid',
      components: [
        {
          id: 'kpi-gmv',
          type: 'METRIC_CARD',
          props: { label: 'Today Settled GMV', value: '₹3,42,000', delta: '+18.4% vs benchmark', accentColor: '#10B981' },
          testID: 'dyn-kpi-gmv',
        },
        {
          id: 'kpi-active-skus',
          type: 'METRIC_CARD',
          props: { label: 'Active Curated SKUs', value: '1,420', delta: '42 low stock items', accentColor: '#38BDF8' },
          testID: 'dyn-kpi-skus',
        },
      ],
    },
    {
      id: 'sec-shopper-catalog',
      title: 'Curated Designer Drop (Shopper)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'prod-item-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Oversized Silk Linen Trench Coat',
            subtitle: 'Souled Studio • Raw Ivory • Handcrafted',
            value: '₹8,999',
            badge: '⚡ Only 2 Left',
            actionLabel: '+ Bag Item',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Item reserved in cart for 15 minutes!' } },
          testID: 'dyn-prod-1',
        },
        {
          id: 'prod-item-2',
          type: 'ENTITY_LIST',
          props: {
            title: 'Japanese Selvedge Denim 14oz',
            subtitle: 'Zara Atelier • Indigo Dye',
            value: '₹4,999',
            badge: 'Popular',
            actionLabel: '+ Bag Item',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Item reserved in cart for 15 minutes!' } },
          testID: 'dyn-prod-2',
        },
      ],
    },
    {
      id: 'sec-merchant-controls',
      title: 'Warehouse & Reservation Hold (Merchant)',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'toggle-reservation',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Cart Reservation Lock (15 min)',
            subtitle: 'Protects limited-run runway items during active checkout',
            initialValue: true,
          },
          action: { type: 'TOGGLE_SWITCH', actionId: 'toggle-reservation' },
          testID: 'dyn-toggle-reservation',
        },
        {
          id: 'order-queue-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Order #ORD-9821 • Silk Linen Trench',
            subtitle: 'Customer: Vikram M. • Mumbai West',
            value: '₹8,999',
            badge: 'READY TO DISPATCH',
            actionLabel: 'Mark Dispatched',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Order dispatched to 10m delivery courier!' } },
          testID: 'dyn-ord-1',
        },
      ],
    },
  ],
};

export const DYNAMIC_MEDICAL_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-medical',
  title: '01. Clinical Companion & Adherence',
  subtitle: 'Server-Driven UI • Dual-Role Healthcare Orchestrator',
  roles: [
    { id: 'primary', label: 'Patient (Aaji)', icon: '👵' },
    { id: 'secondary', label: 'Caregiver', icon: '🩺' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-med-patient',
      title: 'Prescribed Regimen (Patient View)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'med-dose-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Metformin 500mg (1 Tablet)',
            subtitle: 'Scheduled: 08:30 AM • After Breakfast (सकाळचा नाश्ता)',
            value: '08:30 AM',
            badge: 'DUE NOW',
            actionLabel: '✓ Taken Dose',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Dose logged! Synced with Caregiver.' } },
          testID: 'dyn-med-dose-1',
        },
        {
          id: 'sos-alert-banner',
          type: 'STATUS_BANNER',
          props: {
            level: 'CRITICAL',
            title: 'One-Tap Family SOS Alert',
            message: 'Press to send instant emergency location beacon to Dr. Shirke & Caregiver.',
          },
          action: { type: 'SHOW_TOAST', payload: { message: '🚨 SOS Beacon Dispatched to Emergency Contacts!' } },
          testID: 'dyn-sos-banner',
        },
      ],
    },
    {
      id: 'sec-med-caregiver',
      title: 'Adherence Telemetry & Caregiver Sync',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'kpi-adherence',
          type: 'METRIC_CARD',
          props: { label: '7-Day Medication Adherence', value: '98.4%', delta: '0 Missed Doses', accentColor: '#10B981' },
          testID: 'dyn-med-kpi',
        },
        {
          id: 'toggle-exact-alarms',
          type: 'TOGGLE_ROW',
          props: {
            title: 'High-Importance Exact Alarms',
            subtitle: 'Overrides Android Doze mode for critical cardio medications',
            initialValue: true,
          },
          action: { type: 'TOGGLE_SWITCH', actionId: 'toggle-exact-alarms' },
          testID: 'dyn-toggle-alarms',
        },
      ],
    },
  ],
};

export const DYNAMIC_PAYMENTS_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-payments',
  title: '04. Payments & UPI Switch',
  subtitle: 'Server-Driven UI • P2P Rails & Merchant Soundbox',
  roles: [
    { id: 'primary', label: 'Consumer Pay', icon: '💳' },
    { id: 'secondary', label: 'Merchant Soundbox', icon: '🔊' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-pay-consumer',
      title: 'Instant Bank-to-Bank UPI Transfer',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'pay-input-vpa',
          type: 'FORM_INPUT',
          props: { label: 'Recipient VPA', placeholder: 'user@okhdfcbank', defaultValue: 'tanvi@okhdfcbank' },
        },
        {
          id: 'pay-action-send',
          type: 'ACTION_BUTTON',
          props: { label: '⚡ Send ₹500 via Instant UPI', variant: 'primary' },
          action: { type: 'SHOW_TOAST', payload: { message: 'UPI Transfer ₹500 settled via NPCI rails!' } },
        },
      ],
    },
    {
      id: 'sec-pay-merchant',
      title: 'Merchant Soundbox Terminal',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'pay-soundbox-device',
          type: 'AUDIO_SOUNDBOX',
          props: {
            title: 'Soundbox 4G Pro • Online',
            status: 'Voice broadcast speaker connected to WiFi/Cellular',
            actionLabel: 'Test Chime (₹500)',
          },
          action: { type: 'SHOW_TOAST', payload: { message: '🔊 "Paytm / PhonePe par ₹500 rupaye prapt hue!"' } },
        },
        {
          id: 'pay-merchant-kpi',
          type: 'METRIC_CARD',
          props: { label: "Today's Merchant Collections", value: '₹14,500', delta: '28 Successful UPI Transactions', accentColor: '#10B981' },
        },
      ],
    },
  ],
};

export const DYNAMIC_BANKING_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-banking',
  title: '05. Wealth Banking & AML Compliance',
  subtitle: 'Server-Driven UI • Virtual Biometric Card & KYC Verification',
  roles: [
    { id: 'primary', label: 'Retail Customer', icon: '💳' },
    { id: 'secondary', label: 'Compliance Officer', icon: '⚖️' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-bank-customer',
      title: 'Titanium Infinite Debit Card Controls',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'bank-kpi-balance',
          type: 'METRIC_CARD',
          props: { label: 'Available Checking Balance', value: '₹4,82,500.00', delta: 'Account •••• 9821', accentColor: '#38BDF8' },
        },
        {
          id: 'bank-toggle-freeze',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Instant Card Freeze',
            subtitle: 'Temporarily blocks POS, ATM, and online transactions',
            initialValue: false,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Card state toggled instantly on banking switch.' } },
        },
      ],
    },
    {
      id: 'sec-bank-compliance',
      title: 'Regulatory AML & Video KYC Queue',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'aml-flag-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'High-Velocity Alert: Vikram Mehta',
            subtitle: 'Reason: 5 outbound transfers in 120s • Amount: ₹4,80,000',
            value: 'FLAGGED',
            badge: 'HIGH RISK',
            actionLabel: 'Approve Release',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'AML hold released. Transaction verified.' } },
        },
      ],
    },
  ],
};

export const DYNAMIC_ENERGY_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-energy',
  title: '06. Smart Grid & SCADA Dispatch',
  subtitle: 'Server-Driven UI • Field Lineman & Central Substation SCADA',
  roles: [
    { id: 'primary', label: 'Field Lineman', icon: '👷‍♂️' },
    { id: 'secondary', label: 'Grid Dispatcher', icon: '⚡' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-energy-lineman',
      title: 'Bay Work Orders & BLE Optical Probing',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'energy-ppe-toggle',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Life-Saving Rules (LSR) PPE Verification',
            subtitle: 'Class 4 Insulated Gloves, Arc Flash Suit, Grounding Rod',
            initialValue: true,
          },
          action: { type: 'TOGGLE_SWITCH', actionId: 'energy-ppe-toggle' },
        },
        {
          id: 'energy-action-probe',
          type: 'ACTION_BUTTON',
          props: { label: '⚡ Connect Optical BLE Probe (DLMS/COSEM)', variant: 'primary' },
          action: { type: 'SHOW_TOAST', payload: { message: 'Probe Synced: 415.2 V • 50.04 Hz • 12,489.6 kWh' } },
        },
      ],
    },
    {
      id: 'sec-energy-dispatcher',
      title: 'Regional Transmission Telemetry',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'energy-kpi-load',
          type: 'METRIC_CARD',
          props: { label: 'Substation Active Load', value: '148.5 MW', delta: 'Power Factor: 0.99 (Nominal)', accentColor: '#10B981' },
        },
        {
          id: 'energy-toggle-breaker',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Feeder 4A Trunk Breaker',
            subtitle: 'Emergency load shedding circuit breaker switch',
            initialValue: false,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Circuit breaker state updated on SCADA terminal.' } },
        },
      ],
    },
  ],
};

export const DYNAMIC_DELIVERY_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-delivery',
  title: '09. 10-Minute Dark Store Delivery',
  subtitle: 'Server-Driven UI • Customer Express & Rider Cockpit',
  roles: [
    { id: 'primary', label: 'Customer', icon: '🛒' },
    { id: 'secondary', label: 'Delivery Rider', icon: '🛵' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-delivery-customer',
      title: 'Live Order #BL-9921 Tracking',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'deliv-gauge',
          type: 'PROGRESS_GAUGE',
          props: {
            title: 'Delivery Progress',
            fraction: 'Rider 0.8 km away',
            segments: [{ width: '65%', color: '#16A34A' }],
            legend: 'Step 2: Rider Dispatched (Bandra West Hub)',
          },
        },
        {
          id: 'deliv-banner-otp',
          type: 'STATUS_BANNER',
          props: {
            level: 'INFO',
            title: 'Contactless Delivery OTP: 4921',
            message: 'Share this 4-digit code with the rider partner at your door.',
          },
        },
      ],
    },
    {
      id: 'sec-delivery-rider',
      title: 'Rider Partner Cockpit',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'rider-kpi-earnings',
          type: 'METRIC_CARD',
          props: { label: "Today's Rider Earnings", value: '₹1,420', delta: '18 Batches Completed', accentColor: '#F59E0B' },
        },
        {
          id: 'rider-action-verify',
          type: 'ACTION_BUTTON',
          props: { label: '✓ Verify OTP 4921 & Complete Order', variant: 'primary' },
          action: { type: 'SHOW_TOAST', payload: { message: 'Order completed! ₹65 payout credited to wallet.' } },
        },
      ],
    },
  ],
};

export const DYNAMIC_STORAGE_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-storage',
  title: '10. Subscription Vault & Storage Quotas',
  subtitle: 'Server-Driven UI • Cloud Telemetry & Family Quota Allocation',
  roles: [
    { id: 'primary', label: 'Account User', icon: '☁️' },
    { id: 'secondary', label: 'Quota Admin', icon: '👨‍👩‍👧‍👦' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-storage-user',
      title: 'Vault Telemetry (2,000 GB Tier)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'storage-gauge-vault',
          type: 'PROGRESS_GAUGE',
          props: {
            title: 'Vault Consumption',
            fraction: '135 GB / 2,000 GB',
            segments: [
              { width: '30%', color: '#38BDF8' },
              { width: '45%', color: '#818CF8' },
              { width: '15%', color: '#34D399' },
            ],
            legend: 'Photos (42 GB) • 4K Video (78 GB) • Docs (15 GB)',
          },
        },
        {
          id: 'storage-action-clean',
          type: 'ACTION_BUTTON',
          props: { label: '🧹 1-Tap Clean Duplicate Media (Save 18 GB)', variant: 'primary' },
          action: { type: 'SHOW_TOAST', payload: { message: '18 GB freed! 1,420 duplicate photos deleted.' } },
        },
      ],
    },
    {
      id: 'sec-storage-admin',
      title: 'Family Member Quotas',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'storage-kpi-pool',
          type: 'METRIC_CARD',
          props: { label: 'Shared Family Members', value: '4 Active', delta: 'Allocated 750 GB of 2,000 GB', accentColor: '#8B5CF6' },
        },
      ],
    },
  ],
};

export const DYNAMIC_ADMIN_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-admin',
  title: '14. Super-Admin Platform Command Center',
  subtitle: 'Server-Driven UI • Live Telemetry & Emergency Kill-Switches',
  roles: [
    { id: 'primary', label: 'Live Telemetry', icon: '📊' },
    { id: 'secondary', label: 'Emergency Controls', icon: '🛡️' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'sec-admin-kpis',
      title: 'Global Platform Metrics',
      layout: 'grid',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'admin-kpi-users',
          type: 'METRIC_CARD',
          props: { label: 'Active Platform Users', value: '24,891', delta: '+14% vs yesterday', accentColor: '#F8FAFC' },
          testID: 'admin-kpi-active-users',
        },
        {
          id: 'admin-kpi-gmv',
          type: 'METRIC_CARD',
          props: { label: '24h Gross Volume', value: '₹2.48 Cr', delta: 'UPI & E-Com Settled', accentColor: '#10B981' },
          testID: 'admin-kpi-total-gmv',
        },
      ],
    },
    {
      id: 'sec-admin-controls',
      title: 'Operational Kill-Switches',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'admin-toggle-upi',
          type: 'TOGGLE_ROW',
          props: {
            title: 'UPI Settlement Gateway Rail',
            subtitle: 'Master switch to pause or resume NPCI settlement switch',
            initialValue: true,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'UPI Settlement status updated by Super-Admin.' } },
          testID: 'admin-switch-upi-gateway',
        },
        {
          id: 'admin-toggle-surge',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Dark Store 1.5x Express Surge Pricing',
            subtitle: 'Activates surge pricing across Bandra and Andheri hubs',
            initialValue: false,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Surge pricing toggle updated.' } },
          testID: 'admin-switch-surge-pricing',
        },
      ],
    },
  ],
};

export const DYNAMIC_STREAMING_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-streaming',
  title: '03. Global Streaming & Live OTT',
  subtitle: 'Adaptive Bitrate HLS • 4K Dolby Atmos Media Pipeline',
  roles: [
    { id: 'primary', label: 'Viewer', icon: '🍿' },
    { id: 'secondary', label: 'Studio Ops', icon: '🎬' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'stream-metrics',
      title: 'CDN & Edge Ingest Telemetry',
      layout: 'grid',
      components: [
        {
          id: 'kpi-concurrent-viewers',
          type: 'METRIC_CARD',
          props: { label: 'Active Concurrent Streams', value: '4.8M', delta: '+340K peak live event', accentColor: '#38BDF8' },
          testID: 'dyn-stream-viewers',
        },
        {
          id: 'kpi-edge-latency',
          type: 'METRIC_CARD',
          props: { label: 'Edge Playback Latency', value: '1.2s', delta: 'Ultra-Low Latency CMAF', accentColor: '#10B981' },
          testID: 'dyn-stream-latency',
        },
      ],
    },
    {
      id: 'sec-viewer-streams',
      title: 'Trending Live & 4K Premieres (Viewer)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'media-item-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'ICC Cricket World Cup Final Live',
            subtitle: 'Ultra HD 4K • Multi-Cam Audio (English / Marathi / Hindi)',
            value: 'LIVE NOW',
            badge: '🔥 3.2M Watching',
            actionLabel: '▶ Stream 4K',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Connecting to CloudFront Edge HLS stream...' } },
          testID: 'dyn-stream-icc-live',
        },
        {
          id: 'media-item-2',
          type: 'ENTITY_LIST',
          props: {
            title: 'Mirzapur: Season 4 Exclusive Drop',
            subtitle: '10 Episodes • Dolby Vision HDR • Atmos 7.1',
            value: 'NEW SERIES',
            badge: '4K HDR',
            actionLabel: '+ My Watchlist',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Added to your offline download queue!' } },
          testID: 'dyn-stream-mirzapur',
        },
      ],
    },
    {
      id: 'sec-studio-controls',
      title: 'Broadcast Edge Controls (Studio Ops)',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'stream-toggle-cmaf',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Low-Latency CMAF Chunked Transfer',
            subtitle: 'Reduces edge glass-to-glass latency to under 1.5 seconds',
            initialValue: true,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Chunked CMAF stream settings updated.' } },
          testID: 'dyn-stream-toggle-cmaf',
        },
        {
          id: 'stream-toggle-drm',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Widevine L1 & FairPlay Hardware DRM Enforce',
            subtitle: 'Blocks screen recordings and unauthorized mirror casts',
            initialValue: true,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Hardware DRM enforcement verified.' } },
          testID: 'dyn-stream-toggle-drm',
        },
      ],
    },
  ],
};

export const DYNAMIC_PUBLIC_SECTOR_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-public-sector',
  title: '07. 311 Citizen Grievance & Ward Municipal Hub',
  subtitle: 'Direct Citizen-to-Government Escalation & SLA Resolution Engine',
  roles: [
    { id: 'primary', label: 'Citizen', icon: '🏛️' },
    { id: 'secondary', label: 'Ward Officer', icon: '🛡️' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'civic-metrics',
      title: 'Municipal Ward Telemetry',
      layout: 'grid',
      components: [
        {
          id: 'kpi-resolved-sla',
          type: 'METRIC_CARD',
          props: { label: '24h Grievance SLA Resolution', value: '94.6%', delta: 'Target: >90%', accentColor: '#10B981' },
          testID: 'dyn-civic-sla',
        },
        {
          id: 'kpi-open-tickets',
          type: 'METRIC_CARD',
          props: { label: 'Active Ward Tickets', value: '184', delta: 'Ward K-East (Andheri)', accentColor: '#F59E0B' },
          testID: 'dyn-civic-tickets',
        },
      ],
    },
    {
      id: 'sec-citizen-tickets',
      title: 'Citizen Grievances & Service Requests',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'ticket-item-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Main Arterial Road Pothole Repair',
            subtitle: 'Ticket #MCGM-2026-9148 • S.V. Road, Bandra West',
            value: 'IN PROGRESS',
            badge: '⚡ Assigned to PWD',
            actionLabel: 'Track GPS Crew',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'PWD Road Repair Van is 1.2km away.' } },
          testID: 'dyn-civic-ticket-1',
        },
        {
          id: 'ticket-item-2',
          type: 'ENTITY_LIST',
          props: {
            title: 'Clean Drinking Water Pipe Pressure Drop',
            subtitle: 'Ticket #MCGM-2026-8802 • Ward G-North, Dadar',
            value: 'RESOLVED',
            badge: '✓ Verified by Ward',
            actionLabel: 'Rate Service',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Feedback submitted to Municipal Commissioner.' } },
          testID: 'dyn-civic-ticket-2',
        },
      ],
    },
    {
      id: 'sec-ward-toggles',
      title: 'Ward Operations & Dispatch Controls (Officer)',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'ward-toggle-monsoon',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Monsoon Flood Protocol & Dewatering Pumps',
            subtitle: 'Automates emergency water discharge across low-lying culverts',
            initialValue: true,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Monsoon water discharge protocols active.' } },
          testID: 'dyn-civic-toggle-monsoon',
        },
      ],
    },
  ],
};

export const DYNAMIC_CHAT_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-chat',
  title: '08. E2E Encrypted Messenger & Community Channels',
  subtitle: 'Signal Protocol Double-Ratchet • Ephemeral Media Engine',
  roles: [
    { id: 'primary', label: 'Participant', icon: '💬' },
    { id: 'secondary', label: 'Moderator', icon: '👮' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'chat-metrics',
      title: 'Crypto Session Telemetry',
      layout: 'grid',
      components: [
        {
          id: 'kpi-e2e-status',
          type: 'METRIC_CARD',
          props: { label: 'Double Ratchet Keys', value: '4,096-bit', delta: 'Forward Secrecy Verified', accentColor: '#10B981' },
          testID: 'dyn-chat-e2e',
        },
        {
          id: 'kpi-active-channels',
          type: 'METRIC_CARD',
          props: { label: 'Active Encrypted Channels', value: '38', delta: 'Zero Server Logs Kept', accentColor: '#8B5CF6' },
          testID: 'dyn-chat-channels',
        },
      ],
    },
    {
      id: 'sec-chat-threads',
      title: 'Verified Encrypted Conversations (Participant)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'thread-item-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Tech Architects & Systems Engineering',
            subtitle: 'Aarav: "Production build deployed with zero downtime!"',
            value: '18:42',
            badge: '🔒 E2E',
            actionLabel: 'Open Chat',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Decrypted 18 pending messages using local device key.' } },
          testID: 'dyn-chat-thread-1',
        },
        {
          id: 'thread-item-2',
          type: 'ENTITY_LIST',
          props: {
            title: 'Family & Friends Circle',
            subtitle: 'Riya: "Dinner at 8 PM at Bandra?"',
            value: '18:15',
            badge: '2 New',
            actionLabel: 'Open Chat',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Opening encrypted peer thread.' } },
          testID: 'dyn-chat-thread-2',
        },
      ],
    },
    {
      id: 'sec-mod-controls',
      title: 'Community Governance & Anti-Spam (Moderator)',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'chat-toggle-slowmode',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Community Slow Mode (30s Rate Limit)',
            subtitle: 'Prevents automated spam and bot flooding in public channels',
            initialValue: false,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Slow mode rate limits updated.' } },
          testID: 'dyn-chat-toggle-slowmode',
        },
      ],
    },
  ],
};

export const DYNAMIC_MOBILITY_TEMPLATE: DynamicPageDefinition = {
  pageId: 'dyn-mobility',
  title: '11. Urban Mobility & Smart Fleet Dispatch',
  subtitle: 'Real-Time Telematics • Dynamic Geo-Surge & Driver Matching',
  roles: [
    { id: 'primary', label: 'Rider', icon: '🚕' },
    { id: 'secondary', label: 'Fleet Captain', icon: '🧭' },
  ],
  initialRole: 'primary',
  sections: [
    {
      id: 'mobility-metrics',
      title: 'Fleet & Surge Telemetry',
      layout: 'grid',
      components: [
        {
          id: 'kpi-nearby-cabs',
          type: 'METRIC_CARD',
          props: { label: 'Nearby Active Drivers', value: '28 Cabs', delta: 'ETA < 3 mins in BKC', accentColor: '#10B981' },
          testID: 'dyn-mobility-cabs',
        },
        {
          id: 'kpi-surge-multiplier',
          type: 'METRIC_CARD',
          props: { label: 'Live Surge Index', value: '1.0x', delta: 'Standard Peak Fare', accentColor: '#38BDF8' },
          testID: 'dyn-mobility-surge',
        },
      ],
    },
    {
      id: 'sec-rider-rides',
      title: 'Available Fleets & Instant Booking (Rider)',
      layout: 'stack',
      roleVisibility: ['primary'],
      components: [
        {
          id: 'ride-item-1',
          type: 'ENTITY_LIST',
          props: {
            title: 'Prime Sedan (Toyota Camry Hybrid)',
            subtitle: 'Top Rated Captain • AC On • Free FastTag Tolls',
            value: '₹340',
            badge: '⚡ 2 min away',
            actionLabel: 'Confirm Prime',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Driver Rajesh (MH-02-EE-4921) dispatched! OTP: 4921' } },
          testID: 'dyn-mobility-ride-1',
        },
        {
          id: 'ride-item-2',
          type: 'ENTITY_LIST',
          props: {
            title: 'Express EV Bike Taxi',
            subtitle: 'Zero Emission • Beat Traffic • Helmet Provided',
            value: '₹85',
            badge: '⚡ 1 min away',
            actionLabel: 'Book Bike',
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'EV Bike Captain dispatched! OTP: 8812' } },
          testID: 'dyn-mobility-ride-2',
        },
      ],
    },
    {
      id: 'sec-captain-controls',
      title: 'Captain Duty & Destination Filters (Captain)',
      layout: 'stack',
      roleVisibility: ['secondary'],
      components: [
        {
          id: 'mobility-toggle-duty',
          type: 'TOGGLE_ROW',
          props: {
            title: 'Captain Online Duty Switch',
            subtitle: 'Broadcast live GPS location to dispatch server for ride matches',
            initialValue: true,
          },
          action: { type: 'SHOW_TOAST', payload: { message: 'Captain duty status toggled.' } },
          testID: 'dyn-mobility-toggle-duty',
        },
      ],
    },
  ],
};

/**
 * Universal Registry mapping domain keys to dynamic SDUI page definitions.
 * All 12 industry projects are represented declaratively without hardcoded domain screens.
 */
export const DYNAMIC_DOMAINS_REGISTRY: Record<string, DynamicPageDefinition> = {
  MEDICAL: DYNAMIC_MEDICAL_TEMPLATE,
  ECOMMERCE: DYNAMIC_ECOMMERCE_TEMPLATE,
  STREAMING: DYNAMIC_STREAMING_TEMPLATE,
  PAYMENTS: DYNAMIC_PAYMENTS_TEMPLATE,
  BANKING: DYNAMIC_BANKING_TEMPLATE,
  ENERGY: DYNAMIC_ENERGY_TEMPLATE,
  PUBLIC_SECTOR: DYNAMIC_PUBLIC_SECTOR_TEMPLATE,
  CHAT: DYNAMIC_CHAT_TEMPLATE,
  DELIVERY: DYNAMIC_DELIVERY_TEMPLATE,
  STORAGE: DYNAMIC_STORAGE_TEMPLATE,
  MOBILITY: DYNAMIC_MOBILITY_TEMPLATE,
  ADMIN: DYNAMIC_ADMIN_TEMPLATE,
};
