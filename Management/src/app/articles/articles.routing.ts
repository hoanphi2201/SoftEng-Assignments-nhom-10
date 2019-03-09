import { Routes } from '@angular/router';

import { ArticlesComponent } from './articles.component';

export const ArticlesRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: '',
            component: ArticlesComponent
        }]
    }
];
