import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockoutPage } from './stockout.page';

describe('StockoutPage', () => {
  let component: StockoutPage;
  let fixture: ComponentFixture<StockoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
