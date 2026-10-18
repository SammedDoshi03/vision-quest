import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DYNAMIC_DOMAINS_REGISTRY, DynamicPageDefinition } from '@internal/contracts';
import { RedisCacheService } from '../../infrastructure/redis.cache.service';

@ApiTags('Server-Driven UI')
@Controller('v1/sdui')
export class SduiController {
  constructor(private readonly cacheService: RedisCacheService) {}

  @Get('domains')
  @ApiOperation({ summary: 'List all available dynamic SDUI domain templates' })
  async getDomains(): Promise<string[]> {
    return Object.keys(DYNAMIC_DOMAINS_REGISTRY);
  }

  @Get('pages/:domainKey')
  @ApiOperation({ summary: 'Fetch dynamic page layout and components for a domain vertical' })
  @ApiParam({ name: 'domainKey', example: 'MEDICAL', description: 'One of the 12 domain keys' })
  async getPageDefinition(@Param('domainKey') domainKey: string): Promise<DynamicPageDefinition> {
    const key = domainKey.toUpperCase();
    const cacheKey = `sdui:page:${key}`;

    const cached = await this.cacheService.get<DynamicPageDefinition>(cacheKey);
    if (cached) {
      return cached;
    }

    const template = DYNAMIC_DOMAINS_REGISTRY[key];
    if (!template) {
      throw new NotFoundException(`No dynamic page definition found for domain: ${domainKey}`);
    }

    await this.cacheService.set(cacheKey, template, 600); // 10 min TTL
    return template;
  }

  @Post('pages/:domainKey')
  @ApiOperation({ summary: 'Publish or hot-patch dynamic layout from Admin/CMS console' })
  async updatePageDefinition(
    @Param('domainKey') domainKey: string,
    @Body() pageDef: DynamicPageDefinition
  ): Promise<{ success: boolean; domainKey: string }> {
    const key = domainKey.toUpperCase();
    const cacheKey = `sdui:page:${key}`;
    await this.cacheService.set(cacheKey, pageDef, 3600);
    return { success: true, domainKey: key };
  }
}
