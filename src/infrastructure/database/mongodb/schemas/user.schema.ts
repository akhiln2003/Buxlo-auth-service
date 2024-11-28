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
    isAdmin: boolean;
    isBlocked: boolean;
    role: 'user' | 'mentor';
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Model with a custom build method
interface AuthModel extends mongoose.Model<AuthDoc> {
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
    },
    role: {
        type: String,
        enum: ['user', 'mentor'],
        default: 'user',
    },
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    },
    timestamps: true
});

// Attach the `build` method to the schema's static methods
authSchema.statics.build = (attrs: AuthAttr) => {
    return new Auth(attrs); // Return a new Auth instance
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", authSchema);

export { Auth };