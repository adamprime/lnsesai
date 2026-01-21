// Admin authorization utilities

export const ADMIN_EMAILS = [
  "adam@tervort.org",
  "charles.thomas809@gmail.com",
  "jfboyce57@gmail.com",
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
