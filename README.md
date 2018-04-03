#	nopa
__Node.js Packages Assistant__

[![total downloads of nopa](https://img.shields.io/npm/dt/nopa.svg)](https://www.npmjs.com/package/nopa)
[![nopa's License](https://img.shields.io/npm/l/nopa.svg)](https://www.npmjs.com/package/nopa)
[![latest version of nopa](https://img.shields.io/npm/v/nopa.svg)](https://www.npmjs.com/package/nopa)

##	Description

__nopa__ is a toolset offering some interesting, handy commands about NPM packages.

##	ToC, Table of Contents

*	[Get Started](#get-started)
* 	[Sub Commands](#sub-commands)
*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nopa)

##	Get Started

```bash
# After installation, a global command "nopa" will be available. 
npm install -g nopa

# List available sub commands. 
nopa 
 
# Show help info of sub command. 
nopa help homepage
```

##  Sub Commands

The following sub commands or command-sets are avaiable under command `nopa`:

*	__apidoc__  
	Open Node.js online document of specified built-in module of specified Node.js version.

*	__config__  
	Manage configurations.

*	__homepage__  
	Open / display the homepage of NPM package.

*	__names__  
	Find available package names.

*	__open__  
	A bridge command of __homepage__ or __profile__.

*	__profile__  
	Open / display the profile page of NPM user or organization.

*	__stars__  
	List count of stars of packages ownered by someone.

*	__statistics__  
	List statstical information about NPM package or user.

When no ambiguity present, using heading characters of a sub command is acceptable. E.g., `nopa stat` is regarded as `nopa statistics`.

Run `nopa help <command-name>` to read detailed manual.