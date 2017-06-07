import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionerComponent } from './commissioner.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', component: CommissionerComponent}
    ])
  ],
  declarations: [CommissionerComponent]
})
export class CommissionerModule { }
