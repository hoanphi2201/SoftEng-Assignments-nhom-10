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
                    this.selectAll = false;
                    this.allItems = data;
                    this.allItems.map((item) => {
                        item.selected = false;
                    });
                    showNotification('top', 'right', 1000, 'Have ' + this.allItems.length + ' exam(s)');
                    this.setPage(this.pager.currentPage);
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
    /*------------------------------------------------------------
   | Set up items display in paged
   ---------------------------------------------------------------*/
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.allItems.length, page, +this.tablesLength);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    /*------------------------------------------------------------
    | Click number pagination
    ---------------------------------------------------------------*/
    onClickSetPage(e) {
        this.setPage(e);
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

    /*------------------Thay đổi số exam trên 1 page---------------------*/
    onChangeDataTableLength() {
        this.getItems(this.subjectSelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
    }

    /*-----------------------Lọc, tìm kiếm----------------------------*/
    filterExams() {
        this.getItems(this.subjectSelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
    }

    /*------------------------SORT--------------------------*/
    sortExamsBy(sortField) {
        this.sortType = this.sortType == 'asc' ? 'desc' : 'asc';
        this.sortField = sortField;

        this.getItems(this.subjectSelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
    }

    displaySortType(sortField) {
        if (sortField == this.sortField)
            return this.sortType == 'asc' ? 'fa-sort-asc' : 'fa-sort-desc';
        return '';
    }

    changeStatus(id, status) {
        this.ngProgress.start();
        const objExam: any = {
            status: status,
            modified: {
                user_id: 'admin',
                user_name: 'admin',
                time: Date.now()
            }
        };
        this._examService.changeStatus(id, objExam)
            .subscribe(
                data => {
                    this.pagedItems.map(exam => {
                        if (exam._id === id) {
                            const newStatus = exam.status === 'active' ? 'inactive' : 'active';
                            exam.status = newStatus;
                            exam.modified = objExam.modified;
                        }
                    });
                },
                error => this.reloadPageIfError(),
                () => {
                    this.ngProgress.done();
                    showAlert('success', 'Change Status', 'Success',
                        false, 'btn btn-success');
                });
    }

    changeSpecial(id, special) {
        this.ngProgress.start();
        const objExam: any = {
            special: special,
            modified: {
                user_id: 'admin',
                user_name: 'admin',
                time: Date.now()
            }
        };
        this._examService.changeSpecial(id, objExam)
            .subscribe(
                data => {
                    this.pagedItems.map((exam, i) => {
                        if (exam._id === id) {
                            const newSpecial = this.pagedItems[i].special === 'active' ? 'inactive' : 'active';
                            exam.status = newSpecial;
                            exam.modified = objExam.modified;
                        }
                    });
                },
                error => this.reloadPageIfError(),
                () => {
                    this.ngProgress.done();
                    showAlert('success', 'Change Special', 'Success',
                        false, 'btn btn-success');
                });
    }

    /*--------------------------------------------*/
    clickOnChangeMulti(prop, state) {
        let arrIdUbdate = [];
        this.pagedItems.forEach((item) => {
            if (item.selected) {
                arrIdUbdate.push(item._id);
            }
        });

        if (arrIdUbdate.length === 0) {
            showAlert('warning', 'Please choosen an exam', 'Click to back in list',
                false, 'btn btn-warning');
        } else {
            this.ngProgress.start();
            const objUpdate: any = {
                action: state,
                items: arrIdUbdate,
                modified: {
                    user_id: 'admin',
                    user_name: 'admin',
                    time: Date.now()
                }
            };
            this._examService.changeMultiOnClick(objUpdate, prop)
                .subscribe(
                    data => {
                        this.allItems.map(item => {
                            if (prop === 'status' && item.selected)
                                item.status = state;
                            if (prop === 'special' && item.selected)
                                item.special = state;
                            item.selected = false;
                        });
                    },
                    error => this.reloadPageIfError(),
                    () => {
                        this.ngProgress.done();
                        showAlert('success', 'Change All Exam Selected', 'Success',
                            false, 'btn btn-success');
                        this.selectAll = false;
                    });
        }
    }

    /*---------------------------------------------------*/

    checkAllExams() {
        this.allItems.forEach(item => {
            item.selected = this.selectAll;
        });
    }

    @Output() sendExam = new EventEmitter<IExam>();
    openForm(id) {
        let exam: IExam = {
            name: null,
            status: null,
            special: null,
            ordering: null,
            content: null,
            thumb: null,
            exam_pdf: null,
            slug: null,
            level: null,
            rates: null,
            price: null,
            onlineExam: null,
            timeStart: null,
            answers: [],
            time: null,
            subject: {
                id: null,
                name: null
            },
            number_questions: null
        };
        this.allItems.forEach((value, index) => {
            if (value._id === id) {
                exam = value;
                return;
            }
        });
        // Create copy object exam
        const copyExam = Object.assign({}, exam);
        this.sendExam.emit(copyExam);
        let isAdd: boolean = true;
        this._examService.getSubmitedExam().subscribe(submitedExam => {
            this.allItems.map(value => {
                if (value._id === submitedExam._id) {
                    isAdd = false;
                    value.name = submitedExam.name;
                    value.status = submitedExam.status;
                    value.special = submitedExam.special;
                    value.number_questions = submitedExam.number_questions;
                    value.subject.name = submitedExam.subject.name;
                    value.modified.user_name = submitedExam.modified.user_name;
                    value.modified.time = submitedExam.modified.time;
                    return;
                }
            });
            if (isAdd) {
                this.allItems.push(submitedExam);
                if (this.pager.currentPage === this.pager.totalPages) {
                    this.pagedItems.push(submitedExam);
                }
            }
        });
    }
}
