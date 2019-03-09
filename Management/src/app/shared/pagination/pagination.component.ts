import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-pagination-helper',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
    pager: any = {};
    @Input() set setPager(pager: any) {
        if (pager) {
            this.pager = pager;
        }
    }
    @Output('onClickSetPage') onClickSetPage = new EventEmitter<number>();
    setPage(page: number) {
        this.onClickSetPage.emit(page);
    }
}
