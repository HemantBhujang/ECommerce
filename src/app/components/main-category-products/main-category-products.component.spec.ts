import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoryProductsComponent } from './main-category-products.component';

describe('MainCategoryProductsComponent', () => {
  let component: MainCategoryProductsComponent;
  let fixture: ComponentFixture<MainCategoryProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainCategoryProductsComponent]
    });
    fixture = TestBed.createComponent(MainCategoryProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
