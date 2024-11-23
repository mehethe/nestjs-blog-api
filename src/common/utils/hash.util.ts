import * as bcrypt from 'bcryptjs';

export const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(input, salt);
};

export const compareHash = async (
  input: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(input, hash);
};
