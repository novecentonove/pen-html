import { settingFile } from "@/types/SettingFile"
import { howToFile } from "@/types/HowToFile"

export function parseFileName(name:string): string{
  let parsedName = ''
  if(name){

    // remove html ext
    const ext = name.split('.').pop()
    const nameOnly = name.substring(0, name.lastIndexOf('.')) || name
    parsedName = nameOnly

    // short filemane if too long
    if(parsedName.length > 25){
      const start = parsedName.substring(0, 6)
      const end = parsedName.slice(-6)
      parsedName = `${start}...${end}`
    }

    if(ext !== 'html' && name !== settingFile.name && name !== howToFile.name){
      parsedName =`${parsedName}.${ext}`
    }
 
  }

  return parsedName
}