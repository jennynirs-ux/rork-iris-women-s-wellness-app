import crypto from 'crypto';

export async function sha256(message: string): Promise<string> {
  return crypto.createHash('sha256').update(message).digest('hex');
}
