import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { networkGuard } from './network.guard';

describe('networkGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => networkGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
