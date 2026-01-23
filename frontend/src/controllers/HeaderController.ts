import { HeaderView } from '@/views';
import { authService } from '@/services';
import { getUser, isAuthenticated } from '@/utils';
import { ROUTES } from '../config/constants';

export class HeaderController {
  private headerView: HeaderView;

  constructor() {
    this.headerView = new HeaderView({
      onSearch: this.handleSearch.bind(this),
      onLogout: this.handleLogout.bind(this),
    });
  }

  init(): void {
    this.headerView.init();
    this.render();
  }

  private render(): void {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        this.headerView.renderAuthenticated(user);
      }
    } else {
      this.headerView.renderUnauthenticated();
    }
  }

  private handleSearch(query: string): void {
    const searchParams = new URLSearchParams({ q: query });
    window.location.href = `${ROUTES.SEARCH}?${searchParams.toString()}`;
  }

  private handleLogout(): void {
    authService.logout();
    window.location.href = ROUTES.LOGIN;
  }

  getView(): HeaderView {
    return this.headerView;
  }
}
