import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {ExamsService} from '../../shared/services/exams.service';
import {ISubject} from '../../shared/defines/subject';
import {SubjectsService} from '../../shared/services/subjects.service';
import {ckeConfig, validateAllFormFields, getSlug} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import {IExam} from '../../shared/defines/exam';

@Component({
    selector: 'exams-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],

})
export class FormComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private _examService: ExamsService,
        private _subjectService: SubjectsService,
        private router: Router,
        public ngProgress: NgProgress) {
    }
    ngOnInit(): void {
    }

}
