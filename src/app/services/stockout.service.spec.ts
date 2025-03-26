import { TestBed } from '@angular/core/testing';

import { StockoutService } from './stockout.service';

describe('StockoutService', () => {
  let service: StockoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
