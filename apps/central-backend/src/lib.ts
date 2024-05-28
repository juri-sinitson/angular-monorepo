// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function nextId(startingId: number, dataBase: unknown[]): string {
  return generateRandomCode();
}

export function generateRandomCode(): string {
  // Generate a random code using alphanumeric characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}
