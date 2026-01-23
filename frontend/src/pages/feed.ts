import { FeedController, HeaderController } from '@/controllers';

function initFeedPage(): void {
  const headerController = new HeaderController();
  headerController.init();

  const feedController = new FeedController();
  feedController.init().catch(error => {
    console.error('Failed to initialize feed:', error);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeedPage);
} else {
  initFeedPage();
}
