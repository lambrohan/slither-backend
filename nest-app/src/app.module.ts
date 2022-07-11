import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { TxnModule } from './txn/txn.module';
import { Web3Module } from './web3/web3.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { Web3JwtAuthGuard } from './auth/web3.guard';
import { PlaySessionModule } from './play_session/play_session.module';
import { RoomModule } from './room/room.module';
import { GlobalModule } from './global.module';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [
    GlobalModule,
    UserModule,
    WalletModule,
    TxnModule,
    Web3Module,
    AuthModule,
    PlaySessionModule,
    RoomModule,
    MetadataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: Web3JwtAuthGuard,
    },
  ],
})
export class AppModule {}
