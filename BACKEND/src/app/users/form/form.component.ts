import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IValidators} from '../../shared/validators/validators.class';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {IUser} from '../../shared/defines/user';
import {GroupsService} from '../../shared/services/groups.service';
import {UsersService} from '../../shared/services/users.service';
import {IGroup} from '../../shared/defines/group';
import {ckeConfig, validateAllFormFields} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';

@Component({
    selector: 'users-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],

})
export class FormComponent implements OnInit {
    ckeConfig: any;
    formAddUser: FormGroup;
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    groups: IGroup[] = [];
    @Input('userLogin') userLogin: any;
    @ViewChild('clearfileinput') clearfileinput: ElementRef;
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UsersService,
        private _groupService: GroupsService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;

    }
    /*--------------------------------------------------------------
    | Get groups status: string, sort_field: string, sort_type: string, keyword: string
    ----------------------------------------------------------------*/
    /*--------------------------------------------------------------
    | isFieldValid(form: FormGroup, field: string) touched && !valid
    ----------------------------------------------------------------*/
    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }
    /*--------------------------------------------------------------
   | displayFieldCss(form: FormGroup, field: string)
   ----------------------------------------------------------------*/
    displayFieldCss(form: FormGroup, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field),
        };
    }

    /*--------------------------------------------------------------
    | onSubmitUser(id: string = '') id === '' => edit && id !== '' => add
    ----------------------------------------------------------------*/
    onSubmitUser(id: string = '') {
        if (this.formAddUser.valid) {
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
        } else {
            validateAllFormFields(this.formAddUser);
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




