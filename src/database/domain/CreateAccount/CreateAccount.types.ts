export interface CreateAccountType{
    name : string;
    email : string;
    password : string;
    about_us : string;
    interest_category : string
}

export interface SigninAccountType{
    email : string;
    password : string
}