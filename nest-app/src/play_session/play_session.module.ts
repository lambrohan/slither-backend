import { Module } from '@nestjs/common';
import { PlaySessionService } from './play_session.service';
import { PlaySessionController } from './play_session.controller';
import { UserModule } from 'src/user/user.module';
import { TxnModule } from 'src/txn/txn.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  controllers: [PlaySessionController],
  providers: [PlaySessionService],
  imports: [UserModule, TxnModule, WalletModule, RoomModule],
})
export class PlaySessionModule {}
