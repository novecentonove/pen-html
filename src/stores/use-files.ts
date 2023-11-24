import { defineStore } from 'pinia'
// @ts-ignore
import { type FileType } from '@/types/FileType'

export type RootState = {
  openFiles: Omit<FileType, 'children'>[]
  selectedPath: string
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: number,
  notSavedFiles: string[]
};

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    selectedPath: '',
    clickDrawerFile: [],
    savedFile: 0,
    notSavedFiles: []
  } as RootState),

  persist: true,

  getters: {
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    getFileIsSaved: (state) => state.savedFile,
    getSelectedPath: (state) => state.selectedPath,
    getNotSavedFiles: (state) => state.notSavedFiles,
  },

  actions: {
    setSelectedPath(path: string) {
      this.selectedPath = path
    },
    addPage(file: Omit<FileType, 'children'>) {
      let exists = false
      this.openFiles.forEach(tab => {
        if(tab.path === file.path){
          exists = true
          // @ts-ignore
          this.clickDrawerFile = file
        }
      })

      if(!exists) this.openFiles.push(file)
    },

    closeTab(path: string){
      if(this.getOpenFiles.length){
        this.setSelectedPath(this.getOpenFiles[this.getOpenFiles.length-1].path)
      } else {
        this.setSelectedPath('')
      }

      // remove from unSavedFile
      this.removeFromNotSavedFile(path)
      
      // remove from open files
      this.openFiles = this.openFiles.filter( tab => tab.path !== path)
    },

    fileIsSafeTrigger(){
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
      const exists = files.includes(path);

      if(savedFile && exists){
        this.removeFromNotSavedFile(path)
      }

      if(val.savedFile && !exists){
        this.getNotSavedFiles.push(path)
      }

      if(!val.savedFile && !exists){
        this.getNotSavedFiles.push(path)
      }
    }
  }
})