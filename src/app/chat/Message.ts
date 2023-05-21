import { MessageTypeEnum } from "./MessageTypeEnum";

export class Message{

    constructor(public content:string, public clientName:string, public actualTime:Date, type:MessageTypeEnum){}

}