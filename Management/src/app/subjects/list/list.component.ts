import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagerService} from './../../shared/services/pager.service';
import {showNotification, showAlert, SwalConfirm} from './../../shared/helper/notification';


import {ISubject} from '../../shared/defines/subject';
import {SubjectsService} from '../../shared/services/subjects.service';
import {dynamicSort} from '../../shared/helper/config';

declare const $: any;
import swal from "sweetalert2";
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
@Component({
    selector: 'subjects-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
    loading: boolean = false;
    pagedItems: ISubject [] = [];
    subjects: ISubject [] = [];
    statusSelect: string = 'all';
    sortType: string = 'asc';
    sortField: string = 'name';
    keyword: string = '';
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    pager: any = {};
    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10; private allItems: ISubject[];
    currentNumberSubjectOnPage: number = this.tablesLength;
    selectAll: boolean = false;
    @Input('userLogin') userLogin: any;

    constructor(
        private _subjectService: SubjectsService,
        private pagerService: PagerService,
        private router: Router,
        public ngProgress: NgProgress) {}
    ngOnInit(): void {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
        this.getSubject();
    }
    /*------------------------------------------------------------------------------
    | Get subjects status: string, sort_field: string, sort_type: string, keyword: string
    --------------------------------------------------------------------------------*/
    getItems(status: string, sort_field: string, sort_type: string, keyword: string) {
        this.ngProgress.start();
        // this.ngProgress.done();

        this.loading  = true;
        this._subjectService.getItems(status, sort_field, sort_type, keyword)
            .subscribe(
                data => {
                    this.allItems = data;
                    showNotification('top', 'right', 1000, 'Have ' + this.allItems.length + ' subject(s)');
                    this.setPage(this.pager.currentPage);
                },
                error => this.reloadPageIfError(),
                () => {
                    this.ngProgress.done();
                    this.loading = false;
                });

    }

    getSubject() {
        this.ngProgress.start();
        /*-------------------------------
        | Todo: Get groups
        ---------------------------------*/
        this._subjectService.getItems('all', 'name', 'asc', '').subscribe(data => {
            this.subjects = data;
        },
            error => this.reloadPageIfError(),
            () => {
                this.ngProgress.done();
                this.loading = false;
            }
        );

    }


    filterSubjects() {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
    }

    sortSubjectsBy(sortField) {
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
        this.sortField = sortField;
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
        setTimeout(() => {
            this.selectAll = false;
        }, 1000);
    }

    displaySortBy(sortField) {

        if (this.sortField === sortField) {
            return this.sortType === 'asc' ? 'fa-sort-asc' : 'fa-sort-desc';
        }
        return '';
    }

    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.allItems.length, page, +this.tablesLength);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onClickSetPage(e) {
        this.setPage(e);
        this.currentNumberSubjectOnPage = e;
    }


    onChangeDataTableLength() {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
    }

    changeStatus(id: string, status: string) {
        this.ngProgress.start();
        this.loading = true;
        const objSubject: any = {
            status: status,
            modified: {
                user_id: 'admin',
                user_name: 'admin',
                time: Date.now()
            }
        };
        this._subjectService.changeStatus(id, objSubject).subscribe(
            data => {
                this.pagedItems.map((subject, i) => {
                    if (subject._id === id) {
                        this.pagedItems[i].status = this.pagedItems[i].status === 'active' ? 'inactive' : 'active';
                    }
                });
            },
            error => this.reloadPageIfError(),
            () => {
                this.ngProgress.done();
                this.loading = false;
            }
        );
    }

    checkAllItem() {
        this.allItems.forEach(item => {
            item.selected = this.selectAll;
        });
    }

    selectedItems: ISubject [] = [];

    clickOnChangeMulti(state) {

        this.allItems.forEach(item => {
            if (item.selected) {
                this.selectedItems.push(item);
            }
        });

        if (this.selectedItems.length === 0) {
            showAlert('warning', 'please choosen an subject', 'click to back in list', false, 'btn btn-warn');
        } else {
            this.ngProgress.start();
            this.loading = true;
            const objUpdate: any = {
                action: state,
                items: this.selectedItems,
                modified: {
                    user_id: 'admin',
                    user_name: 'admin',
                    time: Date.now()
                }
            };

            this._subjectService.clickOnChangeMulti(objUpdate)
                .subscribe(
                    data => {
                        this.allItems.map(item => {
                            if (item.selected) {
                                item.status = state;
                            }
                            item.selected = false;
                        });
                    },
                    error => this.reloadPageIfError(),
                    () => {
                        this.ngProgress.done();
                        this.loading = false;
                        this.selectAll = false;
                    }
                );
        }
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