import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOneProductComponent } from './cash-one-product.component';

describe('CashOneProductComponent', () => {
  let component: CashOneProductComponent;
  let fixture: ComponentFixture<CashOneProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashOneProductComponent]
    });
    fixture = TestBed.createComponent(CashOneProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
