import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { UsersComponent } from './users.component';
import { UsersRoutes } from './users.routing';
import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {GroupsService} from '../shared/services/groups.service';
import {SharedModule} from '../shared/share.module';
import {UsersService} from '../shared/services/users.service';
import {AuthGuard} from '../shared/guards/auth.guard';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsersRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        UsersService,
        GroupsService,
        PagerService,
        AuthGuard
    ]
})

export class UsersModule {}
