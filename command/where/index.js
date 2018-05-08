'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, child_process = require('child_process')
	, fs = require('fs')
	, path = require('path')
	
	/* NPM */
	, commandos = require('commandos')
	, noda = require('noda')
	, colors = require('colors')
	
	/* in-package */
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function where(name) {
	let snippet = `process.stdout.write(require.resolve("${name}"))`;
	let jspath = child_process.spawnSync('node', [ '-e', snippet ]).stdout.toString();
	let packageJson = null;
	if (jspath) {
		let dirname = jspath;
		do {
			if (dirname == (dirname = path.dirname(dirname))) break;
			let packageJsonPath = path.join(dirname, 'package.json');
			if (fs.existsSync(packageJsonPath)) {
				packageJson = require(packageJsonPath);
			}
		} while (!packageJson)

		console.log(colors.dim('Required path  :'), colors.bold.red(jspath));
		if (packageJson) {
			console.log(colors.dim('Module name    :'), colors.bold.red(packageJson.name));
			console.log(colors.dim('Module version :'), colors.bold.red(packageJson.version));
		}
		else {
			console.warn(colors.yellow('package.json not found'));
		}
	}
	else {
		console.warn(colors.yellow(`module not found: ${name}`));
	}
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name -n [0] REQUIRED'
		]
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });
	
	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (!cmd.name) {
		return help();
	}
	else {
		where(cmd.name);
	}
}

run.desc = 'Find the location of specified module.';

module.exports = run;