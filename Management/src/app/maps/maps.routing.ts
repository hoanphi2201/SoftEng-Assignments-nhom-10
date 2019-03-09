import { Routes } from '@angular/router';


import { VectorMapsComponent } from './vectormaps/vectormaps.component';

export const MapsRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'vector',
        component: VectorMapsComponent
        }]
    }
];
