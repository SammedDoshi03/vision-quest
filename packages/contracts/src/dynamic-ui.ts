import { z } from 'zod';

// ==========================================
// 1. SDUI Action Discriminated Union Protocol
// ==========================================

export type DynamicActionType =
  | 'API_MUTATION'
  | 'NAVIGATE'
  | 'NATIVE_BRIDGE'
  | 'OPEN_SHEET'
  | 'CHANGE_ROLE'
  | 'SHOW_TOAST'
  | 'TOGGLE_SWITCH'
  | 'UPDATE_COUNTER'
  | 'DISPATCH_API' // legacy alias for API_MUTATION
  | 'CUSTOM';

export interface BaseSDUIAction {
  type: DynamicActionType;
  actionId?: string;
  payload?: Record<string, any>;
}

export interface ApiMutationAction extends BaseSDUIAction {
  type: 'API_MUTATION' | 'DISPATCH_API';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  optimisticPatch?: Record<string, any>;
  rollbackOnFail?: boolean;
  enqueueOfflineOutbox?: boolean;
}

export interface NavigateAction extends BaseSDUIAction {
  type: 'NAVIGATE';
  targetRoute: string;
  params?: Record<string, any>;
}

export interface NativeBridgeAction extends BaseSDUIAction {
  type: 'NATIVE_BRIDGE';
  capability:
    | 'BIOMETRIC_UNLOCK'
    | 'QR_SCAN'
    | 'BLE_PROBE'
    | 'HAPTIC_HEAVY'
    | 'HAPTIC_SUCCESS'
    | 'CAMERA_CAPTURE'
    | 'VOICE_PROMPT';
  onSuccessAction?: DynamicAction;
}

export interface OpenSheetAction extends BaseSDUIAction {
  type: 'OPEN_SHEET';
  sheetTitle?: string;
  sheetSchema?: DynamicSectionDefinition;
}

export interface ChangeRoleAction extends BaseSDUIAction {
  type: 'CHANGE_ROLE';
  role: 'primary' | 'secondary';
}

export interface ShowToastAction extends BaseSDUIAction {
  type: 'SHOW_TOAST';
  message: string;
  severity?: 'info' | 'success' | 'warn' | 'error';
}

export interface ToggleSwitchAction extends BaseSDUIAction {
  type: 'TOGGLE_SWITCH';
  key: string;
  value: boolean;
}

export interface UpdateCounterAction extends BaseSDUIAction {
  type: 'UPDATE_COUNTER';
  key: string;
  delta: number;
}

export interface CustomAction extends BaseSDUIAction {
  type: 'CUSTOM';
  actionId: string;
}

export type DynamicAction =
  | ApiMutationAction
  | NavigateAction
  | NativeBridgeAction
  | OpenSheetAction
  | ChangeRoleAction
  | ShowToastAction
  | ToggleSwitchAction
  | UpdateCounterAction
  | CustomAction
  | BaseSDUIAction;

export const SDUIActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('API_MUTATION'),
    endpoint: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    optimisticPatch: z.record(z.any()).optional(),
    rollbackOnFail: z.boolean().optional(),
    enqueueOfflineOutbox: z.boolean().optional(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('NAVIGATE'),
    targetRoute: z.string(),
    params: z.record(z.any()).optional(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('NATIVE_BRIDGE'),
    capability: z.enum([
      'BIOMETRIC_UNLOCK',
      'QR_SCAN',
      'BLE_PROBE',
      'HAPTIC_HEAVY',
      'HAPTIC_SUCCESS',
      'CAMERA_CAPTURE',
      'VOICE_PROMPT',
    ]),
    onSuccessAction: z.any().optional(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('OPEN_SHEET'),
    sheetTitle: z.string().optional(),
    sheetSchema: z.any().optional(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('CHANGE_ROLE'),
    role: z.enum(['primary', 'secondary']),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('SHOW_TOAST'),
    message: z.string(),
    severity: z.enum(['info', 'success', 'warn', 'error']).optional(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('TOGGLE_SWITCH'),
    key: z.string(),
    value: z.boolean(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('UPDATE_COUNTER'),
    key: z.string(),
    delta: z.number(),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('DISPATCH_API'),
    actionId: z.string().optional(),
    payload: z.record(z.any()).optional(),
  }),
  z.object({
    type: z.literal('CUSTOM'),
    actionId: z.string(),
    payload: z.record(z.any()).optional(),
  }),
]);

// ==========================================
// 2. Dynamic Component Type Taxonomy
// ==========================================

export type DynamicComponentType =
  // Layout Primitives
  | 'BOX'
  | 'HSTACK'
  | 'VSTACK'
  | 'GRID'
  | 'SPACER'
  | 'DIVIDER'
  | 'COLLAPSIBLE_SECTION'
  // Typography & Media Primitives
  | 'TEXT'
  | 'BADGE'
  | 'AVATAR'
  | 'PROGRESSIVE_IMAGE'
  | 'ICON'
  // Form & Input Primitives
  | 'FORM_INPUT'
  | 'CURRENCY_INPUT'
  | 'OTP_INPUT'
  | 'SELECT_SHEET'
  | 'DATE_TIME_PICKER'
  | 'SLIDER'
  | 'CHECKLIST_GROUP'
  // Domain Hardware & Media Composites
  | 'VIDEO_SURFACE'
  | 'SCANNER_VIEWPORT'
  | 'HARDWARE_PROBE_CARD'
  | 'SECURE_MASKED_FIELD'
  | 'MAP_RADAR_CANVAS'
  | 'SEGMENTED_BAR'
  // Dashboard & Interactive Molecules
  | 'METRIC_CARD'
  | 'ACTION_BUTTON'
  | 'STATUS_BANNER'
  | 'TOGGLE_ROW'
  | 'ENTITY_LIST'
  | 'STEPPER_CONTROL'
  | 'AUDIO_SOUNDBOX'
  | 'PROGRESS_GAUGE';

export interface DynamicComponentDefinition {
  id: string;
  type: DynamicComponentType;
  props: Record<string, any>;
  roleVisibility?: string[]; // e.g. ['primary'] or ['secondary']
  action?: DynamicAction;
  testID?: string;
}

export interface DynamicSectionDefinition {
  id: string;
  title?: string;
  subtitle?: string;
  layout: 'stack' | 'grid' | 'carousel';
  roleVisibility?: string[];
  components: DynamicComponentDefinition[];
}

export interface DynamicRoleSpec {
  id: 'primary' | 'secondary';
  label: string;
  icon: string;
}

export interface DynamicPageDefinition {
  pageId: string;
  title: string;
  subtitle?: string;
  roles: [DynamicRoleSpec, DynamicRoleSpec];
  initialRole?: 'primary' | 'secondary';
  sections: DynamicSectionDefinition[];
}

export const DynamicPageSchema = z.object({
  pageId: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  roles: z.tuple([
    z.object({ id: z.enum(['primary', 'secondary']), label: z.string(), icon: z.string() }),
    z.object({ id: z.enum(['primary', 'secondary']), label: z.string(), icon: z.string() }),
  ]),
  initialRole: z.enum(['primary', 'secondary']).optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      layout: z.enum(['stack', 'grid', 'carousel']),
      roleVisibility: z.array(z.string()).optional(),
      components: z.array(
        z.object({
          id: z.string(),
          type: z.string() as any,
          props: z.record(z.any()),
          roleVisibility: z.array(z.string()).optional(),
          action: z.any().optional(),
          testID: z.string().optional(),
        })
      ),
    })
  ),
});
