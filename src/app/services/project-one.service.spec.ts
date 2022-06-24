import { TestBed } from '@angular/core/testing';

import { ProjectOneService } from './project-one.service';

describe('ProjectOneService', () => {
  let service: ProjectOneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectOneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
