import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ISubject} from '../shared/defines/subject';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {

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