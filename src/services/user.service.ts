import { v4 as uuid } from "uuid";
import { getConnection } from "typeorm";
import { User } from "../entity/user.entity";
import { UserFields } from "../enums/userFields.enum";

export async function createUser(userData: any, salt: string, hashedPassword: string): Promise<User> {
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

export async function getUserBy(fieldName: UserFields, value: string): Promise<User | undefined> {
  const connection = getConnection();
  const searchCriteria = {
    where: {},
  };

  switch (fieldName) {
    case UserFields.Username: {
      searchCriteria.where = { username: value };
      break;
    }
    case UserFields.Email: {
      searchCriteria.where = { email: value };
      break;
    }
    case UserFields.Id: {
      searchCriteria.where = { id: value };
      break;
    }
    default: {
      searchCriteria.where = { username: value };
      break;
    }
  }

  const user = await connection.getRepository(User).findOneOrFail(searchCriteria);

  return user;
}

export async function updateUser(userData: User): Promise<User> {
  const userRepo = getConnection().getRepository(User);
  return await userRepo.save(userData);
}
