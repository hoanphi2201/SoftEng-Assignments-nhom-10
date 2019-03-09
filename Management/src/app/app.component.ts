import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    constructor() {}

    ngOnInit() {
        $.material.init();
    }
}
