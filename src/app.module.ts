import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { BlockchainService } from './blockchain/blockchain.service';

@Module({
  imports: [BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {

  constructor(private blockchainService: BlockchainService) {
  }

  onModuleInit() {
    console.log(`Initialization...`);
    this.blockchainService.startChain();
  }
}
