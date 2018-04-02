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

function find(options) {
	let pattern = new Pattern(options.pattern);
	let errors = 0;

	let next = () => {
		if (errors > 3) {
			console.error(colors.red('too many errors'));
			return;
		}

		let pkgname = pattern.next();
		if (!pkgname) return;
		
		let urlname = modifyUrl.pathname(config('npm.registry'), `${pkgname}/latest`, 'w');
		
		// Some NPM mirror (e.g. TAONPM) will redirect the request to NPM official registry if non-mainstream user-agent occurs.
		let headers = { 'user-agent': 'Mozilla' };

		htp.get(urlname, headers, (err, response) => {
			if (err) {
				errors++;
			}
			else if (response.statusCode == 404) {
				if (!options.hideFree) {
					console.log(colors.blue('*'), colors.bold.blue(pkgname), '(FREE)');
				}
			}
			else {
				if (!options.hideOccupied) {
					console.log('*', colors.bold(pkgname), colors.italic.dim(response.body.description));
				}
			}
			next();
		});
	};
	
	next();	
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--pattern [0] NOT NULL REQUIRED',
			'--hideFree --hide-free NOT ASSIGNABLE',
			'--hideOccupied --hide-occupied NOT ASSIGNABLE',
		], [
			'--startsWith --starts-with NOT NULL REQUIRED',
			'--hideFree --hide-free NOT ASSIGNABLE',
			'--hideOccupied --hide-occupied NOT ASSIGNABLE',
		], [
			'--endsWith --ends-with NOT NULL REQUIRED',
			'--hideFree --hide-free NOT ASSIGNABLE',
			'--hideOccupied --hide-occupied NOT ASSIGNABLE',
		]
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else {
		if (cmd.pattern) {
			// DO NOTHING.
		}
		else if (cmd.startsWith) {
			cmd.pattern = cmd.startsWith + '[:alnum:]';
			delete cmd.startsWith;
		}
		else if (cmd.endsWith) {
			cmd.pattern = '[:alnum:]' + cmd.endsWith;
			delete cmd.endsWith;
		}

		return find(cmd);
	}
}

run.desc = 'Open NPM homepage of specified package.';

module.exports = run;
