import mongoose from "mongoose";

interface AuthAttr {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isPremium?: boolean;
}

interface AuthDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isGoogle: boolean;
  role: "user" | "mentor";
  isPremium?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Model with a custom build method
interface AuthModel extends mongoose.Model<AuthDoc> {
  build(attributes: AuthAttr): AuthDoc;
}

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isGoogle: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "mentor"],
    },
    isPremium: {
      type: Boolean,
    },
  },
  {
    toJSON: {
      transform(_: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
    timestamps: true,
  }
);

// Attach the `build` method to the schema's static methods
authSchema.statics.build = (attrs: AuthAttr) => {
  return new Auth(attrs); // Return a new Auth instance
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", authSchema);

export { Auth };
