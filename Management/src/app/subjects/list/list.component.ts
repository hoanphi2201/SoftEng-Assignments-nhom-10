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
        this.ngProgress.done();

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

    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.allItems.length, page, +this.tablesLength);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
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