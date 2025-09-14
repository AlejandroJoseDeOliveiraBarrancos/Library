export interface IUser {
  id: string;
  username: string;
  createdAt: Date;
  points: IPoint[];
  toJSON(): IUserData;
}

export interface IPoint {
  number: number;
  datetime: Date;
  toJSON(): IPointData;
}

export interface IUserData {
  id: string;
  username: string;
  createdAt: string;
  points: IPointData[];
}

export interface IPointData {
  number: number;
  datetime: string;
}

export interface IResult<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

export interface ICommandHandler {
  (args: string[]): void;
}

export interface IUserRepository {
  create(username: string): IUser;
  findByUsername(username: string): IUser | null;
  findById(id: string): IUser | null;
  findAll(): IUser[];
  update(id: string, newUsername: string): IUser;
  delete(id: string): boolean;
  deleteByUsername(username: string): boolean;
  count(): number;
  clear(): void;
  addPoints(username: string, points: number): IUser;
  updatePoint(username: string, pointIndex: number, newPoints: number): IUser;
  deletePoint(username: string, pointIndex: number): IUser;
}

export interface IUserService {
  createUser(username: string): IResult<IUser>;
  getAllUsers(): IResult<IUser[]>;
  getUserByUsername(username: string): IResult<IUser>;
  updateUser(currentUsername: string, newUsername: string): IResult<IUser>;
  deleteUser(username: string): IResult<void>;
  getUserCount(): IResult<number>;
  clearAllUsers(): IResult<void>;
  addPoints(username: string, points: number): IResult<IUser>;
  updatePoint(username: string, pointIndex: number, newPoints: number): IResult<IUser>;
  deletePoint(username: string, pointIndex: number): IResult<IUser>;
}
