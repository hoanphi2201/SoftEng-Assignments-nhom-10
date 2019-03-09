import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagerService} from './../../shared/services/pager.service';
import {ArticlesService} from '../../shared/services/articles.service';
import {ICategory} from '../../shared/defines/category';
import {CategoriesService} from '../../shared/services/categories.service';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import {SwalConfirm} from '../../shared/helper/notification';
@Component({
    selector: 'articles-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
    loading: boolean = false;
    categorySelect: string = 'allvalue';
    statusSelect: string = 'all';
    sortType: string = 'desc';
    sortField: string = 'name';
    keyword: string = '';
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10;
    categories: ICategory[] = [];
    @Input('userLogin') userLogin: any;
    constructor(
        private _articleService: ArticlesService,
        private pagerService: PagerService,
        private _categoryService: CategoriesService,
        private  router: Router,
        public ngProgress: NgProgress) {}
    ngOnInit(): void {
        this.getItems(this.categorySelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
        this.getCategories();
    }
    /*-------------------------------------------------------------
   | Get categories status: string, sort_field: string, sort_type: string, keyword: string
   ----------------------------------------------------------------*/
    getCategories() {
        /*------------------------------------
       |  Todo get items
       --------------------------------------*/

    }
    /*------------------------------------------------------------
   | Get article category: string status: string, sort_field: string, sort_type: string, keyword: string
   ---------------------------------------------------------------*/
    getItems(category: string, status: string, sort_field: string, sort_type: string, keyword: string) {
        this.ngProgress.start();
        /*------------------------------------
        |  Todo get items
        --------------------------------------*/
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