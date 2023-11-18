import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    appFont: 'Arial',
    editorFont: 'Consolas',
    fontColor: '#fff',
    editorFontSize: 16,
    basedir: '/home/dav/test'
  }),

  persist: true,

  getters: {
    getAppFont: (state) => state.appFont,
    getEditorFont: (state) => state.editorFont,
    getFontColor: (state) => state.fontColor,
    getEditorFontSize: (state) => state.editorFontSize,
    getBaseDir: (state) => state.basedir
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
    },
    setEditorFontSize(number: number){
      this.editorFontSize = number
    },
    setBaseDir(path: string){
      this.basedir = path
    }
  }
  
})