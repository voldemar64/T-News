export function formatDate(
  dateString: string | undefined,
  locale: string = 'ru-RU'
): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'только что';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${pluralize(diffInMinutes, 'минута', 'минуты', 'минут')} назад`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${pluralize(diffInHours, 'час', 'часа', 'часов')} назад`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${pluralize(diffInDays, 'день', 'дня', 'дней')} назад`;
    }

    return formatDate(dateString);
  } catch {
    return '';
  }
}

export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return many;
  }

  if (mod10 === 1) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }

  return many;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function formatNumber(num: number, locale: string = 'ru-RU'): string {
  return num.toLocaleString(locale);
}

export function formatLikesCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatUsername(username: string): string {
  return `@${username}`;
}
