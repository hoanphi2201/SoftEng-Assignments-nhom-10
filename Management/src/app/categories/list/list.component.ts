import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagerService} from './../../shared/services/pager.service';
import {showNotification, showAlert, SwalConfirm} from './../../shared/helper/notification';

import {ICategory} from '../../shared/defines/category';
import {CategoriesService} from '../../shared/services/categories.service';
import {dynamicSort} from '../../shared/helper/config';

declare const $: any;
import swal from "sweetalert2";
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
@Component({
    selector: 'categories-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
    pagedItems: any[] = [
        {
            "created": {
                "user_id": "admin",
                "user_name": "admin",
                "time": "2019-02-17T16:55:07.109Z"
            },
            "modified": {
                "user_id": "admin",
                "user_name": "admin",
                "time": "2019-02-24T14:53:27.996Z"
            },
            "_id": "5c6991ebf8457e1034314369",
            "name": "HoanPhi77 2312",
            "ordering": 1,
            "status": "inactive",
            "slug": "hoanphi77-2312"
        }
    ];
    loading: boolean = false;
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
        private _categoryService: CategoriesService,
        private pagerService: PagerService,
        private router: Router,
        public ngProgress: NgProgress) {}
    ngOnInit(): void {
        this.getItems(this.statusSelect, this.sortField, this.sortType, this.keyword);
    }
    /*------------------------------------------------------------------------------
    | Get categories status: string, sort_field: string, sort_type: string, keyword: string
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