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

    if(ext !== 'html'){
      parsedName =`${parsedName}.${ext}`
    }
 
  }
  return parsedName
}