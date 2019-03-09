
import {PipeTransform, Pipe} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AppSettings} from '../helper/app.setting';

@Pipe({
    name: 'avatar'
})
export class AvatarPipe implements PipeTransform {
    private urlApi: string = `${AppSettings.API_ENDPOINT}/uploads`;
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(value, style = '', folder = '', defaultImg) {
        var regex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
        if ( value === undefined) {
            return this.sanitizer.bypassSecurityTrustHtml(`<img src="${this.urlApi + folder + defaultImg}" style="${style}">`);
        }else if (value.match(regex)) {
            return this.sanitizer.bypassSecurityTrustHtml(`<img src="${value}" style="${style}">`);
        } else {
            return this.sanitizer.bypassSecurityTrustHtml(`<img src="${this.urlApi + folder + value}" style="${style}">`);
        }
    }
}

