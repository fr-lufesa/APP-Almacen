import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockinPage } from './stockin.page';

describe('StockinPage', () => {
  let component: StockinPage;
  let fixture: ComponentFixture<StockinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StockinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
