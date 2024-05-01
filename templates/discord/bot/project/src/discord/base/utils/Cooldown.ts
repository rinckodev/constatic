import { time, TimestampStylesString } from "discord.js";

interface CooldownOptions {
    createdAt?: Date;
    defaultStyle?: TimestampStylesString;
}
const timeUnit = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24
};
type TimeUnit = typeof timeUnit;

export class Cooldown {
    private createdAtDate: Date;
    private defaultStyle: TimestampStylesString;
    private expiresAtDate: Date;
    constructor(options: CooldownOptions = {}){
        this.createdAtDate = options.createdAt ?? new Date();
        this.defaultStyle = options.defaultStyle ?? "R";
        this.expiresAtDate = new Date(this.createdAtDate);
    }
    public get createdAt(){
        return this.createdAtDate;
    }
    public get expiresAt(){
        return this.expiresAtDate;
    }
    display<Style extends TimestampStylesString>(style: Style){
        return time(new Date(), style);
    }
    toString(){
        return this.display(this.defaultStyle);
    }
    add(value: number, unit: keyof TimeUnit){
        const time = this.expiresAtDate.getMilliseconds();
        this.expiresAtDate.setMilliseconds(time + (value * timeUnit[unit]));
    }
    remove(value: number, unit: keyof TimeUnit){
        const time = this.expiresAtDate.getMilliseconds();
        this.expiresAtDate.setMilliseconds(time - (value * timeUnit[unit]));
    }
}