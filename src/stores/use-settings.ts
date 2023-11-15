import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    fontFamily: 'arial',
  }),

  getters: {
    getFont: (state) => state.fontFamily
  },

  actions: {
    setFont(font: string){
      this.fontFamily = font
    }
  }
  
})