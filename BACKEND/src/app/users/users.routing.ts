import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

export const UsersRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: '',
            component: UsersComponent,
        }]
    }
];
