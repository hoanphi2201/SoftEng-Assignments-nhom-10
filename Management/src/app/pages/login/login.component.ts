import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {showAlert, showNotification} from '../../shared/helper/notification';
import {AppSettings} from '../../shared/helper/app.setting';

declare var $: any;
declare var FB: any;
declare const gapi: any;
@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, AfterViewInit {

    constructor(private element: ElementRef,
                private _formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService ) {
    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
    }

}
