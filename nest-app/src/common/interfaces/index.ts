import { CurrencyAddress } from '../enums';

export interface TxnDetailsFromDepositId {
  amount: number;
  currency: CurrencyAddress;
  user: string;
}
