import { defineStore } from 'pinia'
// @ts-ignore
import { type FileType } from '@/types/FileType.ts'

export type RootState = {
  openFiles: Omit<FileType, 'children'>[]
  selectedPath: string,
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: 0
};

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    selectedPath: '',
    clickDrawerFile: [],
    savedFile: 0
  } as RootState),

  persist: true,

  getters: {
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    getSavedFile: (state) => state.savedFile,
    getSelectedPath: (state) => state.selectedPath,
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
      this.openFiles = this.openFiles.filter( tab => tab.path !== path)

      if(this.getOpenFiles.length){
        this.setSelectedPath(this.getOpenFiles[this.getOpenFiles.length-1].path)
      } else {
        this.setSelectedPath('')
      }
    },

    savedFileTrigger(){
      this.savedFile++
    }
  },
})