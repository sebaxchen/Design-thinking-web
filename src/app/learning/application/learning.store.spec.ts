import { TestBed } from '@angular/core/testing';

import { LearningStore } from './learning.store';

describe('LearningStore', () => {
  let service: LearningStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
