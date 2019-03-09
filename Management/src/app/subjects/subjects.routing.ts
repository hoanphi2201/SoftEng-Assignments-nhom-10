import { Routes } from '@angular/router';
import {SubjectsComponent} from './subjects.component';


export const SubjectsRoutes: Routes = [
    {
        path: '',
        children: [ {
            path: '',
            component: SubjectsComponent
        }]
    }
];
