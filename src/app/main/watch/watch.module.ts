import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchComponent } from './watch.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: '', component: WatchComponent}
    ])
  ],
  declarations: [WatchComponent]
})
export class WatchModule { }
