import {Buffer} from 'buffer';

export const decode = (...input: string[]) =>
  Buffer.from(input.join(), 'base64').toString('utf-8');
