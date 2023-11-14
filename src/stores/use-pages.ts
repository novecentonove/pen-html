import { defineStore } from 'pinia'
import FileType from '@/types/FileType.ts'

export type RootState = {
  openFiles: FileType[];
  clickDrawerFile: FileType[]
};

export const usePages = defineStore('pages', {
  state: () => ({ 
    openFiles: [],
    clickDrawerFile: []
  } as RootState),

  getters: {
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
  },

  actions: {
    addPage(file: FileType) {
      let exists = false
      this.openFiles.forEach(page => {
        if(page.name === file.name){
          exists = true
          this.clickDrawerFile = file
        }
      });

      if(!exists) this.openFiles.push(file)
      
    },
  },
})