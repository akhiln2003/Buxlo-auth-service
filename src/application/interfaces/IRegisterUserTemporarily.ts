export interface IRegisterUserTemporarilyProps {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}
export interface IRegisterUserTemporarily {
  execute(user: IRegisterUserTemporarilyProps): Promise<string | void>;
}
