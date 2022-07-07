import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyAddress } from 'src/common/enums';
import { TxnDetailsFromDepositId } from 'src/common/interfaces';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3';
@Injectable()
export class ConversionService {
  /**
   * TODO - cache it later as coingecko has ratelimit 50/min
   * @returns usd rate for one babydoge
   */
  async usdRateForBabyDoge(): Promise<number> {
    const res = await axios.get(
      COINGECKO_URL + `/simple/price?ids=baby-doge-coin&vs_currencies=usd`,
    );

    return res.data['baby-doge-coin']['usd'];
  }

  async bnbRateForBabyDoge(): Promise<number> {
    const res = await axios.get(
      COINGECKO_URL + '/simple/price?ids=baby-doge-coin&vs_currencies=bnb',
    );
    return res.data['baby-doge-coin']['bnb'];
  }

  async usdRateForTether(): Promise<number> {
    const res = await axios.get(
      COINGECKO_URL + `/simple/price?ids=tether&vs_currencies=usd`,
    );

    return res.data['tether']['usd'];
  }

  async getBabyDogeFromTxn(txn: TxnDetailsFromDepositId): Promise<number> {
    switch (txn.currency.toLowerCase()) {
      case CurrencyAddress.BABY_DOGE.toLowerCase():
        return Math.round(txn.amount);
        break;
      case CurrencyAddress.BNB.toLowerCase(): {
        const R = await this.bnbRateForBabyDoge();
        return Math.round(txn.amount / R);
        break;
      }
      case CurrencyAddress.USDT.toLowerCase():
        const txnToUSD = (await this.usdRateForTether()) * txn.amount;
        const R = await this.usdRateForBabyDoge();
        return Math.round(txnToUSD / R);
        break;
      default:
        throw new BadRequestException('currency not supported');
    }
  }
}
