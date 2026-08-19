export interface M3u8Video {
  id: string;
  title: string;
  m3u8Url: string;
  createdAt: number;
}

export interface VideoInvite {
  id: string;
  videoId: string;
  status: 'unused' | 'used';
  usedByAccessId?: string;
  createdAt: number;
}

export interface VideoAccess {
  id: string;
  videoId: string;
  videoTitle: string;
  m3u8Url: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  viewsLimit: number;
  viewsCount: number;
  isActive: boolean;
  createdAt: number;
}
