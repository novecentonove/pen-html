import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    fontFamily: 'Consolas',
  }),

  persist: true,

  getters: {
    getFont: (state) => state.fontFamily
  },

  actions: {
    setFont(font: string){
      this.fontFamily = font
    }
  }
  
})