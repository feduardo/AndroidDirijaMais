import { useAuthStore } from '../../presentation/state/authStore';

let logoutHandler: (() => void) | null = null;

export const registerLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export const forceLogout = async () => {
  if (logoutHandler) {
    await logoutHandler();
  }
};
