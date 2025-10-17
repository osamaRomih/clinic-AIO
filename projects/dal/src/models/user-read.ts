export interface IUserRead {
  id: string;
  firstName: string;
  lastName?: string;
  userName: string;
  phoneNumber?: string;
  isLocked:boolean,
  isDisabled:boolean,
  email: string;
  roles: string[];
}
