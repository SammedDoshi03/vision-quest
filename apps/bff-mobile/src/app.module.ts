import { Module } from '@nestjs/common';
import { FeedController } from './feed/feed.controller';
import { FeedOrchestrator } from './feed/feed.orchestrator';
import { FeedViewModelMapper } from './feed/feed.mapper';
import { ScenesController } from './scenes/scenes.controller';
import { InteractionsController } from './interactions/interactions.controller';
import { MockDomainServices } from './services/domain-services';
import { MedicalModule } from './modules/medical/medical.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { StreamingModule } from './modules/streaming/streaming.module';
import { PaymentModule } from './modules/payment/payment.module';
import { BankingModule } from './modules/banking/banking.module';
import { EnergyModule } from './modules/energy/energy.module';
import { PublicSectorModule } from './modules/public-sector/public-sector.module';
import { ChatModule } from './modules/chat/chat.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { StorageModule } from './modules/storage/storage.module';
import { MobilityModule } from './modules/mobility/mobility.module';
import { ReelsModule } from './modules/reels/reels.module';
import { SystemModule } from './modules/system/system.module';
import { SduiModule } from './modules/sdui/sdui.module';

@Module({
  imports: [
    MedicalModule,
    EcommerceModule,
    StreamingModule,
    PaymentModule,
    BankingModule,
    EnergyModule,
    PublicSectorModule,
    ChatModule,
    DeliveryModule,
    StorageModule,
    MobilityModule,
    ReelsModule,
    SystemModule,
    SduiModule,
  ],
  controllers: [FeedController, ScenesController, InteractionsController],
  providers: [
    FeedOrchestrator,
    FeedViewModelMapper,
    MockDomainServices,
  ],
})
export class AppModule {}
