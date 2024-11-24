import bcrypt, { hash } from 'bcrypt';
export class Password {

    static async toHash(password: string) {
        try {
            const hash = await bcrypt.hash(password, 10);
            return hash;
        } catch (err) {
            console.log(err);

        }
    }

    static async compare( password : string , hashPassword: string ){
        try {
            return await bcrypt.compare( password , hashPassword );
        } catch (err) {
            console.log(err);
            return false;
            
        }
    }


}