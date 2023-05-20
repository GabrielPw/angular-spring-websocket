export class Client{
    
  private photoUrl:string = '';

    constructor(private name:string, private sessionId:string){}

    getName():String{

        return this.name;
    }
    
    getSessionId():String{

        return this.sessionId;
    }

    getPhotoUrl():String{

      return this.photoUrl;
    }


    setName(name: string) {
      this.name = name; 
    }

    setSessionId(sessionId: string) {
        this.sessionId = sessionId; 
    }

    setPhotoUrl(photoUrl:string){
      this.photoUrl = photoUrl;
    }
}