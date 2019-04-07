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
declare var $: any;

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

    onChangeNumOfQuestion() {
        if (this.currentExam.answers.length === 0) {
            this.currentExam.answers = new Array(this.simpleSlider);
            for (let i = 0; i < this.simpleSlider; i++) {
                this.currentExam.answers[i] = {
                    number: i + 1,
                    value: ''
                };
            }
        }
        if (this.currentExam.answers.length > 0) {
            if (this.currentExam.answers.length < this.simpleSlider) {
                for (let i = this.currentExam.answers.length; i < this.simpleSlider; i++) {
                    this.currentExam.answers.push({
                        number: i + 1,
                        value: ''
                    });
                }
            } else {
                this.currentExam.answers = this.currentExam.answers.slice(0, this.simpleSlider);
            }
        }
        console.log(this.currentExam.answers);
    }

    /*--------------------------------------------------------------
    | onSubmitExam(id: string = '') id === '' => edit && id !== '' => add
    ----------------------------------------------------------------*/
    onSubmitExam(id: string = '') {
        if (this.currentExam._id) {
            id = this.currentExam._id;
        }
        if (this.formExam.valid) {
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
            // Create form data to post exam
            let formData: FormData = new FormData();
            formData.append('id', id);
            formData.append('name', this.currentExam.name);
            formData.append('slug', this.currentExam.slug);
            formData.append('ordering', this.currentExam.ordering.toString());
            formData.append('price', this.currentExam.price.toString());
            formData.append('status', this.currentExam.status);
            formData.append('special', this.currentExam.special);
            formData.append('subject_id', this.currentExam.subject.id);
            this.subjects.forEach((subj) => {
                if (subj._id === this.currentExam.subject.id) {
                    formData.append('subject_name', subj.name);
                }
            })
            formData.append('level', this.currentExam.level);
            formData.append('rates', this.currentExam.rates.toString());
            formData.append('time', this.currentExam.time.toString());
            formData.append('content', this.currentExam.content);
            formData.append('onlineExam', this.currentExam.isOnlineExam ? 'online' : 'offline');
            formData.append('answers', JSON.stringify(this.currentExam.answers));
            if (this.currentExam.isOnlineExam) {
                formData.append('starttime', this.currentExam.timeStart.toString());
            }
            formData.append('modified', JSON.stringify(modified));
            formData.append('created', JSON.stringify(created));
            let flagSubmit = true;
            if (id === '') { // Add
                if (this.selectedExamPdf === null) {
                    flagSubmit = false;
                    showAlert('warning',
                        'Select Exam PDF To Upload' ,
                        'Click to continue !',
                        false,
                        'btn btn-warning');
                } else {
                    formData.append('exam_pdf', this.selectedExamPdf, this.selectedExamPdf.name);
                }
                if (this.selectedThumb === null) {
                    flagSubmit = false;
                    showAlert('warning',
                        'Select Thumb To Upload' ,
                        'Click to continue !',
                        false,
                        'btn btn-warning');
                } else {
                    formData.append('thumb', this.selectedThumb, this.selectedThumb.name);
                }
            } else {
                const exam = this.formExam.value;
                formData.append('imageOld', exam.imageOld);
                if (this.selectedThumb !== null) {
                    formData.append('thumb', this.selectedThumb, this.selectedThumb.name);
                }
                formData.append('pdfOld', exam.pdfOld);
                if (this.selectedExamPdf !== null) {
                    formData.append('exam_pdf', this.selectedExamPdf, this.selectedExamPdf.name);
                }
            }
            if (this.currentExam.answers && this.currentExam.answers.length > 0) {
                this.currentExam.answers.forEach(item => {
                    if (item.value === '') {
                        flagSubmit = false;
                        showAlert('warning',
                            'Enter full answer' ,
                            'Click to continue !',
                            false,
                            'btn btn-warning');
                        return;
                    }
                });
            }
            if (flagSubmit) {
                this.ngProgress.start();
                this._examService.saveUser(formData)
                    .subscribe(
                        data => {
                            console.log(data);
                            this._examService.setSubmitedExam(data);
                        },
                        error => this.reloadPageIfError(),
                        () => {
                            this.ngProgress.done();
                            showAlert('success',
                                'Success' ,
                                'Click to continue !',
                                false,
                                'btn btn-success');
                            $('#noticeModal').modal('hide');
                            return;
                        });
            }
        } else {
            validateAllFormFields(this.formExam);
        }
    }

    onChangeThumb(e) {
        this.selectedThumb = e.target.files[0];
    }

    onChangeExamPdf(e) {
        this.selectedExamPdf = e.target.files[0];
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
