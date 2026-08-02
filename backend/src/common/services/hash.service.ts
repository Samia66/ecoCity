import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {

  async hash(password: string): Promise<string> {
    return bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );
  }



  async compare(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
}