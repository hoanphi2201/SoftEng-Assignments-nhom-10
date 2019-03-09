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
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    private formLogin: FormGroup;
    returnUrl: string;
    error: string = '';
    public auth2: any;
    constructor(private element: ElementRef,
                private _formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService ) {
            this.nativeElement = element.nativeElement;
            this.sidebarVisible = false;
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        let navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
        // FORM
        this.formLogin = this._formBuilder.group({
            'username' : ['', [
                Validators.required,
                // Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')
            ]],
            'password' : ['', [
                Validators.required
            ]]
        });



        (window as any).fbAsyncInit = function() {
            FB.init({
                appId      : AppSettings.FACEBOOK_APP_ID,
                cookie     : true,
                xfbml      : true,
                version    : 'v3.2'
            });
            FB.AppEvents.logPageView();
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    onLogin() {
        if (this.formLogin.dirty && this.formLogin.valid) {
            this.authenticationService.login(this.formLogin.value.username, this.formLogin.value.password).subscribe(
                (user: any) => {
                    if (user) {
                        if (user.error) {
                            this.error = user.error.message;
                        } else if (user.status === 200) {
                            showNotification('top', 'right', 300, `Welcome ${ user.name} `);
                            this.router.navigate([this.returnUrl]);
                        }

                    }
                }
            );
        } else {
            this.validateAllFormFields(this.formLogin);
        }
    }
    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }
    displayFieldCss(form: FormGroup, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field)
        };
    }
    // trường hợp cố ý bỏ disable
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    onLoginWithFB(): void {
        FB.login((response) => {
            if (response.authResponse) {
                FB.api('/me', {fields: 'name, email, first_name, last_name'}, (res) => {
                        if (res && !res.error) {
                            console.log(res);
                            const data = Object.assign(res, response.authResponse);
                            this.authenticationService.loginFacebook(data).subscribe(
                                (user: any) => {
                                    localStorage.setItem('accessToken', response.authResponse.accessToken);
                                    showNotification('top', 'right', 300, `Xin chào ${user.name} `);
                                    this.router.navigate([this.returnUrl]);
                                }
                            );
                        }
                    }
                );
            } else {
                showNotification('top', 'right', 300, `Rất tiếc, đã xảy ra lỗi !`);
            }
        });
    }
    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: AppSettings.GOOGLE_CLIENT_ID,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
            this.attachSignin(document.getElementById('googleBtn'));
        });
    }
    public attachSignin(element) {
        this.auth2.attachClickHandler(element, {},
            (googleUser) => {
                const profile = googleUser.getBasicProfile();
                const data =  {
                    name: profile.getName(),
                    email: profile.getEmail(),
                    first_name:  profile.getFamilyName(),
                    last_name: profile.getGivenName(),
                    accessToken: googleUser.getAuthResponse().id_token,
                    id: profile.getId(),
                    avatar: profile.getImageUrl()
                };
                this.authenticationService.loginGoogle(data).subscribe(
                    (user: any) => {
                        showNotification('top', 'right', 300, `Xin chào ${user.name} `);
                        this.router.navigate([this.returnUrl]);
                    }
                );

            }, (error) => {
                showNotification('top', 'right', 300, `Rất tiếc, đã xảy ra lỗi !`);
            });
    }

    ngAfterViewInit() {
        this.googleInit();
    }

}
