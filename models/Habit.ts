import User from "./User";

export type HabitFrequency = "multi" | "once" | "sometimes";

export class Habit {
    private readonly _name: string;
    private _value: number;
    private _id: number;

    constructor(name: string, value?: number, id?: number) {
       this._name = name;

       if (value) {
           this._value = value;
       }
       else {
           this._value = 0
       }

       if (id) {
           this._id = id
       }
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

    setValueFromFrequency(frequency: HabitFrequency, user: User) {
        switch(frequency) {
            case "multi":
               this._value = user.defaultValues.multi;
               break;
            case "once":
                this._value = user.defaultValues.once;
                break;
            case "sometimes":
                this._value = user.defaultValues.sometimes;
                break;
            default:
                throw new Error(`Unrecognized frequency '${frequency}'`);
        }
    }
}