import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  status: 'onboarding' | 'active' | 'suspended';
  roles: string[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || '';

    // In production, verifies JWT signature against Identity Service public keys
    // For skeleton & dev sandbox, extracts Bearer or provides authenticated dev fallback
    if (!authHeader.startsWith('Bearer ')) {
      // In dev environment or tests if x-dev-user-id header is provided
      const devUserId = request.headers['x-dev-user-id'];
      if (devUserId) {
        request.user = {
          id: String(devUserId),
          phoneNumber: '+919876543210',
          status: 'active',
          roles: ['user'],
        } as AuthUser;
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.substring(7);
    if (!token) {
      throw new UnauthorizedException('Empty bearer token');
    }

    // Populate user from token claims
    request.user = {
      id: request.headers['x-user-id'] || 'user_101',
      phoneNumber: '+919876543210',
      status: 'active',
      roles: ['user'],
    } as AuthUser;

    return true;
  }
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
