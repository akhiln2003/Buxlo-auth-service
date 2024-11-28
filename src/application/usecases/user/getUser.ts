import { IuserRepository } from "../../../domin/interfaces/IuserRepository";
import { IgetUser } from "../../interfaces/IgetUser";


export class GetUser implements IgetUser {
    constructor(private userRepositary: IuserRepository) {}

    async execute({ email }: { email: string }): Promise<any> {
        return await this.userRepositary.findByEmail(email);
    }
}
