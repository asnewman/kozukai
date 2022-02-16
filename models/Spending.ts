import TimeCalculator from "../services/TimeCalculator";

class Spending {
    private readonly _name: string;
    private readonly _value: number;
    private readonly _timestamp: number;

    constructor(name: string, value: number, timestamp: number) {
        this._name = name;
        this._value = value
        this._timestamp = timestamp;
    }

    get name(): string {
        return this._name;
    }
    get value(): number {
        return this._value;
    }
    get timestamp(): number {
        return this._timestamp;
    }

    getTimeSince() {
        return TimeCalculator.getTimeSince(this.timestamp)
    }
}

export default Spending
