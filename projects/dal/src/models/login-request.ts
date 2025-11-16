export interface ILoginRequest {
    emailOrUsername:string;
    password:string;
}

export interface ILoginCreds{
    emailOrUsername:string;
    password:string;
}

export interface IRegisterCred{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userName: string;
    email: string;
    password: string;
}