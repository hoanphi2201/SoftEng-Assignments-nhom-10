import {Directive, Input, ElementRef, HostListener, HostBinding} from '@angular/core';
@Directive({
    selector: '[appHover]'
})
export class HoverDirective {
    constructor(private el: ElementRef) { }
    @HostBinding('class.is-hovering') isHovering: boolean = false;
    @HostListener('mouseenter') onMouseEnter() {
        this.isHovering = true;
    }
    @HostListener('mouseleave') onMouseLeave() {
        this.isHovering = false;
    }
}