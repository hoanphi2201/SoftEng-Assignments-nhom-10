import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IUser} from '../shared/defines/user';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']

})
export class UsersComponent implements OnInit {
    userLogin: any;
    @ViewChild('closemodal') closemodal: ElementRef;
    constructor(private _authenticationService: AuthenticationService) {}
    ngOnInit(): void {
        this.userLogin = {
            local: {
                username: 'phihoan2201'
            },
            _id: '5c750dbd95033604111f2c08'
        };
    }

}