import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Block } from './model/Block';
import { Prescription } from './model/Prescription';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query('appKey') appkey: string): Promise<{ status: string }> {
    checkAppKey(appkey);
    return { status: 'App UP' };
  }

  @Get('getChain')
  async getChain(@Query('appKey') appkey: string): Promise<{ lenth: number }> {
    checkAppKey(appkey);
    return { lenth: this.appService.getLenth() };
  }

  @Get('getFullChain')
  async getFullChain(
    @Query('appKey') appkey: string,
  ): Promise<{ chain: Block[] }> {
    checkAppKey(appkey);
    return { chain: this.appService.getChain() };
  }

  @Get('list/block/pending')
  async listPendingBlocks(
    @Query('appKey') appkey: string,
  ): Promise<{ prescriptions: Prescription[] }> {
    checkAppKey(appkey);
    return {
      prescriptions: this.appService.ListToMine(),
    };
  }
  @Get('audit')
  retrieveHashAuditFile(@Query('appKey') appkey: string): { audit: string } {
    checkAppKey(appkey);
    return {
      audit: this.appService.auditHashFile(),
    };
  }
  @Get('chainaudit')
  retrieveChainAuditFile(@Query('appKey') appkey: string): { audit: string } {
    checkAppKey(appkey);
    return {
      audit: this.appService.auditChainFile(),
    };
  }
}
function checkAppKey(appkey: string) {
  if (appkey == 'asiojbndikjbvkjnsihdsihsfvbjshbcmns') return;
  else throw new Error('Wrong App Key');
}
