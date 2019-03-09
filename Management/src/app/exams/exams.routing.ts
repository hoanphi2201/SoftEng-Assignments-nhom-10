import { Routes } from '@angular/router';

import { ExamsComponent } from './exams.component';

export const ExamsRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: '',
            component: ExamsComponent
        }],
    }
];
