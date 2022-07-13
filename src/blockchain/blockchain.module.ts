import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';

@Module({
  controllers: [BlockchainController],
  providers: [BlockchainService],
  imports: [BlockchainService]
})
export class BlockchainModule { }
