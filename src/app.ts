import { IServer } from "./domin/interfaces/IServer";
import { connectDB, disconnectDB } from "./infrastructure/database/mongodb/connection";
import { redisClientInstance } from "./infrastructure/database/redis/connection";
import { userRoutes } from "./presentation/routes/userAuthRouts";

export class App{
    constructor(private server:IServer) {};

    async initialize():Promise<void>{
        this.registerRoutes()
        await this.connectDB();

    }

    private registerRoutes():void{        
        this.server.registerRoutes('/api/user' , userRoutes);
    }

    async start(port: number):Promise<void>{
        await this.server.start(port)
    }

    async shutdown():Promise<void>{
        await disconnectDB();
        console.log("Shut dow server");
        
    }
    private async connectDB() {
        try {
            await connectDB();
            await redisClientInstance.connect();
        } catch (error) {
            console.log('Server could not be started', error);
            process.exit(1);
        }
    }
}





export default App