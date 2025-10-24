import { TestBed } from '@angular/core/testing';

import { LearningApi } from './learning-api';

describe('LearningApi', () => {
  let service: LearningApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
