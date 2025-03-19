export const sanitizeUser = <T extends { password?: string }>(
  user: T,
): Omit<T, "password"> => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const sanitizeUsers = <T extends { password?: string }>(
  users: T[],
): Omit<T, "password">[] => {
  return users.map(sanitizeUser);
};
