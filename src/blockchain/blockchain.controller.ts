import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { Prescription } from './dto/Prescription';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) { }

  @Post()
  createPrescription(@Body() prescription: Prescription) {
    return this.blockchainService.createUserPrescription(prescription);
  }


  @Get()
  findOnePrescription(@Body() id: string) {
    return this.blockchainService.findUserPrescription(id);
  }
  // @Get()
  // findAllPrescriptions() {
  //   return this.blockchainService.findAll();
  // }

}
