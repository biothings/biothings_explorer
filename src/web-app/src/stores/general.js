import { defineStore } from "pinia";

export const useMainStore = defineStore({
  id: "general",
  state: () => ({
    loading: false,
  }),
  getters: {
    
  },
  actions: {
    setLoading(v) {
      this.loading = v;
    },
  },
});
