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

function apidoc(name, version) {
	if (!name) name = 'index';
	if (!version) version = process.version;

	name = name.toLowerCase();
	version = version.toLowerCase();

	let baseurl = config('node.docs.api');
	let opendoc = (vername) => {
		let urlname = modifyUrl.pathname(baseurl, `${vername}/api/${name}.html`, 'a');
		console.log(`open ${urlname}`);
		open(urlname);
	};
	
	if (/^v\d+\.\d+\.\d+$/.test(version)) {
		return opendoc(version);
	}

	if (['*', 'x', 'latest'].includes(version)) {
		return opendoc('latest');
	}

	// 从 4.x 开始，长期支持（LTS）版本拥有代号，取首字母依字母表顺序、并以 on 结尾的单词。
	// argon  = 4.x
	// boron  = 6.x
	// carbon = 8.x
	if (/^(latest-)?(argon|boron|carbon)$/.test(version)) {
		return opendoc(`latest-${RegExp.$2}`);
	}

	if (/^(latest-)?v?0?\.(10|12)(\.[*x]?)?$/.test(version)) {
		return opendoc(`latest-v0.${RegExp.$2}.x`);
	}

	if (/^(latest-)?v?0(\.[*x]?)?$/.test(version)) {
		return opendoc('latest-v0.12.x');
	}

	if (/^(latest-)?v?(4|5|6|7|8|9)(\.[*x]?)?$/.test(version)) {
		return opendoc(`latest-v${RegExp.$2}.x`);
	}

	if (/^(latest-)?v?(4|5|6|7|8|9)\.(\d+)(\.[*x]?)?$/.test(version)) {
		let versionPrefix = `v${RegExp.$2}.${RegExp.$3}.`;
		
		let urlname = config('node.docs.api');
		htp.get(urlname).then(response => {
			if (response.statusCode != 200) throw '.';
			
			// @todo node 9.x 已开始支持反向预查。
			// let versions = response.body.match(/(?<=href=")[^/]+/g);
			
			let versions = response.body.match(/href="[^/]+/g).map(version => version.slice(6)).slice(1);
			let vername = versions.find(version => version.startsWith(versionPrefix));
			opendoc(vername);

		}).catch(ex => {
			console.log(ex);
			console.error(`failed to access ${urlname}`);
		});
		return;
	}
	
	console.log(`invalid version: ${version}`);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--name -n [0] NOT NULL',
			'--version -v [1] NOT NULL',
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
		return apidoc(cmd.name, cmd.version);
	}
}

run.desc = 'Open NPM homepage of specified package.';

module.exports = run;