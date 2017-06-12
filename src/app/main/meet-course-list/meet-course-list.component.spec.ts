import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCourseListComponent } from './meet-course-list.component';

describe('MeetCourseListComponent', () => {
  let component: MeetCourseListComponent;
  let fixture: ComponentFixture<MeetCourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetCourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
