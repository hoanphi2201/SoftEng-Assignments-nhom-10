import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {ExamsService} from '../../shared/services/exams.service';
import {ISubject} from '../../shared/defines/subject';
import {SubjectsService} from '../../shared/services/subjects.service';
import {ckeConfig, validateAllFormFields, getSlug} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import {IExam} from '../../shared/defines/exam';

@Component({
    selector: 'exams-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],

})
export class FormComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private _examService: ExamsService,
        private _subjectService: SubjectsService,
        private router: Router,
        public ngProgress: NgProgress) {
    }
    @ViewChild('clearfileinputThumb') clearfileinputThumb: ElementRef;
    listAnswer: any[] = [];
    @Input() set seletedExam(seletedExam: IExam) {
        if (seletedExam) {
            this.currentExam = seletedExam;
            console.log(this.currentExam);
            if (this.clearfileinputThumb) {
                this.clearfileinputThumb.nativeElement.click();
            }
            this.simpleSlider = this.currentExam.answers.length;
        }
    }

    ckeConfig: any;
    selectedThumb: File = null;
    selectedExamPdf: File = null;
    formExam: FormGroup;
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    specials: any[] = [
        {value: 'active', viewValue: 'Top Post'},
        {value: 'inactive', viewValue: 'Normal'},
    ];
    levels: any[] = [
        {value: 'dễ', viewValue: 'dễ'},
        {value: 'trung bình', viewValue: 'trung bình'},
        {value: 'khó', viewValue: 'khó'},
    ];
    rates: any[] = [
        {value: 1, viewValue: '1 Star'},
        {value: 2, viewValue: '2 Star'},
        {value: 3, viewValue: '3 Star'},
        {value: 4, viewValue: '4 Star'},
        {value: 5, viewValue: '5 Star'},
    ];
    subjects: ISubject[] = [];
    simpleSlider: any = 0;
    isOnlineExam = false;
    @Input('userLogin') userLogin: any;

    currentExam: IExam;

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;
        this.getSubjects();
        this.formExam = this._formBuilder.group({
            name: ['', [Validators.required]],
            slug: ['', [Validators.required]],
            ordering: ['', [Validators.required]],
            price: ['', [Validators.required]],
            thumb: [''],
            exam_pdf: [''],
            status: ['', [Validators.required]],
            special: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            level: ['', [Validators.required]],
            rate: ['', [Validators.required]],
            time: ['', [Validators.required]],
            timeStart: [''],
            content: ['', [Validators.required]],
            onlineExam: [''],
            isOnlineExam: ['', [Validators.required]],
            number_questions: ['', [Validators.required]],
            answer: [''],
            imageOld: [''],
            pdfOld: ['']
        });
    }

    /*--------------------------------------------------------------
    | Get subjects status: string, sort_field: string, sort_type: string, keyword: string
    ----------------------------------------------------------------*/
    getSubjects() {
        /*-------------------------------
      | Todo: Get subject
      ---------------------------------*/
        this._subjectService.getItems('all', 'name', 'asc', '')
            .subscribe(
                data => {
                    this.subjects = data;
                },
                error => this.reloadPageIfError(),
                () => {
                });
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
