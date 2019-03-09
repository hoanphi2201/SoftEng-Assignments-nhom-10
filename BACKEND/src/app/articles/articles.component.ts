import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IArticle} from '../shared/defines/article';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.css']

})
export class ArticlesComponent implements OnInit {

    userLogin: any;
    @ViewChild('closemodal') closemodal: ElementRef;
    constructor() {}
    ngOnInit(): void {
        this.userLogin = {
            local: {
                username: 'phihoan2201'
            },
            _id: '5c750dbd95033604111f2c08'
        };
    }
}