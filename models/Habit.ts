export type HabitFrequency = "multi" | "once" | "sometimes";

export class Habit {
    private readonly _name: string;
    private _value: number;

    constructor(name: string, value?: number) {
       this._name = name;

       if (value) {
           this._value = value;
       }
       else {
           this._value = 0
       }
    }

    get value(): number {
        return this._value;
    }
    get name(): string {
        return this._name;
    }

    setValueFromFrequency(frequency: HabitFrequency) {
        switch(frequency) {
            case "multi":
               this._value = 2;
               break;
            case "once":
                this._value = 5;
                break;
            case "sometimes":
                this._value = 8;
                break;
            default:
                throw new Error(`Unrecognized frequency '${frequency}'`);
        }
    }
}