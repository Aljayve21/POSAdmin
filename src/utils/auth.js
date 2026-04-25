const ADMIN_AUTH_KEY = "pos_admin_auth";

export function getAdminSession() {
  const raw = localStorage.getItem(ADMIN_AUTH_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    return null;
  }
}

export function setAdminSession(session) {
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(session));
}

export function updateAdminSessionUser(user) {
  const session = getAdminSession();

  if (!session) return;

  setAdminSession({
    ...session,
    user: {
      ...session.user,
      ...user,
    },
  });
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}
