import { TestBed } from '@angular/core/testing';

import { IssueLoggingService } from './issue-logging.service';

describe('IssueLoggingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueLoggingService = TestBed.get(IssueLoggingService);
    expect(service).toBeTruthy();
  });
});
