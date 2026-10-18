import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UiComponentKey } from '@internal/contracts';

export interface ClientCtx {
  requestId: string;
  locale: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  uiKitVersion: string;
  capabilities: Set<UiComponentKey>;
}

export const ClientContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ClientCtx => {
    const req = ctx.switchToHttp().getRequest();
    const headers = req.headers || {};

    const requestId =
      (headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const locale = ((headers['accept-language'] as string) || 'en-IN').split(',')[0];
    const platform = (headers['x-platform'] as 'ios' | 'android' | 'web') || 'ios';
    const appVersion = (headers['x-app-version'] as string) || '1.0.0';
    const uiKitVersion = (headers['x-ui-kit-version'] as string) || '1.0.0';

    // Capability negotiation based on UI Kit Version
    const capabilities = new Set<UiComponentKey>([
      'KindredList',
      'SceneCarousel',
      'QuestStack',
      'ExploreNichesCTA',
    ]);

    return {
      requestId,
      locale,
      platform,
      appVersion,
      uiKitVersion,
      capabilities,
    };
  }
);
