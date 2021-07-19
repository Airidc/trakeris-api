import { v4 as uuid } from "uuid";
import { getConnection } from "typeorm";
import { User } from "../entity/user.entity";

export async function saveUser(
  userData: any,
  salt: string,
  hashedPassword: string
): Promise<User> {
  const userRepo = getConnection().getRepository(User);
  const generatedId = uuid();
  const status = await userRepo.save({
    id: generatedId,
    username: userData.username,
    passwordHash: hashedPassword,
    salt: salt,
    email: userData.email,
    createdAt: Date.now() + "",
    userRole: userData.role || "user",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    currency: userData.currency,
  });

  return status;
}

export async function getUser(userData: any): Promise<User | undefined> {
  const connection = getConnection();
  const user = await connection
    .getRepository(User)
    .findOneOrFail({ username: userData.username });

  return user;
}

export async function updateUser(userData: User): Promise<User> {
  const userRepo = getConnection().getRepository(User);
  return await userRepo.save(userData);
}
