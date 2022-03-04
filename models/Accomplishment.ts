import TimeCalculator from "../services/TimeCalculator";

class Accomplishment {
    private readonly _timestamp: number;
    private readonly _value: number;
    private readonly _name: string;
    private readonly _id: number;

    constructor(name: string, value: number, timestamp: number, id?: number) {
        this._name = name;
        this._value = value;
        this._timestamp = timestamp;
        this._id = id;
    }

    get timestamp(): number {
        return this._timestamp;
    }
    get value(): number {
        return this._value;
    }
    get name(): string {
        return this._name;
    }
    get id(): number {
        return this._id;
    }

    getSince() {
        return TimeCalculator.getTimeSince(this.timestamp)
    }
}

export default Accomplishment