import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('miner')
export class MinerController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<{ status: string }> {
    return { status: 'Miner UP' };
  }

  @Get('mine/:id')
  async mineBlock(@Param('id') id: string): Promise<{ message: string }> {
    return {
      message: await this.appService.mineBlock(id),
    };
  }

  @Get('mineAll/:id')
  async mineAllBlock(@Param('id') id: string): Promise<{ message: string }> {
    return {
      message: await this.appService.mineAllBlock(id),
    };
  }

  @Get('block/pending')
  async pendingBlocks(): Promise<{ message: string }> {
    return {
      message: await this.appService.verifyListToMine(),
    };
  }
}
