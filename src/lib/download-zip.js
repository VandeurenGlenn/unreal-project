import download from 'download'

export default (url, dest, options = { extract: true, strip: 0 }) => download(url, dest, options)