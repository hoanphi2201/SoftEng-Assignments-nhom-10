import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IGroup} from '../shared/defines/group';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
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