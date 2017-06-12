import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetCourseListComponent } from './meet-course-list.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: MeetCourseListComponent}
    ])
  ],
  declarations: [MeetCourseListComponent]
})
export class MeetCourseListModule { }
