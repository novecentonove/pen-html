import { defineStore } from 'pinia'
import FileType from '@/types/FileType.ts'

export type RootState = {
  openFiles: Omit<FileType, 'children'>[]
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: 0
};

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    clickDrawerFile: [],
    savedFile: 0
  } as RootState),

  persist: true,

  getters: {
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    getSavedFile: (state) => state.savedFile,
  },

  actions: {
    addPage(file: Omit<FileType, 'children'>) {
      let exists = false
      this.openFiles.forEach(tab => {
        if(tab.path === file.path){
          exists = true
          this.clickDrawerFile = file
        }
      })

      if(!exists) this.openFiles.push(file)
    },

    closeTab(path: string){
      this.openFiles = this.openFiles.filter( tab => tab.path !== path)
    },

    savedFileTrigger(){
      this.savedFile++
    }
  },
})