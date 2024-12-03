export class User {
    constructor(
        public name : string , 
        public email : string ,
        public password : string , 
        public role : string,
        public avatar? : string ,
        public isAdmin : boolean = false ,
        public isBlocked: boolean = false,
        public id? : string ,

    ){}
}