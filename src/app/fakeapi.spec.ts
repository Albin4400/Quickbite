import { TestBed } from '@angular/core/testing';

import { Fakeapi } from './fakeapi';

describe('Fakeapi', () => {
  let service: Fakeapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fakeapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
