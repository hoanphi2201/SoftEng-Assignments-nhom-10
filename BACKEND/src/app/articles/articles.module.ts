import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { ArticlesComponent } from './articles.component';
import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {GroupsService} from '../shared/services/groups.service';
import {SharedModule} from '../shared/share.module';
import {UsersService} from '../shared/services/users.service';
import {ArticlesRoutes} from './articles.routing';
import {ArticlesService} from '../shared/services/articles.service';
import {SubjectsService} from '../shared/services/subjects.service';
import {CategoriesService} from '../shared/services/categories.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ArticlesRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        ArticlesComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        PagerService,
        ArticlesService,
        CategoriesService
    ]
})

export class ArticlesModule {}
