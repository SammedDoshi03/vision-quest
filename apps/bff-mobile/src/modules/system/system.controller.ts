import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export interface AppVersionCheckResponse {
  isMaintenance: boolean;
  maintenanceMessage?: string;
  estimatedBackAtUtc?: string;
  updateRequired: boolean; // Force update
  updateAvailable: boolean; // Soft update
  latestVersion: string;
  minSupportedVersion: string;
  storeUrl: string;
  releaseNotes?: string;
}

@ApiTags('System')
@Controller('v1/system')
export class SystemController {
  @Get('status')
  @ApiOperation({ summary: 'Check maintenance window and version update requirements' })
  @ApiQuery({ name: 'platform', example: 'ios' })
  @ApiQuery({ name: 'currentVersion', example: '1.0.0' })
  async getSystemStatus(
    @Query('platform') platform = 'ios',
    @Query('currentVersion') currentVersion = '1.0.0'
  ): Promise<AppVersionCheckResponse> {
    const minVersion = '1.0.0';
    const latestVersion = '1.1.0';

    const isBelowMin = currentVersion < minVersion;
    const isBelowLatest = currentVersion < latestVersion;

    return {
      isMaintenance: false,
      maintenanceMessage: 'Scheduled server maintenance in progress. Local alarms remain fully operational.',
      updateRequired: isBelowMin,
      updateAvailable: isBelowLatest,
      latestVersion,
      minSupportedVersion: minVersion,
      storeUrl:
        platform === 'ios'
          ? 'https://apps.apple.com/app/id123456789'
          : 'https://play.google.com/store/apps/details?id=com.resonance.mobile',
      releaseNotes: 'Bilingual Marathi/English improvements and faster offline sync.',
    };
  }

  @Post('rating')
  @ApiOperation({ summary: 'Submit in-app satisfaction score and review feedback' })
  async submitInAppRating(
    @Body() body: { userId: string; ratingStars: number; feedbackText?: string; promptTrigger: string }
  ): Promise<{ success: boolean }> {
    console.log(`[InAppRating] User ${body.userId} submitted ${body.ratingStars} stars on trigger: ${body.promptTrigger}`);
    return { success: true };
  }
}
