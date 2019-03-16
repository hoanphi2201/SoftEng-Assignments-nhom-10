import {FormControl} from "@angular/forms";

export class IValidators {
    static answerValidator(answers: Array<string>) {
        return function (input: FormControl) {
            if (input.value) {
                return answers.includes(input.value) ? null : {answer: true};
            }
            return null;
        };
    }
    static imageSizeValidator(maxSize: number) {
        return function (input: FormControl) {
            if (input.value) {
                return input.value[0].size > maxSize ? {maxSize: true} : null;
            }
            return null;
        };
    }

    static imageExtensionValidator(whiteListImageExtension: Array<string>) {
        return function(input: FormControl) {
            if (input.value) {
                return whiteListImageExtension.includes(input.value[0].type) ? null : {extension: true};
            }
            return null;
        };
    }
    static imageDimensionValidator(imageMinHeight: number, imageMinWidth: number) {
        return function(input: FormControl) {
            return new Promise(resolve => {
                if (input.value) {
                    const fr = new FileReader;
                    fr.onload = function () {
                        const image = new Image;
                        image.onload = function () {
                            if (image.width < imageMinWidth || image.height < imageMinHeight) {
                                return resolve({dimension: true});
                            }
                            return resolve(null);
                        };
                        image.src = (fr.result).toString();
                    };
                    fr.readAsDataURL(input.value[0]);
                } else {
                    return resolve(null);
                }
            });
        };
    }
}