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

	/* in-jinang */
	, co = require('jinang/co')
	, table = require('jinang/table')
	
	/* in-package */
	, config = noda.inRequire('lib/config')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function package_stat(name) { co(function*() {
	console.log('name:', colors.bold(name));

	console.log('-- downloads --');
	let ranges = [ 'last-day', 'last-week', 'last-month'];
	for (let i = 0; i < ranges.length; i++) {
		let range = ranges[i];
		let count = yield getDownloadCount({ range, name });
		console.log(range, '\t', colors.bold(count));
	}

}); }

function owner_stat(username) { co(function*() {
	if (username[0] == '~') username = username.slice(1);

	console.log('username:', colors.bold(username));
	
	process.stdout.write('querying package names ...');
	let packageNames = yield getPackageNames({ owner: username });
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log('total packages:', colors.bold(packageNames.length));
	
	const range = 'last-day';
	const counts = {};
	let ranges = [ 'last-day', 'last-week', 'last-month'];
	for (let i = 0; i < ranges.length; i++) {
		let range = ranges[i];
		process.stdout.write(`querying download counts (${range})...`);
		counts[range] = yield getDownloadCount({ range, names: packageNames });
		process.stdout.clearLine();
		process.stdout.cursorTo(0);	
	}

	let rows = [];
	packageNames.forEach(name => {
		let count = counts['last-day'][name];
		let color;
		if (count == 0) {
			color = colors.dim;
		}
		else if (count < 10) {
			color = colors.white;
		}
		else if (count < 20) {
			color = colors.bold;
		} 
		else if (count < 30) {
			color = colors.bold.green;
		}
		else if (count < 40) {
			color = colors.bold.yellow;
		}
		else {
			color = colors.bold.red;
		}

		rows.push({
			name: color(name),
			'last-day': color(count),
			'last-week': colors.dim(counts['last-week'][name]),
			'last-month': colors.dim(counts['last-month'][name]),
		});
	});

	console.log('-- downloads --');
	table.print(rows, {
		columns: [ 'name', 'last-day', 'last-week', 'last-month' ],
	});
}).catch(ex => console.log(ex)); }

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--package NOT NULL',
			'--owner NOT NULL',
		]
	];
	
	const cmd = commandos.parse.onlyArgs(argv, { groups, catcher: help });
	const name = if2.defined(cmd.$[0], '');

	if (!cmd) {
		return;
	}
	else if (cmd.help) {
		return help();
	}
	else if (cmd.package) {
		return package_stat(cmd.package);
	}
	else if (cmd.owner) {
		return owner_stat(cmd.owner);
	}
	else if (name[0] == '~') {
		return owner_stat(name);
	}
	else if (name) {
		return package_stat(name);
	}
	else {
		return help();
	}
}

run.desc = 'Show statistics info.';

module.exports = run;