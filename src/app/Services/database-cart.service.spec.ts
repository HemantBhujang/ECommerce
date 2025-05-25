import { TestBed } from '@angular/core/testing';

import { DatabaseCartService } from './database-cart.service';

describe('DatabaseCartService', () => {
  let service: DatabaseCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
