import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {SubjectsComponent} from './subjects.component';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {GroupsService} from '../shared/services/groups.service';
import {SharedModule} from '../shared/share.module';
import {SubjectsRoutes} from './subjects.routing';
import {SubjectsService} from '../shared/services/subjects.service';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SubjectsRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        SubjectsComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        PagerService,
        SubjectsService
    ]
})

export class SubjectsModule {}
