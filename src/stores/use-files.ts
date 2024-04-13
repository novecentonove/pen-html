import { defineStore } from 'pinia'
// @ts-ignore
import { type FileType } from '@/types/FileType'
import { snakeCase } from 'lodash'

type CloseFileHandler = {
  path: string,
  resolved: boolean,
  action?: string
}[]

type TriggerFileToClose = {
  path: string,
  close: boolean
} | {}

export type RootState = {
  openFiles: Omit<FileType & { isError?: boolean, error?: string}, 'children'>[]
  selectedPath: string
  clickDrawerFile: Omit<FileType, 'children'>[]
  savedFile: number,
  tabToDrag: string,
  closeFilesHandler: CloseFileHandler,
  triggerFileToClose: TriggerFileToClose
  notSavedFiles: string[],        // Array[path]
  triggerSaveFile: string       // path
  triggerReloadAllDirs: number
  // fileDialogToTrigger: string,    // path
  // dialogTriggerForAll: number
  // dialogTriggerForAllAndKeep: number
}

export const useFiles = defineStore('files', {
  state: () => ({ 
    openFiles: [],
    selectedPath: '',
    clickDrawerFile: [],
    savedFile: 0,
    tabToDrag: '',
    closeFilesHandler: [],
    triggerFileToClose: {},
    notSavedFiles: [],
    triggerSaveFile: '',
    triggerReloadAllDirs: 0
    // fileDialogToTrigger: '',
    // dialogTriggerForAll: 0,
    // dialogTriggerForAllAndKeep: 0
  } as RootState),

  persist: true,

  getters: {
    findInOpenFiles: (state) => (path: string) => state.openFiles.find((file) => file.path === path),
    getOpenFiles: (state) => state.openFiles,
    getClickDrawerFile: (state) => state.clickDrawerFile,
    showFileIsSaved: (state) => state.savedFile, // triggers 'saved' 
    getSelectedPath: (state) => state.selectedPath,
    getTabToDrag: (state) => state.tabToDrag,
    getTriggerSaveFile: (state) => state.triggerSaveFile, // triggers to editor, then it saves file
    // file dialog
    getCloseFileHandler: (state) => (path: string) => state.closeFilesHandler.find(obj => obj.path === path),
    getCloseFilesHandler: (state) => state.closeFilesHandler,
    getTriggerFileToClose: (state) => state.triggerFileToClose,
    getNotSavedFiles: (state) => state.notSavedFiles,
    getTriggerReloadAllDirs: (state) => state.triggerReloadAllDirs
    // getFileDialogToTrigger: (state) => state.fileDialogToTrigger,
    // getDialogTriggerForAll: state => state.dialogTriggerForAll,
    // getDialogTriggerForAllAndKeep: state => state.dialogTriggerForAllAndKeep
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
    },

    async saveActiveTab(){
      this.triggerSaveFile = ''
       
       setTimeout(() => {
         this.saveFilePromise(this.getSelectedPath)
       }, 200);

       setTimeout(() => {
        this.triggerSaveFile = ''
      }, 200);
    },

    setTriggerReloadAllDirs(){
      this.triggerReloadAllDirs++
    },
    
    // # close tabs

    async closeAllTabs(closeTab = true){
      return new Promise(async(resolve) => {
        const tabs = this.getOpenFiles
        // this.closeFilesHandler = []
        if(tabs.length){
          for (const tab of tabs) {
             await this.askTocloseTab(tab.path, closeTab)
          }
          resolve(true)
        } else {
          resolve(true)
        }
      })
    },

    async askTocloseTab(path: string, closeTab = true){

      return new Promise(async(resolve) => {
        try {
          await this.resetCloseTriggers()

          const isNotSaved = this.getNotSavedFiles.find(el => el === path)
          
          if(isNotSaved){
            this.addCloseFileHandler(path)
            this.setSelectedPath(path)
            const res = await this.awaitCloseTab(path, closeTab)
            resolve(res)
          } else {
            if(closeTab){
              this.destroyTab(path)
              this.selectLastTab()
            }
            resolve('already saved')
          }
        } catch(e){
          console.warn(e)
        }
      })
    },

    addCloseFileHandler(path: string, resolved = false){
      this.closeFilesHandler.push({path: path, resolved: resolved})
    },

    awaitCloseTab(path: string, closeTab: boolean){
        return new Promise(async(resolve, reject) => {

        // trigger file dialog
        this.triggerFileToClose = {path: path, close: closeTab}

        // da file dialog: resolve file
        const interval = setInterval( () => {
        const fileHandler = this.getCloseFileHandler(path)

          if(fileHandler?.resolved){
            this.removeCloseFileHandler(path)
            clearInterval(interval)
            resolve(true)
          }
        }, 200)

      })
    },

    removeCloseFileHandler(path: string){
      this.getCloseFilesHandler.filter(el => el.path !== path);
    },

    async resolveCloseFile(res: string, path: string, close: boolean){
      const fileHandler = this.getCloseFileHandler(path)
      
      if(!fileHandler){
        console.warn('fileHandler not found')
        return
      }

      switch (res) {
        case 'discard':
          this.resolveHandler(path)
          if(close){
            this.destroyTab(path)
            this.selectLastTab()
          }
          break;
        case 'cancel':
          this.resolveHandler(path)
          break;
        case 'save':
          await this.saveFilePromise(path)
          this.resolveHandler(path)
          if(close){
            this.destroyTab(path)
            this.selectLastTab()
          }
          break;
        default:
          break;
      }
    },

    async saveFilePromise(path: string){
      return new Promise(async (resolve/*, reject*/) => {
        this.triggerSaveFile = path

        const interval = setInterval( () => {
          const fileHandler = this.getCloseFileHandler(path)
            if(fileHandler?.resolved){
              clearInterval(interval)
              resolve(true)
            }
        }, 200)
      })
    },

    resolveHandler(path: string, resolved?: boolean){
      if(resolved == undefined){
        resolved = true
      }

      const fileHandler = this.getCloseFileHandler(path)
      if(fileHandler){
        fileHandler.resolved = resolved
      }
    },

    async resetCloseTriggers(){
      //reset trigger
      return new Promise(async (resolve) => {
        setTimeout(() => {
          this.triggerFileToClose = {}
          this.closeFilesHandler = []
          this.triggerSaveFile = ''
          resolve(true)
        }, 200);
      })
    },

    setToggleSavedFiles(val: {path: string, savedFile: boolean}){
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

    removeFromNotSavedFile(path: string){
      const res = this.getNotSavedFiles.filter(el => el !== path)
      this._setNotSavedFiles(res)
    },

    _setNotSavedFiles(arr: string[]){
      this.notSavedFiles = arr
    }

  }
})