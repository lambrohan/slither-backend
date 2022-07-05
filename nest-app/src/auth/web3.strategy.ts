import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as Web3Token from 'web3-token';
import { UserService } from 'src/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'web3') {
  constructor(private userService: UserService) {
    super();
  }

  async validate(req: Request, callback) {
    try {
      const [a, token] = req.headers.authorization.split('Bearer ');
      const { address } = await Web3Token.verify(token);
      const user = await this.userService.findWithPubAddr(address);
      if (!user) {
        throw new UnauthorizedException();
      }

      callback(null, user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
