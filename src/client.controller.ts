import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePresciptionDto } from './model/dto/createPrescriptionDto';

@Controller('client')
export class ClientController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<{ status: string }> {
    return { status: 'Client UP' };
  }

  @Get('getKey')
  async getKey(): Promise<{ message: string }> {
    return { message: await this.appService.generateClientKey() };
  }

  @Post()
  async addBlockToValidation(
    @Body() prescriptionDto: CreatePresciptionDto,
  ): Promise<{ message: string }> {
    return {
      message: await this.appService.addBlockToValidation(prescriptionDto),
    };
  }

  @Get('prescription/:id/list')
  async getUserPrescriptions(
    @Param('id') id: string,
  ): Promise<{ message: string[] }> {
    return {
      message: await this.appService.listUserPrescriptions(id),
    };
  }
}
