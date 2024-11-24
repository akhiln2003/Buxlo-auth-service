import { IServer } from '@/domine/interfaces/IServer';
import { userRoutes } from '@/presentation/routes/userAuthRouts';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { createServer } from 'http'
import path from 'path';
export class ExpressWebServer implements IServer {
    private app: Application;
    private server: any;

    constructor() {
        this.app = express();
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        

        this.server = createServer(this.app)
    }


    registerRoutes(path: string, router: any): void {        
        this.app.use(path, router);
    }
    async start(port: number): Promise<void> {
        return new Promise(res => {
            this.server.listen(port, () => {
                console.log(`App listening on port ===> http://localhost:${port}/`);
                res()
            })
        })
    }


    async close(): Promise<void> {
        if (this.server) {
            return new Promise((resolve, reject) => {
                this.server.close((err: any) => {
                    if (err) {
                        console.error('Error closing', err);
                        return reject(err);
                    }
                    console.log('Server closed');
                    resolve();
                })
            })
        }
    }
}