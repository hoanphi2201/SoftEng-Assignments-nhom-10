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

    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
