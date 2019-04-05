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
    loading: boolean = true;
    subjectSelect: string = 'allvalue';
    statusSelect: string = 'all';
    sortType: string = 'desc';
    sortField: string = 'name';
    keyword: string = '';
    exams: IExam[] = [];
    subjects: ISubject[];
    selectAll: boolean = false;

    statuses: any[] = [
        { value: 'active', viewValue: 'active' },
        { value: 'inactive', viewValue: 'inactive' },
    ];

    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10;
    private allItems: IExam[];
    pager: any = {};
    pagedItems: IExam[];


    @Input('userLogin') userLogin: any;
    constructor(
        private _examService: ExamsService,
        private pagerService: PagerService,
        private _fileUtil: FileUtil,
        private _subjectService: SubjectsService,
        private router: Router,
        public ngProgress: NgProgress) {
    }
    ngOnInit(): void {
        this.getItems(this.subjectSelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
        this.getSubject();
    }
    /*------------------------------------------------------------
    | Get exam subject: string status: string, sort_field: string, sort_type: string, keyword: string
    ---------------------------------------------------------------*/
    getItems(subject: string, status: string, sort_field: string, sort_type: string, keyword: string) {
        this.ngProgress.start();
        this.loading = true;
        /*-------------------------------
        | Todo: Get groups
        ---------------------------------*/
        this._examService.getItems(subject, status, sort_field, sort_type, keyword)
            .subscribe(
                data => {
                    this.allItems = data;
                    this.allItems.map((item) => {
                        item.selected = false;
                    });
                    showNotification('top', 'right', 1000, 'Have ' + this.allItems.length + ' exam(s)');
                },
                error => this.reloadPageIfError(),
                () => {
                    this.ngProgress.done();
                    this.loading = false;
                });
    }


    /*------------------------------------------------------------
    | Get subjects: string status: string, sort_field: string, sort_type: string, keyword: string
    ---------------------------------------------------------------*/
    getSubject() {
        this.ngProgress.start();
        /*-------------------------------
        | Todo: Get groups
        ---------------------------------*/
        this._subjectService.getItems('all', 'name', 'asc', '')
            .subscribe(
                data => {
                    this.subjects = data;
                },
                error => this.reloadPageIfError(),
                () => {
                    this.ngProgress.done();
                    this.loading = false;
                });
    }
    reloadPageIfError() {
        SwalConfirm('Click Ok to reload the page', () => {
            this.router.routeReuseStrategy.shouldReuseRoute = function () {
                return false;
            };
            const currentUrl = this.router.url + '?';
            this.router.navigateByUrl(currentUrl)
                .then(() => {
                    this.router.navigated = false;
                    this.router.navigate([this.router.url]);
                });
        }, 'Server Error !', '500px', 'warning');
    }
}
