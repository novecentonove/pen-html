import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    appFont: 'Arial',
    editorFont: 'Consolas',
    fontColor: '#fff',
  }),

  persist: true,

  getters: {
    getAppFont: (state) => state.appFont,
    getEditorFont: (state) => state.editorFont,
    getFontColor: (state) => state.fontColor
  },

  actions: {
    setAppFont(font: string){
      this.appFont = font
    },
    setEditorFont(font: string){
      this.editorFont = font
    },
    setFontColor(color: string){
      this.fontColor = color
    }
  }
  
})