export class User {
    constructor(
        public id : string ,
        public name : string , 
        public email : string ,
        public password : string , 
        public isAdmin : boolean ,
        public avatar : string ,
        public isBlocked: boolean,
        public role?: 'user' | 'mentor'

    ){}
}