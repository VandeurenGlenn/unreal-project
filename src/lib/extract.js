import Zip from 'node-7z-forall'

/**
 * @param {object} src - 'path to archive.'
 * @param {object} dest - 'path to extract archive to.'
 *
 * @return {Promise} resolves on success, rejects on failure
 *
 * @example 
 * extract('master.zip', 'master')
 */
export default (src, dest) => new Promise((resolve, reject) => {
  new Zip().extractFull(src, dest)
  .progress(files => spinner.text(`extracting ${files}`))
  .then(() => resolve())
  .catch(e => reject(e))
})