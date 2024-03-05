import { defineStore } from 'pinia'


export type RootState = {
  message: {trigger: number, text: string}
}

export const useDialogs = defineStore('dialogs', {
  state: () => ({ 
    message: {trigger: 0, text: ''},
  } as RootState),

  getters: {
    getMessage: state => state.message
  },

  actions: {
    setMessage(text: string) {
      console.log('setMessage')
      this.message.text = text
      this.message.trigger++
    }
  }
})