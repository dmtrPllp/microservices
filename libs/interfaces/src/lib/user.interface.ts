export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}

export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  password: string;
  role: UserRole;
  courses?: IUserCourses[];
}

export interface IUserCourses {
  _id?: string;
  courseId: string;
  purchaseState: PurchaseState;
}
