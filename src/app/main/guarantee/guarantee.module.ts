import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuaranteeComponent } from './guarantee.component';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: GuaranteeComponent}
    ])
  ],
  declarations: [GuaranteeComponent]
})
export class GuaranteeModule { }
