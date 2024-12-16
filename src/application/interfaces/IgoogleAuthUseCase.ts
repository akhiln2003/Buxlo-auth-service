import { IotpVerificationResponse } from "./Iotp";

export interface IgoogleAuthUseCase {
    execute( token: string , role: string ):Promise<IotpVerificationResponse>;
}
