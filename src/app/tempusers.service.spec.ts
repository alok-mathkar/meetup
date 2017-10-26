import { TestBed, inject } from '@angular/core/testing';

import { TempusersService } from './tempusers.service';

describe('TempusersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempusersService]
    });
  });

  it('should ...', inject([TempusersService], (service: TempusersService) => {
    expect(service).toBeTruthy();
  }));
});
