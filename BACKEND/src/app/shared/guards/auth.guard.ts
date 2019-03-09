import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs/Observable';
import {showNotification, SwalConfirm} from '../helper/notification';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _routerService: Router,
                private _authenticationService: AuthenticationService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let message = 'Bạn cần đăng nhập để thực hiện bước tiếp theo !';
        return true;
    }
}