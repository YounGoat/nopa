'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, commandos = require('commandos')
	, if2 = require('if2')
	, modifyUrl = require('jinang/modifyUrl')
	, open = require('jinang/open')
	, noda = require('noda')
	
	/* in-package */
	, config = noda.inRequire('lib/config')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function user_profile(username) {
	if (username[0] != '~') username = `~${username}`;
	let urlname = modifyUrl.pathname(config('npm.home'), username, 'w');
	open(urlname);
}

function org_profile(orgname) {
	if (orgname[0] == '@') orgname = orgname.slice(1);
	let urlname = modifyUrl.pathname(config('npm.home'), `org/${orgname}`, 'w');
	open(urlname);
}

function run(argv) {
	const groups = [ 
		[ 
			'--help -h [*:=*help] REQUIRED', 
		], [
			'--user NOT NULL',
			'--org NOT NULL',
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
	else if (cmd.user) {
		return user_profile(cmd.user);
	}
	else if (cmd.org) {
		return org_profile(cmd.org);
	}
	else if (name[0] == '~') {
		return user_profile(name);
	}
	else if (name[0] == '@') {
		return org_profile(name);
	}
	else {
		return help();
	}
}

run.desc = "Open profile page of NPM user or organization.";

module.exports = run;