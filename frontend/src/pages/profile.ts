import { ProfileController, HeaderController } from '@/controllers';

function initProfilePage(): void {
  const headerController = new HeaderController();
  headerController.init();

  const profileController = new ProfileController();
  profileController.init().catch(error => {
    console.error('Failed to initialize profile:', error);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfilePage);
} else {
  initProfilePage();
}
