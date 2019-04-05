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
    pagedItems: any [] = [];
    statusSelect: string = 'all';
    sortType: string = 'asc';
    sortField: string = 'name';
    keyword: string = '';
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10;
    @Input('userLogin') userLogin: any;
    constructor(
        private _subjectService: SubjectsService,
        private pagerService: PagerService,
        private router: Router,
        public ngProgress: NgProgress) {}
    ngOnInit(): void {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
    }
    /*------------------------------------------------------------------------------
    | Get subjects status: string, sort_field: string, sort_type: string, keyword: string
    --------------------------------------------------------------------------------*/
    getItems(status: string, sort_field: string, sort_type: string, keyword: string) {
        this.ngProgress.start();
        this.ngProgress.done();

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