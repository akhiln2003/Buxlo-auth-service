export interface IServer {
  start(port: number): Promise<void>;
  close(): Promise<void>;
  registerRoutes(path: string, router: unknown): void;
  registerErrorHandler(middleware: unknown): void;
}
