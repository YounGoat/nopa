'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, child_process = require('child_process')
	, url = require('url')
	
	/* NPM */
	, commandos = require('commandos')
	, htp = require('htp')
	, modifyUrl = require('jinang/modifyUrl')
	, open = require('jinang/open')
	, noda = require('noda')
	
	/* in-package */
	, config = noda.inRequire('lib/config')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function homepage(pkgname) {
	console.log('querying ...');
	
	let urlname = modifyUrl.pathname(config('npm.registry'), `${pkgname}/latest`, 'w');
	htp.get(urlname, (err, response) => {
		if (err) {
			console.error('registry querying failed');
			return;
		}

		if (response.statusCode == 404) {
			console.error(`package not found: ${pkgname}`);
			return;
		}

		let urlname = response.body.homepage;
		if (urlname) {
			console.log(`open ${urlname}`);
			open(urlname);
			return;
		}
		else {
			console.warn('Homepage not defined, open NPM homepage as replacement.');
			homepage_npm(pkgname);
			return;
		}
	});
}

function homepage_repository(pkgname) {
	console.log('querying ...');
	
	let urlname = modifyUrl.pathname(config('npm.registry'), `${pkgname}/latest`, 'w');
	htp.get(urlname, (err, response) => {
		if (err) {
			console.error('registry querying failed');
			return;
		}

		if (response.statusCode == 404) {
			console.error(`package not found: ${pkgname}`);
			return;
		}

		let repo = response.body.repository;
		if (!repo) {
			console.error('Repository not defined.');
			return;
		}

		let urlname = null;
		if (typeof repo == 'string') {
			urlname = repo;
		}
		else {
			urlname = repo.url;
		}
		
		if (!urlname) {
			console.error('Repository url not defined.');
			return;
		}

		console.log(`open ${urlname}`);
		open(urlname);
		return;
	});
}

function homepage_npm(pkgname) {
	let urlname = modifyUrl.pathname(config('npm.home'), `package/${pkgname}`, 'w');
	open(urlname);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name -n [0] NOT NULL REQUIRED',
			'--type -t NOT NULL',
		]
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (cmd.type == 'npm') {
		return homepage_npm(cmd.name);
	}
	else if ('repository'.startsWith(cmd.type) && cmd.type.length >= 4) {
		return homepage_repository(cmd.name);
	}
	else if (cmd.type) {
		return help();
	}
	else {
		return homepage(cmd.name);
	}
}

run.desc = 'Open NPM homepage of specified package.';

module.exports = run;