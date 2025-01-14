export function generateOTP(length: number): string {
  const charset: string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");
}

export function getFirstAndLastName(name: string): {
  firstName: string;
  lastName: string;
} {
  const words = name.trim().split(/\s+/);
  const firstName = words[0];
  const lastName = words.slice(1).join(" ");
  return { firstName, lastName };
}
