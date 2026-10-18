import { Module } from '@nestjs/common';
import { SduiController } from './sdui.controller';
import { RedisCacheService } from '../../infrastructure/redis.cache.service';

@Module({
  controllers: [SduiController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class SduiModule {}
