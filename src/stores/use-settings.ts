import { defineStore } from 'pinia'
// @ts-ignore
import { themeSettings } from '@/utils/themeSettings.js'
import { type FileType } from '@/types/FileType'

export type RootState = {
  appFont: string
  editorFont: string
  fontColor: string
  editorFontSize: number,
  basedir: string,
  baseFontDir: string,
  theme: string,
  enableAppendDir: boolean,
  appendedDir: string
  enableAppendFile: boolean,
  fileToAppend: FileType,
  showSelectedFolder: boolean,
  editorWith: number,
  droppedFiles: string[]
}

export const useSettings = defineStore('settings', {
  state: () => ({ 
    appFont: 'Arial',
    editorFont: 'Consolas',
    fontColor: '#909090',
    editorFontSize: 0.9,
    basedir: '',
    baseFontDir: '',
    theme: themeSettings[0].name,
    enableAppendDir: false,
    appendedDir: '',
    enableAppendFile: false,
    fileToAppend: {name: '', path: ''},
    showSelectedFolder: true,
    editorWith: 700,
    droppedFiles: []
  } as RootState),

  persist: true,

  getters: {
    getAppFont: (state) => state.appFont,
    getEditorFont: (state) => state.editorFont,
    getFontColor: (state) => state.fontColor,
    getEditorFontSize: (state) => state.editorFontSize,
    getBaseDir: (state) => state.basedir,
    getBaseFontDir: (state) => state.baseFontDir,
    getTheme: (state) => state.theme,
    getEnableAppendDir: (state) => state.enableAppendDir,
    getAppendedDir:  (state) => state.appendedDir,
    getEnableAppendFile: (state) => state.enableAppendFile,
    getfileToAppend: (state) => state.fileToAppend,
    getShowSelectedFolder: (state) => state.showSelectedFolder,
    getToggleEditorWidth: (state) => state.editorWith,
    getDroppedFiles: (state) => state.droppedFiles
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
    setEnableAppendDir(val: boolean){
      this.enableAppendDir = val
    },
    setAppendedDir(val: string){
      this.appendedDir = val
    },
    setEnableAppendFile(val: boolean){
      this.enableAppendFile = val
    },
    setfileToAppend(val: FileType){
      this.fileToAppend = val
    },
    setShowSelectedFolder(val: boolean){
      this.showSelectedFolder = val
    },
    setToDroppedFiles(path: string){
      const alreadyDropped = this.getDroppedFiles.includes(path)
      // console.log(alreadyDropped)
      if(!alreadyDropped){
        this.droppedFiles.push(path)
      }
    },
    unmountDropFile(path: string){
      this.droppedFiles = this.droppedFiles.filter( pth => pth !== path )
    },
    applySettings(){
      document.documentElement.style.setProperty('--app_font', this.appFont)
      document.documentElement.style.setProperty('--editor_font', this.editorFont)
      document.documentElement.style.setProperty('--text_color', this.fontColor)
      document.documentElement.style.setProperty('--editor_font_size', `${this.editorFontSize}rem`)
    },
    applyTheme(){
      const theme = themeSettings.filter((el: any) => el.name === this.getTheme)[0]
      
      document.documentElement.style.setProperty('--left_panel_color', theme?.colors?.left_panel || '#202020')
      document.documentElement.style.setProperty('--view_color', theme?.colors?.view || '#191919')
      document.documentElement.style.setProperty('--settings_panel_color', theme?.colors?.settings_panel || '#202020')
      document.documentElement.style.setProperty('--border_color', theme?.colors?.border || '#525252')
      document.documentElement.style.setProperty('--markdown_pre_color', theme?.colors?.pre || '#131313')
    },
    toggleEditorWidth(){
      this.editorWith === 700 ? this.editorWith = 900 : this.editorWith = 700
    }
  }
})
