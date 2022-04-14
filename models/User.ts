interface DefaultValues {
    multi: number;
    once: number;
    sometimes: number;
}

class User {
    get defaultValues(): DefaultValues {
        return this._defaultValues;
    }
    get currencySymbol(): string {
        return this._currencySymbol;
    }
    get email(): string {
        return this._email;
    }
    get id(): string {
        return this._id;
    }
    private _email: string;
    private _currencySymbol: string;
    private _defaultValues: DefaultValues;
    private _id: string | null;

    constructor(email: string, currencySymbol: string, defaultValues: DefaultValues, id: string | null) {
        this._email = email;
        this._currencySymbol = currencySymbol;
        this._defaultValues = defaultValues;
        this._id = id;
    }
}

export default User;