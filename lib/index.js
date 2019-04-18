'use strict'
const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')
const path = require('path')

function createFromClasses(outputDir, hbs) {
	console.log('createFromClasses()', outputDir, hbs)

	// const outputDocsDir = outputDir + 'docs'
	// if (!fs.existsSync(outputDocsDir)) {
	// 	fs.mkdirSync(outputDocsDir)
	// }

	// // input and output paths
	// const inputFiles = outputDir + 'lib/*.js'
	// const config = __dirname + '/config.jsdoc.json'

	// get template data
	// const templateData = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: config })

	const { outputDocsDir, inputFiles, config, templateData } = setup(outputDir)

	// reduce templateData to an array of class names
	const classNames = templateData.reduce((classNames, identifier) => {
		if (identifier.kind === 'class') classNames.push(identifier.name)
		return classNames
	}, [])

	// create a documentation file for each class
	for (const className of classNames) {
		const template = `{{#class name="${className}"}}{{>docs}}{{/class}}`
		// console.log(`rendering ${className}, template: ${template}`)
		const output = jsdoc2md.renderSync({ data: templateData, template: template })
		fs.writeFileSync(path.resolve(outputDocsDir, `${className}.md`), output)
	}

	// create the main README
	fs.readFile(hbs, (err, data) => {
		// fs.readFile(`${__dirname}/../templates/${hbs}`, (err, data) => {
		if (err) return console.error(err)
		// const templateDataMain = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: config })
		// TODO - abstract out the header, make module name a variable
		console.log(data.toString())
		const output = jsdoc2md.renderSync({
			data: templateData, //templateDataMain,
			template: data.toString()
		})

		const mergeLinkToHeader = output.replace(/(<a\sname=")(.*)(">)(<\/a>)([^#])+(##.+)/gm, (full, a, b, c, d) => {
			return '## ' + a + b + '" href="./docs/' + b + '.md' + c + b + d
		})

		// use to simply remove the links
		// const delink = removeVisibleHeader.replace(/(\[)([^\]]+)(\]\(#[^\)]+\))/g, (full, a, b, c) => b)

		// use to convert links from page scroll to nav to other md files
		const relink = mergeLinkToHeader.replace(/(\[)([^\]]+)(\]\(#([^\)]+)\))/g, (full, a, b, c, d) => {
			// split to see if it is a method or property
			const split = d.split('.')
			return split.length > 1 ? `<a href="./docs/${split[0]}.md#${d}">${b}</a>` : b
		})

		fs.writeFileSync(path.resolve(outputDir, `README.md`), relink) // delink)
	})
}

function setup(outputDir) {
	const outputDocsDir = outputDir + 'docs'
	if (!fs.existsSync(outputDocsDir)) {
		fs.mkdirSync(outputDocsDir)
	}

	// input and output paths
	const inputFiles = [outputDir + 'index.js', outputDir + 'lib/*.js']
	const config = __dirname + '/../config.jsdoc.json'

	// get template data
	const templateData = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: config })

	return { outputDocsDir, inputFiles, config, templateData }
}

function createFromPackage(outputDir, hbs) {
	console.log('createFromPackage()', outputDir, hbs)
	const { outputDocsDir, inputFiles, config, templateData } = setup(outputDir)
	console.log(outputDocsDir)
	console.log(inputFiles)
	console.log(config)

	// create the main README
	fs.readFile(hbs, (err, data) => {
		if (err) return console.error(err)
		// const templateDataMain = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: config })
		// console.log('helper:', __dirname + '/helper.js')
		const output = jsdoc2md.renderSync({
			data: templateData,
			template: data.toString(),
			helper: __dirname + '/helper.js'
		})

		fs.writeFileSync(path.resolve(outputDir, `README.md`), output)
	})
}

module.exports = {
	createFromClasses,
	createFromPackage
}
// store former script

// ad-geom => package of classes
// "jsdoc2md --template md/README.hbs -c md/.jsdoc.json --no-cache --files index.js lib/* > README.md"

// ad-useragent => package of files with exported methods
// "jsdoc2md --template md/README.hbs -c md/.jsdoc.json --no-cache --helper md/helper.js --files index.js lib/* > README.md"
