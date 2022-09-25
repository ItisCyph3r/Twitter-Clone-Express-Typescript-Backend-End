export interface IUser{
    userName: string;
    displayName?: string;
    googleId?: string;
    githubId?: string;
    displayPicture?: string;
}

export interface IMongoDBUser{
    userName: string;
    googleId?: string;
    githubId?: string;
    displayPicture?: string;
    __v: number;
    _id: string;
}