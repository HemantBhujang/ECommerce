import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOneProductComponent } from './payment-one-product.component';

describe('PaymentOneProductComponent', () => {
  let component: PaymentOneProductComponent;
  let fixture: ComponentFixture<PaymentOneProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentOneProductComponent]
    });
    fixture = TestBed.createComponent(PaymentOneProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
