import { Controller, Get, Header, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Block } from './model/Block';
import { Prescription } from './model/Prescription';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':appKey')
  async getHello(@Param('appKey') appkey: string): Promise<{ status: string }> {
    checkAppKey(appkey);
    return { status: 'App UP' };
  }

  @Get('getChain')
  async getChain(@Param('appKey') appkey: string): Promise<{ lenth: number }> {
    checkAppKey(appkey);
    return { lenth: this.appService.getLenth() };
  }

  @Get('getFullChain')
  async getFullChain(
    @Param('appKey') appkey: string,
  ): Promise<{ chain: Block[] }> {
    checkAppKey(appkey);
    return { chain: this.appService.getChain() };
  }

  @Get('list/block/pending')
  async listPendingBlocks(
    @Param('appKey') appkey: string,
  ): Promise<{ prescriptions: Prescription[] }> {
    checkAppKey(appkey);
    return {
      prescriptions: this.appService.ListToMine(),
    };
  }
}
function checkAppKey(appkey: string) {
  if (appkey == 'asiojbndikjbvkjnsihdsihsfvbjshbcmns') return;
  else throw new Error('Wrong App Key');
}
