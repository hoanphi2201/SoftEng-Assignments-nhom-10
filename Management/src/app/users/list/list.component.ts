import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PagerService} from './../../shared/services/pager.service';
import {GroupsService} from '../../shared/services/groups.service';
import {showNotification, showAlert, SwalConfirm} from './../../shared/helper/notification';
import {IUser} from './../../shared/defines/user';
import {IGroup} from '../../shared/defines/group';
import {UsersService} from '../../shared/services/users.service';
import {dynamicSort} from '../../shared/helper/config';

declare const $: any;
import swal from "sweetalert2";
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import {AppSettings} from '../../shared/helper/app.setting';
@Component({
    selector: 'users-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
    pagedItems: any[] = [
        {
            "group": {
                "id": "5c1c8af38ee89776e4e1ce55",
                "name": "member"
            },
            "created": {
                "user_id": "5c1b962e1a76d71bda336304",
                "user_name": "phihoan2201",
                "time": "2019-02-25T12:25:10.900Z"
            },
            "modified": {
                "user_id": "5c1b962e1a76d71bda336304",
                "user_name": "phihoan2201",
                "time": "2019-02-25T12:25:10.900Z"
            },
            "_id": "5c73dea6e0d7492bda372e1b",
            "name": "21321321321",
            "email": "213213@gmail.com",
            "status": "active"
        }
    ]
    loading: boolean = false;
    groupSelect: string = 'allvalue';
    statusSelect: string = 'all';
    sortType: string = 'desc';
    sortField: string = 'name';
    keyword: string = '';
    groups: IGroup[] = [];
    statuses: any[] = [
        {value: 'active', viewValue: 'active'},
        {value: 'inactive', viewValue: 'inactive'},
    ];
    dataTablesLength: number[] = [5, 10, 20, 50, 100];
    tablesLength: number = 10;
    @Input('userLogin') userLogin: any;
    constructor(
        private _userService: UsersService,
        private pagerService: PagerService,
        private _groupService: GroupsService,
        private router: Router,
        public ngProgress: NgProgress) {}
    ngOnInit(): void {
        this.getItems(this.groupSelect, this.statusSelect, this.sortField, this.sortType, this.keyword);
        this.getGroups();
    }
    /*-------------------------------------------------------------
   | Get groups status: string, sort_field: string, sort_type: string, keyword: string
   ----------------------------------------------------------------*/
    getGroups() {
        this.ngProgress.start();
        this.ngProgress.done();
    }
    /*------------------------------------------------------------
   | Get user group: string status: string, sort_field: string, sort_type: string, keyword: string
   ---------------------------------------------------------------*/
    getItems(group: string, status: string, sort_field: string, sort_type: string, keyword: string) {
        this.ngProgress.start();
        this.ngProgress.done();
    }

    reloadPageIfError() {
        SwalConfirm('Click Ok to reload the page', () => {
            this.router.routeReuseStrategy.shouldReuseRoute = function () {
                return false;
            };
            const currentUrl = this.router.url + '?';
            this.router.navigateByUrl(currentUrl)
                .then(() => {
                    this.router.navigated = false;
                    this.router.navigate([this.router.url]);
                });
        }, 'Server Error !', '500px', 'warning');
    }
    createLinkImage(image: string, folder: string) {
        const regex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
        if (image === null) {
            return './assets/img/no-avatar.png';
        } else if (image.match(regex)) {
            return image;
        }
        return `${AppSettings.API_ENDPOINT}/${folder}/${image}`;
    }
}