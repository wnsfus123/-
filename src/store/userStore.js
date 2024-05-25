// src/store/userStore.js
import create from 'zustand';

const useUserStore = create(set => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo })
}));

export default useUserStore;
