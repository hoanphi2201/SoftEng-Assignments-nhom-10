import { NgModule } from '@angular/core';
import {AvatarPipe} from './pipes/avatar.pipe';
import {CapitalizePipe} from './pipes/capitalize.pipe';
import { CommonModule } from '@angular/common';
import {FieldErrorDisplayComponent} from './field-error-display/field-error-display.component';
import {HoverDirective} from './directives/hover.directive';
import {PaginationComponent} from './pagination/pagination.component';
import {FileValueAccessor} from './directives/file-control-value-accessor';
import {FileUtil} from './helper/file.util';
import {CKEditorModule} from 'ng2-ckeditor';
import {NgProgressModule} from 'ngx-progressbar';
import {AuthenticationService} from './services/authentication.service';
@NgModule({
    imports: [
        CommonModule,
        CKEditorModule,
        NgProgressModule

    ],
    declarations: [
        AvatarPipe,
        CapitalizePipe,
        FieldErrorDisplayComponent,
        HoverDirective,
        PaginationComponent,
        FileValueAccessor,
    ],
    exports: [
        AvatarPipe,
        CapitalizePipe,
        FieldErrorDisplayComponent,
        HoverDirective,
        PaginationComponent,
        FileValueAccessor,
        CKEditorModule,
        NgProgressModule
    ],
    providers: [
        FileUtil,
        AuthenticationService
    ]

})
export class SharedModule { }

