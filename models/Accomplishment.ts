const MILLISECONDS_IN_DAY = 86400000
const MILLISECONDS_IN_HOUR = 3600000
const MILLISECONDS_IN_MINUTE = 60000

class Accomplishment {
    private readonly _timestamp: number;
    private readonly _value: number;
    private readonly _name: string;

    constructor(name: string, value: number, timestamp: number) {
        this._name = name;
        this._value = value;
        this._timestamp = timestamp;
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

    getSince() {
        const curr = Date.now();
        const difference = curr - this._timestamp;

        if (difference < MILLISECONDS_IN_MINUTE) {
            return "< 1 minute ago"
        }
        else if (difference < MILLISECONDS_IN_HOUR) {
            const minutes = Math.floor(difference / MILLISECONDS_IN_MINUTE)

            if (minutes === 1) {
                return "1 minute ago"
            }

            return `${minutes} minutes ago`
        }
        else if (difference < MILLISECONDS_IN_DAY) {
            const hours = Math.floor(difference / MILLISECONDS_IN_HOUR)

            if (hours === 1) {
                return "1 hour ago"
            }

            return `${hours} hours ago`
        }
        else {
            const days = Math.floor(difference / MILLISECONDS_IN_DAY)

            if (days === 1) {
                return "1 day ago"
            }

            return `${days} days ago`
        }
    }
}

export default Accomplishment