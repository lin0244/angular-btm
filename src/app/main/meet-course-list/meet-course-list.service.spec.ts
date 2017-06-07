import { TestBed, inject } from '@angular/core/testing';

import { MeetCourseListService } from './meet-course-list.service';

describe('MeetCourseListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeetCourseListService]
    });
  });

  it('should ...', inject([MeetCourseListService], (service: MeetCourseListService) => {
    expect(service).toBeTruthy();
  }));
});
