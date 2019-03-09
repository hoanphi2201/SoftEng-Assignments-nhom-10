import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {IUser} from '../shared/defines/user';
import {AuthenticationService} from '../shared/services/authentication.service';
import {showNotification, SwalConfirm} from '../shared/helper/notification';
import {Router} from '@angular/router';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard'
    }, {
    path: '/calendar',
    title: 'Calendar',
    type: 'link',
    icontype: 'date_range'
    }, {
        path: '',
        title: 'Users',
        type: 'sub',
        icontype: 'folder_shared',
        collapse: 'users',
        children: [
            {path: 'users', title: 'User List', ab: 'U'},
            {path: 'groups', title: 'Group List', ab: 'G'},
        ]
    },{
        path: '',
        title: 'Exams',
        type: 'sub',
        icontype: 'content_paste',
        collapse: 'exams',
        children: [
            {path: 'exams', title: 'Exam List', ab: 'E'},
            {path: 'subjects', title: 'Subject List', ab: 'S'},
        ]
    },{
        path: '',
        title: 'Articles',
        type: 'sub',
        icontype: 'fiber_new',
        collapse: 'articles',
        children: [
            {path: 'articles', title: 'Article List', ab: 'A'},
            {path: 'categories', title: 'Category List', ab: 'C'},
        ]
    },{
        path: '/maps',
        title: 'Maps',
        type: 'sub',
        icontype: 'place',
        collapse: 'maps',
        children: [
            {path: 'vector', title: 'Vector Map', ab: 'VM'}
        ]
    },{
        path: '/charts',
        title: 'Charts',
        type: 'link',
        icontype: 'timeline'

    },{
        path: '/pages',
        title: 'Pages',
        type: 'sub',
        icontype: 'image',
        collapse: 'pages',
        children: [
            {path: 'pricing', title: 'Pricing', ab: 'P'},
            {path: 'timeline', title: 'Timeline Page', ab: 'TP'},
            {path: 'login', title: 'Login Page', ab: 'LP'},
            {path: 'register', title: 'Register Page', ab: 'RP'},
            {path: 'lock', title: 'Lock Screen Page', ab: 'LSP'},
            {path: 'user', title: 'User Page', ab: 'UP'}
        ]
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    systemAdmin: any = null;
    public menuItems: any[];
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    constructor(private _authenticationService: AuthenticationService,
                private router: Router) {}
    ngOnInit() {
        /* -------------------------------------
        | Todo: Authen get current user login
        --------------------------------------*/
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
    onLogout() {
        /* -------------------------------------
        | Todo: Authen logout
        --------------------------------------*/
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
}
