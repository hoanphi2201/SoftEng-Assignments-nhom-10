import { Routes } from '@angular/router';
import {GroupsComponent} from './groups.component';


export const GroupsRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: '',
            component: GroupsComponent
        }]
    }
];
