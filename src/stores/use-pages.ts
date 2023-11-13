import { defineStore } from 'pinia'
import FileType from '@/types/FileType.ts'

export type RootState = {
  openFiles: FileType[];
};

export const usePages = defineStore('pages', {
  state: () => ({ 
    openFiles: []
  } as RootState),

  getters: {
    getOpenFiles: (state) => state.openFiles,
  },

  actions: {
    addPage(file: FileType) {
      this.openFiles.forEach((page, i) => {
        if(page.name === file.name) this.openFiles.splice(i, i+1)
      });

     this.openFiles.push(file)
      
    },
  },
})