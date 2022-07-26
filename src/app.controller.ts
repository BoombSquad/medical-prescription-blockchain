import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Block } from './model/Block';
import { Prescription } from './model/Prescription';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<{ status: string }> {
    return { status: 'App UP' };
  }

  @Get('getChain')
  async getChain(): Promise<{ lenth: number }> {
    return { lenth: await this.appService.getLenth() };
  }

  @Get('getFullChain')
  async getFullChain(): Promise<{ chain: Block[] }> {
    return { chain: await this.appService.getChain() };
  }

  @Get('list/block/pending')
  async listPendingBlocks(): Promise<{ prescriptions: Prescription[] }> {
    return {
      prescriptions: await this.appService.ListToMine(),
    };
  }
}
