import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = await bcrypt.hash(password, salt);

  return { salt, hashedPassword };
}
