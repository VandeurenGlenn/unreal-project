import rimraf from 'rimraf'
import unreal from './unreal-project'
import { templatePath } from './utils'

import { Command } from 'commander'
import { version } from './../package.json'

const program = new Command();

program
  .version(version)
  .option('-cl, --clean', 'cleanup')
  .parse(process.argv);
  // .option('-r, --reset', 'reset everything')
  // .option('-rv, --resetV8', 'resetV8')
  // .option('-ru, --resetUnrealJS', 'resetUnrealJS')

const clean = () => {
  rimraf(utils.templatePath('Plugins/UnrealJS/ThirdParty/v8/*.zip'))
}

// const resetV8 = () => rimraf(join(__dirname, 'template/Plugins/UnrealJS'))
// 
// const resetUnrealJS = () => rimraf(join(__dirname, 'Plugins/UnrealJS/ThirdParty/v8'))
// 
// const reset = () => rimraf('./*')

if (!program.clean) unreal()
if (program.clean) clean()

