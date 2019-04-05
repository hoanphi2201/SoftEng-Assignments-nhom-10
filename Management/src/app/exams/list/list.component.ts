import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagerService } from './../../shared/services/pager.service';
import { showNotification, showAlert, SwalConfirm } from './../../shared/helper/notification';

import { ExamsService } from '../../shared/services/exams.service';
import { IExam } from '../../shared/defines/exam';
import { ISubject } from '../../shared/defines/subject';
import { SubjectsService } from '../../shared/services/subjects.service';
import { FileUtil } from '../../shared/helper/file.util';
import { Constants } from '../../shared/helper/test.constants';
import { dynamicSort } from '../../shared/helper/config';

declare const $: any;
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Time } from '@angular/common';

@Component({
    selector: 'exams-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
    constructor(
        private _examService: ExamsService,
        private pagerService: PagerService,
        private _fileUtil: FileUtil,
        private _subjectService: SubjectsService,
        private router: Router,
        public ngProgress: NgProgress) {
    }
    ngOnInit(): void {
    }

}
