import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes} from '@angular/router';
export const ChildRoutes: Routes = [
    { path: 'userCenter', loadChildren: 'app/main/user-center/user-center.module#UserCenterModule'},
    { path: 'meetCourseList/:idSta', loadChildren: 'app/main/meet-course-list/meet-course-list.module#MeetCourseListModule'},
    { path: 'courseList/:idSta', loadChildren: 'app/main/course-list/course-list.module#CourseListModule'},
    { path: 'director', loadChildren: 'app/main/director/director.module#DirectorModule'},
    { path: 'guarantee', loadChildren: 'app/main/guarantee/guarantee.module#GuaranteeModule'},
    { path: 'commissioner', loadChildren: 'app/main/commissioner/commissioner.module#CommissionerModule'},
    { path: 'watch', loadChildren: 'app/main/watch/watch.module#WatchModule'}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        {path: '', component: MainComponent, children: ChildRoutes}
    ])
  ],
  declarations: [MainComponent]
})
export class MainModule { }
