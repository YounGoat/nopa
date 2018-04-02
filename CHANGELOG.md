#   nopa Change Log

Notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning 2.0.0](http://semver.org/).

##  [0.1.3] - Apr 3rd, 2018

*   Upgrade dependencies especially __[jinang](https://www.npmjs.com/package/jinang)/[co](https://github.com/YounGoat/jinang/blob/HEAD/docs/co.md)__.

##  [0.1.2] - Apr 2nd, 2018

*   Fixed the bug of `nopa statistics` on getting owner's stat info. Because [npm-registry-rest/getDownloadCount](https://www.npmjs.com/package/npm-registry-rest) does not support scoped package names on bulk query, `nopa statistics` will exit with exception at that time in previous version.

##  [0.1.1] - Mar 29th, 2018

*   Option `--orderby` accepted by sub command `nopa statistics`.
*   `nopa statistics` will display number of stars on displaying package stat info.
*   Dependencies upgraded.

##  [0.1.0] - Mar 26th, 2018

*   Sub command `nopa profile` added.
*   Sub command `nopa statistics` added.
*   Sub command `nopa open` added and the former homonymic alias is removed.
*   Alias `nopa open` is removed.
*   Fixed the bug on `nopa homepage --type npm` that an incorrect URL pathname `/packages/<name>` is responsed.

##	[0.0.5] - Mar 1st, 2018

*	Alias `nopa repo` added.
*	Fixed the bug that when there are more than one charset placeholder in name pattern, the leading charset placeholders will be replaced with `null` in the first iteration.
*	Sub command `nopa config` added to manage the configuration file.

##	[0.0.3] - Feb 24th, 2018

*	Command `nopa apidoc` added.

##	[0.0.2] - Feb 23th, 2018

*	Command `nopa names` added.

##	[0.0.1] - 2018-2-20

Released.

---
This CHANGELOG.md follows [*Keep a CHANGELOG*](http://keepachangelog.com/).
