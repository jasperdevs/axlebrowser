export interface TabState {
  id: string;
  url: string;
  title: string;
  faviconUrl: string | null;
  isPinned: boolean;
  isLoading: boolean;
  lastAccessedAt: number;
  thumbnailDataUrl: string | null;
}

export interface NavigationState {
  url: string;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
}
