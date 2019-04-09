import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
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
export class ListComponent implements OnInit, OnChanges {
    loading: boolean = false;
    subjectSelect: string = 'allvalue';
    statusSelect: string = 'all';
    sortType: string = 'asc';
    sortField: string = 'name';
    keyword: string = '';
    subjects: ISubject[];
    statuses: any[] = [
        { value: 'active', viewValue: 'active' },
        { value: 'inactive', viewValue: 'inactive' },
    ];
    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10; private allItems: ISubject[];
    currentNumberSubjectOnPage = this.tablesLength;
    pager: any = {};
    pagedItems: ISubject[];
    selectAll: boolean = false;
    @Input('userLogin') userLogin: any;

    @Input('currentSubject') currentSubject: ISubject;

    constructor(
        private _subjectService: SubjectsService,
        private pagerService: PagerService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.currentSubject !== undefined) {

            const objSubject: any = {
                name: this.currentSubject.name,
                content: this.currentSubject.content,
                slug: this.currentSubject.slug,
                id: '',
                ordering: this.currentSubject.ordering,
                status: this.currentSubject.status,

                modified: {
                    user_id: 'duykypaul',
                    user_name: 'duykypaul',
                    time: Date.now()
                },

                created: {
                    user_id: 'duykypaul',
                    user_name: 'duykypaul',
                    time: Date.now()
                }
            };

            // this._subjectService.deleteSubject(this.currentSubject._id).subscribe(_ => {
            //     this.pagedItems = this.pagedItems.filter(eachSubject => eachSubject._id !== this.currentSubject._id);
            // });

            let isAdd = true;
            this.allItems.map(value => {
                if (value._id === this.currentSubject._id) {
                    console.log('this.currentSubject._id: ' + this.currentSubject._id);
                    isAdd = false;
                    value.status = objSubject.status;
                    value.name = objSubject.name;
                    value.slug = objSubject.slug;
                    value.ordering = objSubject.ordering;
                    value.content = objSubject.content;
                    objSubject.id = value._id;
                    this._subjectService.addSubject(objSubject).subscribe(
                        insertedSubject => {},
                        error => this.reloadPageIfError(),
                        () => {
                            showAlert('success',
                                'Success' ,
                                'Click to continue !',
                                false,
                                'btn btn-success');
                            $('#noticeModal').modal('hide');
                            return;
                        });
                }
            });
            if (isAdd) {
                this._subjectService.addSubject(objSubject).subscribe(
                    insertedSubject => {
                        this.pagedItems.push(insertedSubject);
                    },
                    error => this.reloadPageIfError(),
                    () => {
                        showAlert('success',
                            'Success' ,
                            'Click to continue !',
                            false,
                            'btn btn-success');
                        $('#noticeModal').modal('hide');
                        return;
                    });
            }
        }
    }
    ngOnInit(): void {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
        this.getSubject();
    }
    /*------------------------------------------------------------------------------
    | Get subjects status: string, sort_field: string, sort_type: string, keyword: string
    --------------------------------------------------------------------------------*/
    getItems(status: string, sort_field: string, sort_type: string, keyword: string) {
        // this.ngProgress.start();
        // this.loading  = true;
        this._subjectService.getItems(status, sort_field, sort_type, keyword)
            .subscribe(
                data => {
                    this.allItems = data;
                    showNotification('top', 'right', 1000, 'Have ' + this.allItems.length + ' subject(s)');
                    this.setPage(this.pager.currentPage);
                    this.selectAll = false;
                },
                error => this.reloadPageIfError(),
                () => {
                    // this.ngProgress.done();
                    // this.loading = false;
                });

    }

    getSubject() {
        // this.ngProgress.start();
        // this.loading = true;
        /*-------------------------------
        | Todo: Get groups
        ---------------------------------*/
        this._subjectService.getItems('all', 'name', 'asc', '').subscribe(data => {
            this.subjects = data;
        },
            error => this.reloadPageIfError(),
            () => {
                // this.ngProgress.done();
                // this.loading = false;
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
        // this.ngProgress.start();
        // this.loading = true;
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
                // this.ngProgress.done();
                // this.loading = false;
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
            // this.ngProgress.start();
            // this.loading = true;
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
                        // this.ngProgress.done();
                        // this.loading = false;
                        this.selectAll = false;
                        this.selectedItems = [];
                    }
                );
        }
    }

    deleteSubject(id: string) {
        // this.ngProgress.start();
        // this.loading = true;
        this._subjectService.deleteSubject(id).subscribe(
            data => {
                // this.setPage(this.currentNumberSubjectOnPage);
                this.pagedItems = this.pagedItems.filter(item => item._id !== id);
            },
            error => this.reloadPageIfError(),
            () => {
                // this.ngProgress.done();
                // this.loading = false;
            }
        );
    }

    @Output('onEditSubject') editSubject = new EventEmitter<ISubject>();

    openForm(id: string) {
        let subject: ISubject = {
            name: null,
            status: null,
            slug: null,
            ordering: null,
            _id: null,
            content: null,
            created: {
                user_id: null,
                user_name: null,
                time: null
            },
            modified: {
                user_id: null,
                user_name: null,
                time: null
            }
        };
        this.allItems.forEach((value, index) => {
            if (value._id === id) {
                subject = value;
                return;
            }
        });
        // create copy object subject
        const copySubject = Object.assign({}, subject);
        this.editSubject.emit(copySubject);
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