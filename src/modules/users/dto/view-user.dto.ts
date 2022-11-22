export class ViewUserDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: ViewBanUsersInfo;
}

export class ViewBanUsersInfo {
  isBanned: boolean = false;
  banDate: string = null;
  banReason: string = null;
}