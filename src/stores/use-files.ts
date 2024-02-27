import { defineStore } from 'pinia'
// @ts-ignore
import { type FileType } from '@/types/FileType'
import { snakeCase } from 'lodash'

export type RootState = {
  openFiles: Omit<FileType & { isError?: boolean, error?: string}, 'children'>[]
  selectedPath: string
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: number,
  notSavedFiles: string[], // path
  tabToDrag: string
}

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    selectedPath: '',
    clickDrawerFile: [],
    savedFile: 0,
    notSavedFiles: [],
    tabToDrag: ''
  } as RootState),

  persist: true,

  getters: {
    getOpenFile: (state) => (path: string) => state.openFiles.find((file) => file.path === path),
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    getFileIsSaved: (state) => state.savedFile,
    getSelectedPath: (state) => state.selectedPath,
    getNotSavedFiles: (state) => state.notSavedFiles,
    getTabToDrag: (state) => state.tabToDrag
  },

  actions: {
    setSelectedPath(path: string) {

      if(this.selectedPath == path){
        this.highlightTabTitle(path)
      }

      this.selectedPath = path
    },
    
    addAndSelectPage(file: Omit<FileType, 'children'>) {
      let exists = false
      this.openFiles.forEach(tab => {
        if(tab.path === file.path){
          exists = true
          // @ts-ignore
          this.clickDrawerFile = file
          this.setSelectedPath(file.path)
        }
      })

      if(!exists) {
        this.openFiles.push(file)
        this.setSelectedPath(file.path)
      }
    },

    highlightTabTitle(path: string){
      const selectedTab:HTMLElement | null = document.querySelector(`#${snakeCase(path)}`)
      if(selectedTab){
        const texttab:HTMLElement | null = selectedTab.querySelector('._filename_tab')
        if(texttab){
          texttab.style.filter = 'brightness(1.3)'
          setTimeout(() => {
            texttab.style.filter = 'brightness(1)'
          }, 200)
        }
      }
    },

    closeTab(path: string){

      // remove from unSavedFile
      this.removeFromNotSavedFile(path)

      // remove from open files
      this.openFiles = this.openFiles.filter( tab => tab.path !== path)

      if(this.getOpenFiles.length){
        this.setSelectedPath(this.getOpenFiles[this.getOpenFiles.length-1].path)
      } else {
        this.setSelectedPath('')
      }
    },

    triggerFileIsSaved(){
      this.savedFile++
    },

    setNotSavedFiles(arr: string[]){
      this.notSavedFiles = arr
    },

    removeFromNotSavedFile(path: string){
      const files = this.getNotSavedFiles
      const res = files.filter(el => el !== path)
      this.setNotSavedFiles(res)
    },

    toggleUnsavedFiles(val: {path: string, savedFile: boolean}){
      const files = this.getNotSavedFiles
      const savedFile = val.savedFile
      const path = val.path
      const exists = files.includes(path)

      if(savedFile && exists){
        this.removeFromNotSavedFile(path)
      }

      if(val.savedFile && !exists){
        this.getNotSavedFiles.push(path)
      }

      if(!val.savedFile && !exists){
        this.getNotSavedFiles.push(path)
      }
    },

    setTabToDrag(path: string) {
      this.tabToDrag = path
    },
    
    reArrangeFiles(tab_path: string, toIndex: number){

      const objectToMove =  this.getOpenFiles.find((el) => el.path === tab_path)

      if (objectToMove) {
        const rearrange = this.getOpenFiles.filter(obj => obj.path !== tab_path)
        rearrange.splice(toIndex, 0, objectToMove)
        this.openFiles = rearrange
      }

    },
    setOpenFileError(path: string, isError: boolean, error: string ){
      this.openFiles = this.getOpenFiles.map(file => {
        if(file.path === path){
          file.isError = isError,
          file.error = error
        }
        return file
      })
    }
  }
})