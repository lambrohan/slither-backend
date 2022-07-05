import { Injectable } from '@nestjs/common';
import { Web3Config } from 'src/configs';
import babyDogeAbi from './abi/babydoge.json';
import depositAbi from './abi/deposit.json';
import Web3 from 'web3';
import { TxnDetailsFromDepositId } from 'src/common/interfaces';

export interface Web3Transaction {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gas: number;
  gasPrice: string;
  input: string;
}

@Injectable()
export class Web3Service {
  web3: Web3;
  babyDogeContract: any;
  depositContract: any;
  constructor() {
    this.web3 = new Web3(Web3Config.URL);
    this.depositContract = new this.web3.eth.Contract(
      depositAbi as any,
      Web3Config.DEPOSIT_CONTRACT_ADDR,
    );
  }

  async getTxnDetailsFromHash(): Promise<any> {
    return await this.depositContract.getPastEvents('TokensDeposited');
  }

  async getTxnDetailsFromDepositId(
    id: string,
  ): Promise<TxnDetailsFromDepositId> {
    return await this.depositContract.methods.idToDeposit(id).call();
  }

  async sendTokensToUser(public_address: string, amt: number) {
    console.log(this.depositContract.methods);
  }
}
