import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    appFont: 'Arial',
    editorFont: 'Consolas',
  }),

  persist: true,

  getters: {
    getAppFont: (state) => state.appFont,
    getEditorFont: (state) => state.editorFont
  },

  actions: {
    setAppFont(font: string){
      this.appFont = font
    },
    setEditorFont(font: string){
      this.editorFont = font
    }
  }
  
})