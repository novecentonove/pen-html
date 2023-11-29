import { defineStore } from 'pinia'
// @ts-ignore
import { themeSettings } from '@/utils/themeSettings.js'

export const useSettings = defineStore('settings', {
  state: () => ({ 
    appFont: 'Arial',
    editorFont: 'Consolas',
    fontColor: '#fff',
    editorFontSize: 16,
    basedir: 'default',
    baseFontDir: '',
    theme: 'default'
  }),

  persist: true,

  getters: {
    getAppFont: (state) => state.appFont,
    getEditorFont: (state) => state.editorFont,
    getFontColor: (state) => state.fontColor,
    getEditorFontSize: (state) => state.editorFontSize,
    getBaseDir: (state) => state.basedir,
    getBaseFontDir: (state) => state.baseFontDir,
    getTheme: (state) => state.theme,
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
    },
    setBaseFontDir(path: string){
      this.baseFontDir = path
    },
    setTheme(theme: string){
      this.theme = theme
    },
    applySettings(){
      document.documentElement.style.setProperty('--app_font', this.appFont)
      document.documentElement.style.setProperty('--editor_font', this.editorFont)
      document.documentElement.style.setProperty('--text_color', this.fontColor)
      document.documentElement.style.setProperty('--editor_font_size', `${this.editorFontSize}px`)
    },
    applyTheme(){
      const theme = themeSettings.filter((el: any) => el.name === this.getTheme)[0]
      
      document.documentElement.style.setProperty('--left_panel_color', theme?.colors?.left_panel || '#202020')
      document.documentElement.style.setProperty('--view_color', theme?.colors?.view || '#191919')
      document.documentElement.style.setProperty('--settings_panel_color', theme?.colors?.settings_panel || '#202020')
      document.documentElement.style.setProperty('--border_color', theme?.colors?.border || '#525252')
      document.documentElement.style.setProperty('--markdown_pre_color', theme?.colors?.pre || '#131313')
    }
  }
})
