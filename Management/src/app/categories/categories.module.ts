import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {CategoriesComponent} from './categories.component';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {GroupsService} from '../shared/services/groups.service';
import {SharedModule} from '../shared/share.module';
import {SubjectsService} from '../shared/services/subjects.service';
import {CategoriesRoutes} from './categories.routing';
import {CategoriesService} from '../shared/services/categories.service';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CategoriesRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        CategoriesComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        PagerService,
        SubjectsService,
        CategoriesService
    ]
})

export class CategoriesModule {}
