import { TestBed } from '@angular/core/testing';

import { AimService } from './aim.service';

describe('AimService', () => {
  let service: AimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
