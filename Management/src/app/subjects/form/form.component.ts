import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {SubjectsService} from '../../shared/services/subjects.service';
import {ckeConfig, getSlug, validateAllFormFields} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import { ISubject } from '../../shared/defines/subject';
declare var $: any;
@Component({
    selector: 'subjects-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    ckeConfig: any;
    formSubject: FormGroup;
    slug: string = '';

    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    @Input('userLogin') userLogin: any;
    @Input() selectedSubject: ISubject;
    @Input() edittingSubject: boolean;

    

    constructor(
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectsService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;
        this.formSubject = this._formBuilder.group({
            name: ["", [Validators.required]],
            slug: ["", [Validators.required]],
            ordering: ["", [Validators.required]],
            content: ["", [Validators.required]],
            status: ["", [Validators.required]]
        });
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

    @Output("onSubmit ") currentSubject = new EventEmitter<ISubject>();

    onSubmitSubject(id: string = '') {
        if (this.formSubject.valid) {
            const subject: ISubject = this.formSubject.value;
            subject._id = id;
            const copySubject = Object.assign({}, subject);
            this.currentSubject.emit(copySubject);
            console.log('this.currentSubject: ' + this.currentSubject);
            console.log("subject: " + subject);
        } else {
            validateAllFormFields(this.formSubject);
        }
        this.edittingSubject = false;
        
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