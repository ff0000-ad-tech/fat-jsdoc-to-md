'use strict'

/* generation options */
let jsdoc2mdDefinitions = [
	{
		name: 'help',
		description: 'Print usage information',
		alias: 'h',
		type: Boolean
	},
	{ name: 'version', type: Boolean },
	{
		name: 'path',
		type: String,
		// typeLabel: '<file>',
		description: 'The file path'
	}
]

const dmdDefinitions = [
	{
		name: 'template',
		alias: 't',
		type: String,
		typeLabel: '<file>',
		description:
			'A custom handlebars template file to insert documentation into. The default template is `{{>main}}`.'
	},
	{
		name: 'helper',
		type: String,
		typeLabel: '[underline]{module} ...',
		multiple: true,
		description: 'Handlebars helper modules to override or extend the default set.'
	},
	{
		name: 'partial',
		type: String,
		typeLabel: '[underline]{file} ...',
		multiple: true,
		description: 'Handlebars partial files to override or extend the default set.'
	}
]

/* mix in the jsdoc-parse and dmd options */
let definitions = jsdoc2mdDefinitions
	.map(def => {
		def.group = 'jsdoc2md'
		return def
	})
	.concat(
		dmdDefinitions.map(def => {
			def.group = 'dmd'
			return def
		})
	)

module.exports = {
	definitions: definitions,
	usageSections: [
		{
			header: 'jsdoc-to-md-plugin',
			content:
				'Uses jsdoc2md to generates markdown documentation from jsdoc-annotated source code with separate files for each class.'
		},
		{
			header: 'Synopsis',
			content: [
				{ cmmd: '$ jsdoc2md-plugin <jsdoc-plugin-options>' },
				{ cmmd: '$ jsdoc2md-plugin [bold]{--help}' },
				{ cmmd: '$ jsdoc2md-plugin [bold]{--config}' }
			]
		},
		{
			header: 'General options',
			content:
				'Main options affecting mode. If none of the following are supplied, the tool will generate markdown docs.'
		},
		{
			optionList: jsdoc2mdDefinitions,
			hide: ['no-usage-stats', 'send']
		},
		{
			header: 'dmd',
			content: 'These options affect how the markdown output looks.'
		},
		{
			optionList: definitions,
			group: 'dmd'
		},
		{
			content: [
				{
					col1: 'Project repository:',
					col2: '[underline]{https://github.com/ff0000-ad-tech/jsdoc-to-md-plugin}'
				}
			]
		}
	]
}
