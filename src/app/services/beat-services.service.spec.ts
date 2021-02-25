import { TestBed } from '@angular/core/testing';

import { BeatServicesService } from './beat-services.service';

describe('BeatServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeatServicesService = TestBed.get(BeatServicesService);
    expect(service).toBeTruthy();
  });
});
