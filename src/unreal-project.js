import { execSync, spawn } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import { platform } from 'os'
import extract from './lib/extract.js'
import download from './lib/download-repo.js'
import downloadZip from './lib/download-zip.js'
import { templatePath, hasTemplate, hasUnrealJS, hasV8, v8 } from './utils.js'
import decompress from 'decompress'
import copydir from 'copy-dir'
import ora from 'ora'

globalThis.spinner = ora('Loading unreal project').start();

const os = platform();
const cp = (from, to) => execSync(`cp ${from} ${to} -r`)

export default async root => {
  
  if (!hasUnrealJS(true)) {
    spinner.text = 'Downloading & extracting UnrealJS'
    await download('https://github.com/ncsoft/Unreal.js-core/archive/master.zip', templatePath(`Plugins/UnrealJS`))
  }
  
  if (!await hasV8(true)) {
    spinner.text = 'Downloading & extracting V8 binaries';
    const version = await v8.version()
    const file = await v8.file()
    const tag = await v8.tag()
    
    const repo = 'https://github.com/ncsoft/Unreal.js-core'
    const url = `${repo}/releases/download/${tag}/${file}`
    const dest = templatePath(`Plugins/UnrealJS/ThirdParty/v8`)
    
    await downloadZip(url, dest)
  }
  
  if (!hasTemplate()) {
    spinner.text = 'Extracting template'
    await extract(templatePath('../template.7z'), './')
  }
  
  if (!hasUnrealJS()) {
    spinner.text = 'Preparing UnrealJS'
    await cp(templatePath(`Plugins/UnrealJS`), `Plugins/UnrealJS`)
  }
  
  if (!await hasV8()) {
    spinner.text = 'Preparing V8 binaries';
    await cp(templatePath('Plugins/UnrealJS/ThirdParty/v8'), 'Plugins/UnrealJS/ThirdParty/v8')
  }
  
  spinner.succeed()
}

