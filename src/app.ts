import { IServer } from "./domine/interfaces/IServer";
import { userRoutes } from "./presentation/routes/userAuthRouts";

export class App{
    constructor(private server:IServer) {};

    async initialize():Promise<void>{
        this.registerRoutes()
    }

    private registerRoutes():void{        
        this.server.registerRoutes('/api/user' , userRoutes);
    }

    async start(port: number):Promise<void>{
        await this.server.start(port)
    }

    async shutdown():Promise<void>{
        console.log("Shut dow server");
        
    }
}





export default App