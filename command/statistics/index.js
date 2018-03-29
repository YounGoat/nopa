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
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function package_stat(name) { co(function*() {
	console.log('package name:', colors.bold(name));

	let meta = yield getPackage(name);
	console.log('-- stars --');
	if (meta.users) {
		console.log(Object.keys(meta.users).length);
	}
	else {
		console.log('No users starred this package.');
	}

	console.log('-- downloads --');
	let ranges = [ 'last-day', 'last-week', 'last-month'];
	for (let i = 0; i < ranges.length; i++) {
		let range = ranges[i];
		let count = yield getDownloadCount({ range, name });
		console.log(range, '\t', colors.bold(count));
	}

}).catch(err => {
	console.error(`failed to find package: ${name}`);
}); }

function owner_stat(username, orderby) { co(function*() {
	if (username[0] == '~') username = username.slice(1);

	console.log('username:', colors.bold(username));
	
	process.stdout.write('querying package names ...');
	let packageNames = yield getPackageNames({ owner: username });
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log('total packages:', colors.bold(packageNames.length));

	if (orderby == 'name') {
		packageNames.sort();
	}

	// let stars = {};
	// for (let i = 0; i < packageNames.length; i++) {
	// 	let name = packageNames[i];
	// 	process.stdout.write(`querying package stars: ${name}`);
	// 	stars[name] = yield getStarCount(name);
	// 	process.stdout.clearLine();
	// 	process.stdout.cursorTo(0);
	// }
	
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
	let total = { name: 'TOTAL' };
	ranges.forEach(range => total[range] = 0);
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
			name           : color(name),
			// stars          : stars[name],
			orderDownloads : count,
			'last-day'     : color(count),
			'last-week'    : colors.dim(counts['last-week'][name]),
			'last-month'   : colors.dim(counts['last-month'][name]),
		});

		ranges.forEach(range => total[range] += counts[range][name]);
	});

	if (orderby == 'downloads') {
		sort(rows, 'orderDownloads');
	}

	rows.push(total);

	console.log('-- downloads --');
	table.print(rows, {
		columns: [ 
			'name',
			{ name: 'last-day', align: 'right' }, 
			{ name: 'last-week', align: 'right' }, 
			{ name: 'last-month', align: 'right' },
			// { name: 'stars', align: 'right' },
		],
	});
}).catch(ex => console.log(ex)); }

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=* help] REQUIRED', 
		], [
			'--package NOT NULL REQUIRED',
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
	else if (cmd.package) {
		return package_stat(cmd.package);
	}
	else if (cmd.owner) {
		return owner_stat(cmd.owner, cmd.orderby);
	}
	else if (cmd.name[0] == '~') {
		return owner_stat(cmd.name, cmd.orderby);
	}
	else if (cmd.name) {
		return package_stat(cmd.name);
	}
}

run.desc = 'Show statistics info.';

module.exports = run;