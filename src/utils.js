import { existsSync, readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const read = promisify(readFile)

const version = async () => {
  let data = await read(join(__dirname, '../template/Plugins/UnrealJS/ThirdParty/v8/include/v8-version.h'))
  data = data.toString()
  
  let major = data.match(/MAJOR_VERSION\W\d+/g)
  major = major[0].replace(/MAJOR_VERSION\W/, '')  
  let minor = data.match(/MINOR_VERSION\W\d+/g)
  minor = minor[0].replace(/MINOR_VERSION\W/, '')
  let build = data.match(/V8_BUILD_NUMBER\W\d+/g)
  build = build[0].replace(/V8_BUILD_NUMBER\W/, '')
  return `${major}.${minor}.${build}`
}

export const file = async () => {
  const v = await version()
  return `v8-${v}-libs.zip`
}

const _v8 = {
  version,
  tag: async () => {
    const v = await version()
    return `V8-${v}`
  },
  file
}

export const templatePath = path => join(__dirname, '../template', path)

export const v8 = _v8

export const hasTemplate = template => existsSync(template ? templatePath('Binaries') : 'Binaries')

export const hasUnrealJS = template => existsSync(template ? templatePath('Plugins/UnrealJS') : 'Plugins/UnrealJS')

export const hasV8 = async template => {
  return existsSync(template ? templatePath(`Plugins/UnrealJS/ThirdParty/v8/lib`) : `Plugins/UnrealJS/ThirdParty/v8/lib`)
}

