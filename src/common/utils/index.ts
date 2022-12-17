import * as bcrypt from 'bcryptjs';

export function concatObject(obj: Object, separator: string = ', ') {
  return Object.keys(obj)
    .map(function(key, index) {
      return (obj as any)[key];
    })
    .join(separator);
}


export function getHashedPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 5);
}

export function checkPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}