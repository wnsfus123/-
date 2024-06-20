import {create} from 'zustand';

const useUserStore = create((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));

export default useUserStore;
