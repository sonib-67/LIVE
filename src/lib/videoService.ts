import { collection, doc, setDoc, getDocs, getDoc, query, where, deleteDoc, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { M3u8Video, VideoInvite, VideoAccess } from '../types/video';

export const videoService = {
  // === Videos ===
  async addVideo(title: string, m3u8Url: string): Promise<M3u8Video> {
    const videoRef = collection(db, 'videos');
    const newVideo = {
      title,
      m3u8Url,
      createdAt: Date.now()
    };
    const docRef = await addDoc(videoRef, newVideo);
    return { id: docRef.id, ...newVideo };
  },

  async getVideos(): Promise<M3u8Video[]> {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as M3u8Video));
  },

  async deleteVideo(videoId: string): Promise<void> {
    await deleteDoc(doc(db, 'videos', videoId));
    // Optionally we could delete related invites and access records,
    // but ignoring for now for simplicity, or just keep them orphaned
  },

  // === Invites ===
  async generateInvite(videoId: string): Promise<VideoInvite> {
    const inviteRef = collection(db, 'videoInvites');
    const inviteToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newInvite = {
      videoId,
      status: 'unused' as const,
      createdAt: Date.now()
    };
    // use inviteToken as doc id for fast lookup
    await setDoc(doc(db, 'videoInvites', inviteToken), newInvite);
    return { id: inviteToken, ...newInvite };
  },

  async getLatestUnusedInvite(videoId: string): Promise<VideoInvite | null> {
    const q = query(
      collection(db, 'videoInvites'), 
      where('videoId', '==', videoId),
      where('status', '==', 'unused')
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    // return first found unused
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as VideoInvite;
  },

  async getInviteById(inviteId: string): Promise<VideoInvite | null> {
    const docRef = doc(db, 'videoInvites', inviteId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as VideoInvite;
  },

  // === User Access ===
  async consumeInvite(
    inviteId: string, 
    videoId: string, 
    videoTitle: string, 
    m3u8Url: string, 
    userName: string, 
    userEmail: string, 
    userPhone: string
  ): Promise<VideoAccess> {
    // Check if invite is already used
    const invite = await this.getInviteById(inviteId);
    if (!invite || invite.status === 'used') {
      throw new Error('This invite link is invalid or has already been used.');
    }

    // Generate unique access ID
    const accessId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const newAccess: Omit<VideoAccess, 'id'> = {
      videoId,
      videoTitle,
      m3u8Url,
      userName,
      userEmail,
      userPhone,
      viewsLimit: 20,
      viewsCount: 0,
      isActive: true,
      createdAt: Date.now()
    };

    // Save Access
    await setDoc(doc(db, 'videoAccess', accessId), newAccess);

    // Update Invite as used
    await updateDoc(doc(db, 'videoInvites', inviteId), {
      status: 'used',
      usedByAccessId: accessId
    });

    // Auto-generate fresh invite for the video so admin always has one ready
    try {
      await this.generateInvite(videoId);
    } catch (e) {
      console.error('Failed to auto-generate fresh invite:', e);
    }

    return { id: accessId, ...newAccess };
  },

  async getAccessById(accessId: string): Promise<VideoAccess | null> {
    const docRef = doc(db, 'videoAccess', accessId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as VideoAccess;
  },

  async getAccessesByVideoId(videoId: string): Promise<VideoAccess[]> {
    const q = query(
      collection(db, 'videoAccess'), 
      where('videoId', '==', videoId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoAccess));
  },

  async deleteAccess(accessId: string): Promise<void> {
    await deleteDoc(doc(db, 'videoAccess', accessId));
  },

  async incrementViewCount(accessId: string, currentViews: number): Promise<void> {
    await updateDoc(doc(db, 'videoAccess', accessId), {
      viewsCount: currentViews + 1
    });
  }
};
