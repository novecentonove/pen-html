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
      let exists = false
      this.openFiles.forEach(page => {
        if(page.name === file.name) exists = true
      });

      if(!exists) this.openFiles.push(file)
      
    },
  },
})