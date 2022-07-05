import { Module } from '@nestjs/common';
import { TxnService } from './txn.service';
import { TxnController } from './txn.controller';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [TxnController],
  providers: [TxnService],
  imports: [WalletModule],
  exports: [TxnService],
})
export class TxnModule {}
