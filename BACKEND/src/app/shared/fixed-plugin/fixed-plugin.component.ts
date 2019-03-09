import { Component , Input, Output, EventEmitter} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-plugin',
    templateUrl: './fixed-plugin.component.html',
})
export class FixedPluginComponent {
    constructor() { }
    classShow: string = "";
    @Input('bgrColor') colorBgrSideBar: string;
    @Input('activeColor') colorActiveSideBar: string;
    @Input('imgSidebar') imgSideBar: string;
    @Input('isSideBarMini') isSideBarMini: boolean;
    arrImgSideBar: string[] = [ "./assets/img/sidebar-1.jpg"
        ,"./assets/img/sidebar-2.jpg"
        ,"./assets/img/sidebar-3.jpg"
        ,"./assets/img/sidebar-4.jpg"];

    arrColorActiveSideBar: any[] = ["purple", "green", "orange", "red"];
    arrBgrSidebar: string[] = ["white", "black", "red"];
    @Output('changeImage') changeImage = new EventEmitter();
    handleChangeImgSideBar($event){
        this.imgSideBar = $event.target.alt;
        this.changeImage.emit({value: this.imgSideBar});
    }
    @Output('changeActiveColor') changeActiveColorSideBar = new EventEmitter();
    handleChangeColorSideBar(color){
        this.colorActiveSideBar = color;
        this.changeActiveColorSideBar.emit({value: this.colorActiveSideBar});
    }
    @Output('changeBgrColor') changeBgrColorSideBar = new EventEmitter();
    handleChangeBgrSideBar(color){
        this.colorBgrSideBar = color;
        this.changeBgrColorSideBar.emit({value: this.colorBgrSideBar});
    }

}
