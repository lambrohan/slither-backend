import { BadRequestException } from '@nestjs/common';
import { CurrencyAddress } from 'src/common/enums';
import { TxnDetailsFromDepositId } from 'src/common/interfaces';

export function getBabyDogeFromTxn(txn: TxnDetailsFromDepositId): number {
  switch (txn.currency.toLowerCase()) {
    case CurrencyAddress.BABY_DOGE.toLowerCase():
      return txn.amount;
      break;
    case CurrencyAddress.BNB.toLowerCase():
      return txn.amount * 2;
      break;
    case CurrencyAddress.USDT.toLowerCase():
      return txn.amount * 4;
      break;
    default:
      throw new BadRequestException('currency not supported');
  }
}
