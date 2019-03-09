import {Component, OnInit} from '@angular/core';
import {IExam} from '../shared/defines/exam';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
    selector: 'app-exams',
    templateUrl: './exams.component.html',
    styleUrls: ['./exams.component.css']

})
export class ExamsComponent implements OnInit {

    userLogin: any;
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