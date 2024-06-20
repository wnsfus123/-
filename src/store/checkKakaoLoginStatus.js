import create from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(persist(
  (set) => ({
    userInfo: null,
    setUserInfo: (userInfo) => set({ userInfo }),
    clearUserInfo: () => set({ userInfo: null })
  }),
  {
    name: 'user-storage', // 세션 스토리지에 저장될 이름
    getStorage: () => sessionStorage, // 기본값은 localStorage
  }
));

export default useUserStore;
