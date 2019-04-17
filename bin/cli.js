#!/usr/bin/env node
'use strict'
const tool = require('command-line-tool')
const version = require('../package').version
const cli = parseCommandLine()
let options = cli.options._all
options = loadStoredConfig(options)

for (var key in options) {
	console.log('->', key)
}

// TODO - only place holder for now

return

/* jsdoc2md --help */
if (options.help) {
	tool.printOutput(cli.usage)

	/* jsdoc2md --version */
} else if (options.version) {
	tool.printOutput(version)
} else {
	const jsdoc2md = require('../')
	jsdoc2md._interface = 'cli'

	/* input files (jsdoc-options) required from here */
	/* input validation */
	try {
		const assert = require('assert')
		options.files = options.files || []
		assert.ok(options.files.length || options.source, 'Must supply either --files or --source')
	} catch (err) {
		tool.printOutput(cli.usage)
		handleError(err)
	}

	/* jsdoc2md --json */
	if (options.json) {
		jsdoc2md
			.getTemplateData(options)
			.then(function(json) {
				tool.printOutput(JSON.stringify(json, null, '  '))
			})
			.catch(handleError)

		/* jsdoc2md [<options>] --src <files> */
	} else {
		const fs = require('fs')
		if (options.template) options.template = fs.readFileSync(options.template, 'utf8')

		jsdoc2md
			.render(options)
			.then(output => {
				process.stdout.write(output)
				process.exit(0)
			})
			.catch(handleError)
	}
}

function loadStoredConfig(options) {
	const loadConfig = require('config-master')
	const jsdoc2mdConfig = loadConfig('jsdoc2md')
	return Object.assign(jsdoc2mdConfig, options)
}

function parseCommandLine() {
	const cliData = require('./cli-data')
	console.log(cliData)
	try {
		return tool.getCli(cliData.definitions, cliData.usageSections)
	} catch (err) {
		handleError(err)
	}
}

function handleError(err) {
	tool.halt(err.toString())
}
