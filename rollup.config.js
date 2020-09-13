import json from '@rollup/plugin-json'

export default [{
	input: 'src/index.js',
	output: {
		dir: './',
		format: 'cjs'
	}
}, {
	input: 'src/unreal-project.js',
	output: {
		dir: './',
		format: 'cjs'
	}
}, {
	input: 'src/cli.js',
	output: {
		dir: './bin',
		format: 'cjs',
    banner: '#!/usr/bin/env node'
	},
	plugins: [
		json()
	]
}]