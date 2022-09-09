export interface IUser{
    username: String;
    displayName?: String;
    googleId?: String;
    githubId?: String;
    displayPicture?: String;
}

export interface IMongoDBUser{
    username: String;
    googleId?: String;
    githubId?: String;
    displayPicture?: String;
    __v: number;
    _id: string;
}