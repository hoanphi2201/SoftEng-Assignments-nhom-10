import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ICategory} from '../shared/defines/category';
import {AuthenticationService} from '../shared/services/authentication.service';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
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