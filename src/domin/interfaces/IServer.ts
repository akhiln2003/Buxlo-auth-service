export interface IServer{
    start(port: number): Promise<void>;
    close():Promise<void>;
    registerRoutes(path: string , router: any ) : void;
}