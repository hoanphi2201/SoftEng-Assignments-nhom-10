import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SwalConfirm} from '../../shared/helper/notification';
import {CategoriesService} from '../../shared/services/categories.service';
import {ckeConfig, validateAllFormFields, getSlug} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
@Component({
    selector: 'categories-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    ckeConfig: any;
    formAddCategory: FormGroup;
    slug: string = '';
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    @Input('userLogin') userLogin: any;
    constructor(
        private _formBuilder: FormBuilder,
        private _categoryService: CategoriesService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;

    }
    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }
    displayFieldCss(form: FormGroup, field: string, autoField: boolean = false) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field),

        };
    }
    onSubmitCategory(id: string = '') {
        if (this.formAddCategory.valid) {
            const category = this.formAddCategory.value;
            category.id = id;
            category.modified = {
                user_id: this.userLogin._id,
                user_name: this.userLogin.local.username,
                time: Date.now()
            }

        } else {
            validateAllFormFields(this.formAddCategory);
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