import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePresciptionDto } from './model/dto/createPrescriptionDto';
import { KeyPairObjectDto } from './model/dto/KeyPairObjectDto';

@Controller('client')
export class ClientController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<{ status: string }> {
    return { status: 'Client UP' };
  }

  @Get('getKey')
  async getKey(): Promise<{ message: KeyPairObjectDto }> {
    return { message: this.appService.generateClientKey() };
  }

  @Post()
  async addBlockToValidation(
    @Body() prescriptionDto: CreatePresciptionDto,
  ): Promise<{ message: string }> {
    return {
      message: this.appService.addBlockToValidation(prescriptionDto),
    };
  }

  @Get('prescription/:key/list')
  async getUserPrescriptions(
    @Param('key') base64UrlKey: string,
  ): Promise<object[]> {
    return this.appService.listUserPrescriptions(base64UrlKey);
  }

  @Get('sign/:key/:prescription')
  async signPrescription(
    @Param('key') base64UrlKey: string,
    @Param('prescription') prescription: string,
  ): Promise<{ message: string }> {
    return {
      message: await this.appService.encryptPrescription(
        base64UrlKey,
        prescription,
      ),
    };
  }

  @Get('verify/:key/:prescription')
  async verifyCrypto(
    @Param('key') base64UrlKey: string,
    @Param('prescription') prescription: string,
  ): Promise<{ message: string }> {
    return {
      message: await this.appService.validatePrescription(
        base64UrlKey,
        prescription,
      ),
    };
  }
}
