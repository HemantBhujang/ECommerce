import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsCategoryComponent } from './kids-category.component';

describe('KidsCategoryComponent', () => {
  let component: KidsCategoryComponent;
  let fixture: ComponentFixture<KidsCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KidsCategoryComponent]
    });
    fixture = TestBed.createComponent(KidsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
