import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentCategoryProductsComponent } from './parent-category-products.component';

describe('ParentCategoryProductsComponent', () => {
  let component: ParentCategoryProductsComponent;
  let fixture: ComponentFixture<ParentCategoryProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentCategoryProductsComponent]
    });
    fixture = TestBed.createComponent(ParentCategoryProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
