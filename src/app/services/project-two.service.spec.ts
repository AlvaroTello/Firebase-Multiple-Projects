import { TestBed } from '@angular/core/testing';

import { ProjectTwoService } from './project-two.service';

describe('ProjectTwoService', () => {
  let service: ProjectTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
