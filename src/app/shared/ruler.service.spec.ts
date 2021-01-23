import { TestBed } from '@angular/core/testing';

import { RulerService } from './ruler.service';

describe('RulerService', () => {
  let service: RulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
