import { defineStore } from 'pinia'
// @ts-ignore
import { type FileType } from '@/types/FileType'
import { snakeCase } from 'lodash'

export type RootState = {
  openFiles: Omit<FileType & { isError?: boolean, error?: string}, 'children'>[]
  selectedPath: string
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: number,
  tabToDrag: string,
  notSavedFiles: string[], // path
  fileDialogToTrigger: string,// path
  // dialogTrigger: number,
  dialogTriggerForAll: number
}

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    selectedPath: '',
    clickDrawerFile: [],
    savedFile: 0,
    tabToDrag: '',
    notSavedFiles: [],
    fileDialogToTrigger: '',
    // dialogTrigger: 0,
    dialogTriggerForAll: 0
  } as RootState),

  persist: true,

  getters: {
    getOpenFile: (state) => (path: string) => state.openFiles.find((file) => file.path === path),
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    getFileIsSaved: (state) => state.savedFile,
    getSelectedPath: (state) => state.selectedPath,
    getTabToDrag: (state) => state.tabToDrag,
    // file dialog
    getNotSavedFiles: (state) => state.notSavedFiles,
    getFileDialogToTrigger: (state) => state.fileDialogToTrigger,
    // getDialogTrigger: (state) => state.dialogTrigger,
    getDialogTriggerForAll: state => state.dialogTriggerForAll
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
    },

    selectLastTab(){
      if(this.getOpenFiles.length){
        this.setSelectedPath(this.getOpenFiles[this.getOpenFiles.length-1].path)
      } else {
        this.setSelectedPath('')
      }
    },

    destroyTab(path: string){
      // remove from unSavedFile
      this.removeFromNotSavedFile(path)
      // remove from open files
      this.openFiles = this.openFiles.filter( tab => tab.path !== path)
      console.log('destroyed')
    },
    
    // close tabs
    async closeTab(path: string, action?: string){
      return new Promise(async(resolve, reject) => {
        try {
          const res = await this.closeTabPromise(path, action)
          resolve(res)
        } catch(e){
          // reject(e)
          console.log(e)
        }
      })
    },

    async closeTabPromise(path: string, action?: string){
      return new Promise((resolve, reject) => {

        const isSaved = !this.checkIfFileIsNotSaved(path)

        if( isSaved || action == 'discard') {
          this.destroyTab(path)
          this.selectLastTab()
          resolve(true)
        } 
        else if(action == 'cancel'){
          reject('cancel')
        }
        // Open dialog to close file
        else {
          this.setFileDialogToTrigger(path)
        }
      

        // return promise if path is cleared
        const interv = setInterval( () => {
           if (this.getOpenFiles.filter(file => file.path === path).length < 0){
            resolve(true)
            clearInterval(interv)
          }
        }, 400)
      })
    },

    setFileDialogToTrigger(path: string){
      this.fileDialogToTrigger = path
    },

    async closeAllTabs(){
      this.dialogTriggerForAll++
      // const files = this.getOpenFiles

      // for (const file of files) {
      //   console.log('all init')
      //   try {
      //     const res = await this.closeTab(file.path)
      //     console.log('all', res);
      //   } catch(e){
      //     console.log('all', e);
      //   }
      // }

      // return new Promise((resolve /*reject*/) => {
      //   this.dialogTriggerForAll++

      //   const interv = setInterval( () => {
      //     if (this.getNotSavedFiles.length == 0){
      //       resolve(true)
      //       clearInterval(interv)
      //     }
          
      //   }, 400)
      // })
    },

    checkIfFileIsNotSaved(path: string){
      return this.getNotSavedFiles.includes(path)
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

    triggerFileIsSaved(){
      this.savedFile++
    },

    _setNotSavedFiles(arr: string[]){
      this.notSavedFiles = arr
    },

    removeFromNotSavedFile(path: string){
      const res = this.getNotSavedFiles.filter(el => el !== path)
      this._setNotSavedFiles(res)
    }   

  }
})