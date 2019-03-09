import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params} from '@angular/router';
import {showAlert} from '../shared/helper/notification';
import {UsersService} from '../shared/services/users.service';
import {IUser} from '../shared/defines/user';

@Component({
    selector: 'app-user-cmp',
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    errorMessage: string;
    userDetail: IUser = null;
    constructor(private _activatedRouteService: ActivatedRoute,
                private _userService: UsersService) {}
    ngOnInit(): void {
        this.subscription = this._activatedRouteService.params.subscribe(
            (params: Params) => {
                this._userService.getUserById(params['id']).subscribe(
                    (data: any) 	=> {
                        this.userDetail = data;
                    }

                );
            },
            (error: any) =>  {
                showAlert('warning',
                    `Server Error !`,
                    'Click to contunue !',
                    false,
                    'btn btn-warning');
                this.errorMessage = <any>error;
            }
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
