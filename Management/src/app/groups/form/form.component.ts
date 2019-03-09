import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {showAlert, SwalConfirm} from '../../shared/helper/notification';
import {IGroup} from '../../shared/defines/group';
import {GroupsService} from '../../shared/services/groups.service';
import {ckeConfig, validateAllFormFields} from '../../shared/helper/config';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
@Component({
    selector: 'groups-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    ckeConfig: any;
    formAddGroup: FormGroup;
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    group_acps: any[] = [
        {value: 'yes', viewValue: 'Yes'},
        {value: 'no', viewValue: 'No'},
    ];
    @Input('userLogin') userLogin: any;
    constructor(
        private _formBuilder: FormBuilder,
        private _groupService: GroupsService,
        private router: Router,
        public ngProgress: NgProgress) {}

    ngOnInit(): void {
        this.ckeConfig = ckeConfig;
    }

    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }
    displayFieldCss(form: FormGroup, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field),
        };
    }
    onSubmitGroup(id: string = '') {
        if (this.formAddGroup.valid) {
            const group = this.formAddGroup.value;
            group.id = id;
            group.modified = {
                user_id: this.userLogin._id,
                user_name: this.userLogin.local.username,
                time: Date.now()
            }
            group.created = {
                user_id: this.userLogin._id,
                user_name: this.userLogin.local.username,
                time: Date.now()
            }

        } else {
            validateAllFormFields(this.formAddGroup);
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