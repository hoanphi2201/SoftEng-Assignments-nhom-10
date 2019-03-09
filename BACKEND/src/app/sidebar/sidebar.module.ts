import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import {SharedModule} from '../shared/share.module';
import {AuthenticationService} from '../shared/services/authentication.service';

@NgModule({
    imports: [ RouterModule, CommonModule, SharedModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ],
    providers: [AuthenticationService]
})

export class SidebarModule {}
