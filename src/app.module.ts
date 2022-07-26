import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientController } from './client.controller';
import { MinerController } from './miner.controller';

@Module({
  controllers: [AppController, MinerController, ClientController],
  providers: [AppService],
})
export class AppModule {}
