import { Global, Module } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { Web3Service } from './web3.service';

@Global()
@Module({
  providers: [Web3Service, ConversionService],
  exports: [Web3Service, ConversionService],
})
export class Web3Module {}
