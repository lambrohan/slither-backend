import { Injectable } from '@nestjs/common';
import axios from 'axios';
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
}
