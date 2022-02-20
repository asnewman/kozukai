class PasswordReset {
    get expirationTimestamp(): number {
        return this._expirationTimestamp;
    }
    get code(): string {
        return this._code;
    }
    get email(): string {
        return this._email;
    }

    private readonly _email: string;
    private readonly _code: string;
    private readonly _expirationTimestamp: number;

    constructor(email: string, code: string, expirationTimestamp: number) {
        this._email = email;
        this._code = code;
        this._expirationTimestamp = expirationTimestamp;
    }
}

export default PasswordReset;