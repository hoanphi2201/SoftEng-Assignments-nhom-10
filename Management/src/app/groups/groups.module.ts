import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {GroupsComponent} from './groups.component';
import {GroupsRoutes} from './groups.routing';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {GroupsService} from '../shared/services/groups.service';
import {SharedModule} from '../shared/share.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GroupsRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        GroupsComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        PagerService,
        GroupsService
    ]
})

export class GroupsModule {}
