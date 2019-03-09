import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IValidators} from '../../shared/validators/validators.class';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {ArticlesService} from '../../shared/services/articles.service';
import {ICategory} from '../../shared/defines/category';
import {IArticle} from '../../shared/defines/article';
import {CategoriesService} from '../../shared/services/categories.service';
import {ckeConfig, validateAllFormFields, getSlug} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';

@Component({
    selector: 'articles-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],

})
export class FormComponent implements OnInit {
    ckeConfig: any;
    selectedThumb: File = null;
    formAddArticle: FormGroup;
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    categories: ICategory[] = [];
    @ViewChild('clearfileinput') clearfileinput: ElementRef;
    @Input('userLogin') userLogin: any;
    constructor(
        private _formBuilder: FormBuilder,
        private _articleService: ArticlesService,
        private _categoryService: CategoriesService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;
        this.getCategories();
    }
    /*--------------------------------------------------------------
    | Get categorys status: string, sort_field: string, sort_type: string, keyword: string
    ----------------------------------------------------------------*/
    getCategories() {
        /*------------------------------------
        |  Todo get items
        --------------------------------------*/
    }
    /*--------------------------------------------------------------
    | isFieldValid(form: FormGroup, field: string) touched && !valid
    ----------------------------------------------------------------*/
    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }
    /*--------------------------------------------------------------
   | displayFieldCss(form: FormGroup, field: string)
   ----------------------------------------------------------------*/
    displayFieldCss(form: FormGroup, field: string, autoField: boolean = false) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field),
        };
    }

    /*--------------------------------------------------------------
    | onSubmitArticle(id: string = '') id === '' => edit && id !== '' => add
    ----------------------------------------------------------------*/
    onSubmitArticle(id: string = '') {
        if (this.formAddArticle.valid) {
            const modified = {
                user_id: this.userLogin._id,
                user_name: this.userLogin.local.username,
                time: Date.now()
            };
            const created = {
                user_id: this.userLogin._id,
                user_name: this.userLogin.local.username,
                time: Date.now()
            };
            /*------------------------------------
           |  Todo: Process Add and Edit
           --------------------------------------*/
        } else {
            validateAllFormFields(this.formAddArticle);
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