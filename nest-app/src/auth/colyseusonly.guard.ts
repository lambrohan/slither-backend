import { CanActivate, ExecutionContext } from '@nestjs/common';
import { COLYSEUS_TOKEN } from 'src/configs';

export class ColyseusBackendOnly implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const colyseusToken = req.headers['colyseus-token'];
    if (colyseusToken && colyseusToken === COLYSEUS_TOKEN) {
      return true;
    }
    return false;
  }
}
