import mongoose from "mongoose";


interface AuthAttr {
    name: string;
    email: string;
    password: string;
    avatar?: string;

}

interface AuthDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    isBlocked: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

    // Mongoose Model with a custom build method
interface AuthModal extends mongoose.Model<AuthAttr> {
    build(attributes: AuthAttr): AuthDoc;
}


const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    toJSON:{
        transform(_,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v; 
            delete ret.password;
        }
    },
    timestamps:true
});
 
const Auth = mongoose.model< AuthDoc , AuthModal >("Auth" , authSchema);

authSchema.statics.build = ( attrs: AuthAttr )=>{
    return new Auth(attrs)
};



export{Auth}