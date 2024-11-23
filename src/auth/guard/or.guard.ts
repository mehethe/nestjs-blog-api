import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class OrGuardBase implements CanActivate {
  private guards: Type<CanActivate>[];
  private errorMessages: string[] = [];

  constructor(private readonly moduleRef: ModuleRef) {}

  setGuards(guards: Type<CanActivate>[]): void {
    this.guards = guards;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.guards || this.guards.length === 0) {
      throw new UnauthorizedException('No guards defined.');
    }

    for (const GuardClass of this.guards) {
      try {
        const guardInstance = await this.moduleRef.resolve(GuardClass);
        const result = await guardInstance.canActivate(context);

        if (result) {
          return true; // Grant access if any guard passes
        }
      } catch (err) {
        // Collect error messages from each guard
        this.errorMessages.push(
          err?.response?.message || err.message || 'Unknown error',
        );
      }
    }

    // If no guards passed, throw an UnauthorizedException with collected errors
    throw new UnauthorizedException(this.errorMessages[0]);
  }
}

export function createOrGuard(guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class DynamicOrGuard extends OrGuardBase {
    constructor(moduleRef: ModuleRef) {
      super(moduleRef);
      this.setGuards(guards); // Pass guards dynamically
    }
  }

  return DynamicOrGuard;
}
