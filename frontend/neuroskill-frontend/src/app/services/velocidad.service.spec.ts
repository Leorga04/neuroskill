import { TestBed } from '@angular/core/testing';

import { VelocidadService } from './velocidad.service';

describe('VelocidadService', () => {
  let service: VelocidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VelocidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
