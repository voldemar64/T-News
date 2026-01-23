import { SearchController, HeaderController } from '@/controllers';

function initSearchPage(): void {
  const headerController = new HeaderController();
  headerController.init();

  const searchController = new SearchController();
  searchController.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchPage);
} else {
  initSearchPage();
}
