import swal from "sweetalert2";
declare const $: any;
function showAlert(type, title: string, text: string, buttonsStyling: boolean = false, confirmButtonClass: string) {
    swal({
        type: type,
        title: title,
        text: text,
        buttonsStyling: buttonsStyling,
        confirmButtonClass: confirmButtonClass
    }).catch(swal.noop);
}
function showNotification(from: any, align: any, timer: number, message) {
    const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    const color = Math.floor((Math.random() * 6) + 1);
    $.notify({
        icon: 'notifications',
        message: message
    }, {
        type: type[color],
        timer: timer,
        placement: {
            from: from,
            align: align
        }
    });
}
let objSwal:any = {
    title: 'Thông báo',
    html: 'Mạng xã hội học tập trực tuyến',
    width: null,
    footer: null,
    type: '',
    textConfirm: 'Yes, Do it',
    textCancel: 'Cancel',
    timer: null,
    showCloseButton: false,
    showCancelButton: true,
    focusCancel: false,
    showConfirmButton: true,
    allowOutsideClick: true,
    cancelButtonClass: 'btn ',
    confirmButtonClass: 'btn ',
};
function ResetSwalDefault() {
    objSwal.title = 'Thông báo';
    objSwal.html = 'Mạng xã hội học tập trực tuyến';
    objSwal.width = null;
    objSwal.footer = null;
    objSwal.type = '';
    objSwal.textConfirm = 'Yes, Do it';
    objSwal.textCancel = 'Cancel';
    objSwal.timer = null;
    objSwal.showCloseButton = false;
    objSwal.showCancelButton = true;
    objSwal.focusCancel = false;
    objSwal.showConfirmButton = true;
    objSwal.allowOutsideClick = true;

}
function SwalMain(objSwal, FuncConfirm) {
    swal({
        title: objSwal.title,
        html: objSwal.html,
        width: objSwal.width,
        type: objSwal.type,
        confirmButtonText: objSwal.textConfirm,
        cancelButtonText: objSwal.textCancel,
        timer: objSwal.timer,
        showCloseButton: objSwal.showCloseButton,
        showCancelButton: objSwal.showCancelButton,
        focusCancel: objSwal.focusCancel,
        showConfirmButton: objSwal.showConfirmButton,
        allowOutsideClick: objSwal.allowOutsideClick,
        confirmButtonColor: '#11111',
        cancelButtonClass: 'btn btn-default',
        confirmButtonClass: 'btn btn-success'
    }).then((result) => {
        if (result) {
            FuncConfirm();
        }
    }).catch(swal.noop);;
}

// Alert có nút Comfirm AlertConfirm
function SwalConfirm(html, FuncConfirm, title, width = '', type = '', textConfirm = '', cancelButtonClass =  '', confirmButtonClass = '') {
    ResetSwalDefault();
    objSwal.html = html;
    objSwal.title = (title === '') ? 'Thông báo' : title;
    objSwal.width = (width === '') ? null : width;
    objSwal.type = (type === '') ? 'question' : type;
    objSwal.cancelButtonClass = (cancelButtonClass === '') ?
        objSwal.cancelButtonClass + ' btn-danger' : objSwal.cancelButtonClass + cancelButtonClass;
    objSwal.confirmButtonClass = (confirmButtonClass === '') ?
        objSwal.confirmButtonClass +  ' btn-success' : objSwal.confirmButtonClass  + confirmButtonClass;
    objSwal.type = (type === '') ? 'question' : type;
    objSwal.textConfirm = (textConfirm === '') ? 'Ok' : textConfirm;
    objSwal.allowOutsideClick = false;
    SwalMain(objSwal, FuncConfirm);
}


export {
    SwalConfirm,
    showAlert,
    showNotification
}


