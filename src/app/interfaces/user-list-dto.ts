import { IUserRepoDetailDTO } from './user-repo-detail-dto';

export interface IUserListDTO {
    login?:string;
    repositoryList?:Array<IUserRepoDetailDTO>;
    url?:string;
    organizations_url?:string,
    btnValue?:string;
    isShowUserRepoDetail?:boolean;
    id ?: number;
}