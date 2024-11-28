import JWT from 'jsonwebtoken';
import { User } from '../../domin/entities/User';
import { ItokenService } from '../../domin/interfaces/ItokenService';


export class JwtService implements ItokenService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;

    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET as string,
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string
    }
    generateAccessToken( user: Pick< User , 'id' | 'email'>):string{
        const payload = {
            id: user.id,
            email: user.email,

        }
        const options = {
            expiresIn: '1m'
        }
        return JWT.sign(payload,this.accessTokenSecret , options)
    }

    generateRefreshToken( user : Pick< User , 'id' | 'email' > ): string{
        return JWT.sign({id:user.id , email:user.email}, this.refreshTokenSecret , { expiresIn:'7d'})
    }

    verifyRefreshToken( token: string ): any{
        return JWT.verify(token , this.refreshTokenSecret)
    }
}