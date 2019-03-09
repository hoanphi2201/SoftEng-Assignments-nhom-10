import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import {GetStreamService} from '../services/GetStreamService';
@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ NavbarComponent ],
    providers: [GetStreamService],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
