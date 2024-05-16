export function nextId(startingId: number, dataBase: unknown[]): string {
  return `${startingId + dataBase.length + 1}`;
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
