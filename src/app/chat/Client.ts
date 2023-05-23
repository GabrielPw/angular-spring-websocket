export class Client{
    
  constructor(private name:string, private sessionId:string, private urlPhoto:string){}

    getName():string{

        return this.name;
    }
    
    getSessionId():string{

        return this.sessionId;
    }

    getUrlPhoto():string{

      return this.urlPhoto;
    }


    setName(name: string) {
      this.name = name; 
    }

    setSessionId(sessionId: string) {
        this.sessionId = sessionId; 
    }

    setUrlPhoto(photoUrl:string){
      this.urlPhoto = photoUrl;
    }

    static fromJson(json: any): Client {
      const { name, sessionId, urlPhoto } = json;
      return new Client(name, sessionId, urlPhoto);
    }
}