import { Constant } from '../../common/constant';
export class LastChat {

  public friendId: string;
  public userName: string;
  public email: string;
  public birthday: string;
  public gender: string;
  public avatar = '';

  public id: string;
  public messageId: string;
  public fromUserId: string;
  public toUserId: string;
  public time: number;
  public readTime: string;
  public messageType: string;
  public value: string;

  public timeDate: Date;
  public unreadNumber: number;
  public avatarSrc = Constant.DEFAULT_AVATAR;

}
