import { AuthController } from '@/controllers';

function initAuthPage(): void {
  const authController = new AuthController();
  authController.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
  initAuthPage();
}
