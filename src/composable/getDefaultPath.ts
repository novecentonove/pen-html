import { platform } from '@tauri-apps/api/os';


export async function getDefaultPath(path:string) {
  if(path) return path
  else {
    const platformName = await platform();
    return getOsBase(platformName)
  }
}

async function getOsBase(platformName: string) {
  switch (platformName) {
    case 'win32':
      return 'C:\\';
    case 'linux':
        return '/home'
    case 'darwin':
        return '/Users'
    default:
        return '/'
    }

}