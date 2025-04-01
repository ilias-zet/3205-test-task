export interface DB_Link {
  id: string;
  original_url: string;
  expires_at: string;
  created_at: string;
}

export interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  href: string;
}

export type Timer = ReturnType<typeof setTimeout>;

export interface Analytics {
  lastClickedBy: { ip: string, date: string }[];
  clickCount: number;
}
