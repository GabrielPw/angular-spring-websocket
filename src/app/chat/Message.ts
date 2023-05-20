enum Type{

    System,
    Chat
}

export class Message{

    constructor(public content:string, public clientName:string, public actualTime:Date){}

}