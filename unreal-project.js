'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var os$1 = require('os');
var Zip = require('node-7z-forall');
var download$1 = require('download');
var util = require('util');
require('decompress');
require('copy-dir');
var ora = require('ora');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Zip__default = /*#__PURE__*/_interopDefaultLegacy(Zip);
var download__default = /*#__PURE__*/_interopDefaultLegacy(download$1);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);

/**
 * @param {object} src - 'path to archive.'
 * @param {object} dest - 'path to extract archive to.'
 *
 * @return {Promise} resolves on success, rejects on failure
 *
 * @example 
 * extract('master.zip', 'master')
 */
var extract = (src, dest) => new Promise((resolve, reject) => {
  new Zip__default['default']().extractFull(src, dest)
  .progress(files => spinner.text(`extracting ${files}`))
  .then(() => resolve())
  .catch(e => reject(e));
});

var downloadZip = (url, dest, options = { extract: true, strip: 0 }) => download__default['default'](url, dest, options);

var download = (url, dest) => downloadZip(url, dest, { extract: true, strip: 1 });

const read = util.promisify(fs.readFile);

const version = async () => {
  let data = await read(path.join(__dirname, '../template/Plugins/UnrealJS/ThirdParty/v8/include/v8-version.h'));
  data = data.toString();
  
  let major = data.match(/MAJOR_VERSION\W\d+/g);
  major = major[0].replace(/MAJOR_VERSION\W/, '');  
  let minor = data.match(/MINOR_VERSION\W\d+/g);
  minor = minor[0].replace(/MINOR_VERSION\W/, '');
  let build = data.match(/V8_BUILD_NUMBER\W\d+/g);
  build = build[0].replace(/V8_BUILD_NUMBER\W/, '');
  return `${major}.${minor}.${build}`
};

const file = async () => {
  const v = await version();
  return `v8-${v}-libs.zip`
};

const _v8 = {
  version,
  tag: async () => {
    const v = await version();
    return `V8-${v}`
  },
  file
};

const templatePath = path$1 => path.join(__dirname, '../template', path$1);

const v8 = _v8;

const hasTemplate = template => fs.existsSync(template ? templatePath('Binaries') : 'Binaries');

const hasUnrealJS = template => fs.existsSync(template ? templatePath('Plugins/UnrealJS') : 'Plugins/UnrealJS');

const hasV8 = async template => {
  return fs.existsSync(template ? templatePath(`Plugins/UnrealJS/ThirdParty/v8/lib`) : `Plugins/UnrealJS/ThirdParty/v8/lib`)
};

globalThis.spinner = ora__default['default']('Loading unreal project').start();

const os = os$1.platform();
const cp = (from, to) => child_process.execSync(`cp ${from} ${to} -r`);

var unrealProject = async root => {
  
  if (!hasTemplate(true)) {
    await downloadZip('https://github.com/VandeurenGlenn/unreal-project/releases/download/v1.0.0/template.7z', templatePath('../'), { extract: false });
  }
  
  if (!hasUnrealJS(true)) {
    spinner.text = 'Downloading & extracting UnrealJS';
    await download('https://github.com/ncsoft/Unreal.js-core/archive/master.zip', templatePath(`Plugins/UnrealJS`));
  }
  
  if (!await hasV8(true)) {
    spinner.text = 'Downloading & extracting V8 binaries';
    const version = await v8.version();
    const file = await v8.file();
    const tag = await v8.tag();
    
    const repo = 'https://github.com/ncsoft/Unreal.js-core';
    const url = `${repo}/releases/download/${tag}/${file}`;
    const dest = templatePath(`Plugins/UnrealJS/ThirdParty/v8`);
    
    await downloadZip(url, dest);
  }
  
  if (!hasTemplate()) {
    spinner.text = 'Extracting template';
    await extract(templatePath('../template.7z'), './');
  }
  
  if (!hasUnrealJS()) {
    spinner.text = 'Preparing UnrealJS';
    await cp(templatePath(`Plugins/UnrealJS`), `Plugins/UnrealJS`);
  }
  
  if (!await hasV8()) {
    spinner.text = 'Preparing V8 binaries';
    await cp(templatePath('Plugins/UnrealJS/ThirdParty/v8'), 'Plugins/UnrealJS/ThirdParty/v8');
  }
  
  spinner.succeed();
};

module.exports = unrealProject;
