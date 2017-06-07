import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCenterComponent } from './user-center.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: UserCenterComponent}
    ])
  ],
  declarations: [UserCenterComponent]
})
export class UserCenterModule { }
