import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

// only user.is_admin = true can pass through
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (user && user.is_admin) {
      return true;
    }

    return false;
  }
}
