import download from './download-zip'

export default (url, dest) => download(url, dest, { extract: true, strip: 1 })