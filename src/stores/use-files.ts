import { defineStore } from 'pinia'
import FileType from '@/types/FileType.ts'

export type RootState = {
  openFiles: FileType[];
  clickDrawerFile: FileType[]
};

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    clickDrawerFile: []
  } as RootState),

  persist: true,

  getters: {
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
  },

  actions: {
    addPage(file: FileType) {
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
      this.openFiles.forEach((tab, i) => {
        if(tab.path === path){
          this.openFiles.splice(i, i+1);
        }
      })
    }
  },
})