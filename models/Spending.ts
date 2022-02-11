class Spending {
    private readonly _name: string;
    private readonly _value: number;

    constructor(name: string, value: number) {
        this._name = name;
        this._value = value
    }

    get name(): string {
        return this._name;
    }
    get value(): number {
        return this._value;
    }
}

export default Spending
