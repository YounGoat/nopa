'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, child_process = require('child_process')
	, url = require('url')
	
	/* NPM */
	, commandos = require('commandos')
	, if2 = require('if2')
	, noda = require('noda')
	, colors = require('colors')

	, getDownloadCount = require('npm-registry-rest/getDownloadCount')
	, getPackageNames = require('npm-registry-rest/getPackageNames')
	, getPackage = require('npm-registry-rest/getPackage')
	, getStarCount = require('npm-registry-rest/getStarCount')

	/* in-jinang */
	, co = require('jinang/co')
	, table = require('jinang/table')
	, sort = require('jinang/sort')
	
	/* in-package */
	, config = noda.inRequire('lib/config')

	/* in-file */
	, onError = err => console.log(colors.red(err.message))
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function owner_stars(username, orderby) { co(function*() {
	if (username[0] == '~') username = username.slice(1);

	console.log('username:', colors.bold(username));
	
	process.stdout.write('querying package names ...');
	let packageNames = yield getPackageNames({ owner: username });
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log('total packages:', colors.bold(packageNames.length));
	console.log(colors.dim('--------'));

	if (orderby == 'name') {
		packageNames.sort();
	}
	let maxlength = 0;
	packageNames.forEach(name => maxlength = Math.max(maxlength, name.length));

	const SPACE = '\u0020', STAR = '\u2605', ELLIPSIS = '\u22EF';
	yield co.each(packageNames, function*(name) {
		let nameColumn = name + SPACE.repeat(1 + maxlength - name.length);

		process.stdout.write(nameColumn);
		process.stdout.write('querying ... ');
		let starCount = yield getStarCount(name);
		process.stdout.clearLine();
		process.stdout.cursorTo(0);

		let stars = '';
		if (starCount == 0) {
			stars = '-';
		}
		else if (starCount < 30) {
			stars = STAR.repeat(starCount);
		}
		else {
			stars = STAR.repeat(30) + ELLIPSIS;
		}
		console.log(`${nameColumn}${stars} (${starCount})`);
	});
	
}).catch(onError); }

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=* help] REQUIRED', 
		], [
			'--owner NOT NULL REQUIRED',
			'--orderby NOT NULL',
		], [
			'--name [0] NOT NULL REQUIRED',
			'--orderby NOT NULL',
		],
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (cmd.owner) {
		return owner_stars(cmd.owner, cmd.orderby);
	}
	else if (cmd.name[0] == '~') {
		return owner_stars(cmd.name, cmd.orderby);
	}
	else {
		return help();
	}
}

run.desc = 'Show star count.';

module.exports = run;