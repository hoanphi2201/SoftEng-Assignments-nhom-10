import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FixedPluginComponent } from './fixed-plugin.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [
        FixedPluginComponent ,
    ],
    exports: [ FixedPluginComponent ]
})
export class FixedPluginModule {}
