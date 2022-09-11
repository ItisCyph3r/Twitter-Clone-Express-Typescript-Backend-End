export interface IUser{
    username: string;
    displayName?: string;
    googleId?: string;
    githubId?: string;
    displayPicture?: string;
}

export interface IMongoDBUser{
    username: string;
    googleId?: string;
    githubId?: string;
    displayPicture?: string;
    __v: number;
    _id: string;
}