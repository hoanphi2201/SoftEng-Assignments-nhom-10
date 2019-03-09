import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PagerService} from '../shared/services/pager.service';
import {NouisliderModule} from 'ng2-nouislider';
import {MaterialModule} from '../app.module';
import {FormComponent} from './form/form.component';
import {ListComponent} from './list/list.component';
import {SharedModule} from '../shared/share.module';
import {ExamsRoutes} from './exams.routing';
import {ExamsComponent} from './exams.component';
import {ExamsService} from '../shared/services/exams.service';
import {SubjectsService} from '../shared/services/subjects.service';
import {PdfViewerModule} from 'ng2-pdf-viewer';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ExamsRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MaterialModule,
        SharedModule,
        PdfViewerModule,
    ],
    declarations: [
        ExamsComponent,
        FormComponent,
        ListComponent,
    ],
    providers: [
        ExamsService,
        PagerService,
        SubjectsService,
    ]
})

export class ExamsModule {}
