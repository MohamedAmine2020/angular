export class CompleteProfileStep<T> {

    title: string;
    isValid: boolean;
    data: T;

    constructor(title: string, isValid: boolean, data: T) {
        this.title = title;
        this.isValid = isValid;
        this.data = data;
    }


}
