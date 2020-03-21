import { Profile } from "passport";

const users: Profile[] = [];

const findUserById = (userId: string): Profile | null => {
  return users.find(user => user.id === userId);
};

const addOrUpdateUser = (user: Profile): Profile | undefined => {
  if (!user) throw new Error("User can not be null or undefined");
  if (user.id && findUserById(user.id)) {
    //upsert
    return findUserById(user.id);
  }
  users.push(user);
  return user;
};

export default { findUserById, addOrUpdateUser };
