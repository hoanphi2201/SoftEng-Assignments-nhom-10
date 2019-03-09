import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import {AuthGuard} from './shared/guards/auth.guard';

export const AppRoutes: Routes = [
        {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }, {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },{
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
            }
            , {
                path: 'users',
                loadChildren: './users/users.module#UsersModule',
            }, {
                path: 'groups',
                loadChildren: './groups/groups.module#GroupsModule',
            }, {
                path: 'exams',
                loadChildren: './exams/exams.module#ExamsModule',
            }, {
                path: 'subjects',
                loadChildren: './subjects/subjects.module#SubjectsModule',
            }, {
                path: 'articles',
                loadChildren: './articles/articles.module#ArticlesModule',
            }, {
                path: 'categories',
                loadChildren: './categories/categories.module#CategoriesModule',
            }, {
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule',
            }, {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule',
            }, {
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule',
            }, {
                path: '',
                loadChildren: './userpage/user.module#UserModule',
            }, {
                path: '',
                loadChildren: './timeline/timeline.module#TimelineModule',
            }, {
                path: '**',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]}
        ]
    }
];
