'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, child_process = require('child_process')
	, url = require('url')
	
	/* NPM */
	, colors = require('colors')
	, commandos = require('commandos')
	, htp = require('htp')
	, modifyUrl = require('jinang/modifyUrl')
	, noda = require('noda')
	
	/* in-package */
	, config = noda.inRequire('lib/config')
	, Pattern = noda.inRequire('class/Pattern')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function list(subname) {
	if (subname === true) subname = '';
	let configs = config();
	for (let name in configs) {
		if (name.search(subname) >= 0) {
			console.log(colors.bold(name), colors.italic(configs[name]));
		}
	}
}

function read(name) {
	console.log(colors.bold(name), colors.italic(config(name)));
}

function write(name, value) {
	config(name, value);
}

function reset(name) {
	config.reset(name);
	console.log(name ? `Configuration ${colors.bold(name)} reset.` : 'All user defined configurations reset.');
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--list -l REQUIRED',
		], [
			'--name [0] NOT NULL REQUIRED',
			'--value [1] NOT NULL',
		], [
			'--reset NOT ASSIGNABLE REQUIRED',
			'--name [0] NOT NULL',
		]
	];

	const cmd = commandos.parse([ 'foo' ].concat(argv), { groups, catcher: help });

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (cmd.list) {
		return list(cmd.list);
	}
	else if (cmd.reset) {
		return reset(cmd.name);
	}
	else if (cmd.name) {
		return cmd.value 
			? write(cmd.name, cmd.value)
			: read(cmd.name)
			;
	}
}

run.desc = 'List or change configurations used by nopa.';

module.exports = run;