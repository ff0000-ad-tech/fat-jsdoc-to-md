var Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
	var bool = false
	switch (operator) {
		case '==':
			bool = v1 == v2
			break
		case '===':
			bool = v1 === v2
			break
		case '!=':
			bool = v1 != v2
			break
		case '!==':
			bool = v1 !== v2
			break
		case '<':
			bool = v1 < v2
			break
		case '<=':
			bool = v1 <= v2
			break
		case '>':
			bool = v1 > v2
			break
		case '>=':
			bool = v1 >= v2
			break
		case '&&':
			bool = v1 && v2
			break
		case '||':
			bool = v1 || v2
			break
	}
	return bool ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper({
	'===': (v1, v2) => v1 === v2,
	'==': (v1, v2) => v1 == v2,
	'!==': (v1, v2) => v1 !== v2,
	'!=': (v1, v2) => v1 != v2,
	'<': (v1, v2) => v1 < v2,
	'>': (v1, v2) => v1 > v2,
	'<=': (v1, v2) => v1 <= v2,
	'>=': (v1, v2) => v1 >= v2,
	// keep as non-arrow functions to maintain scoped for arguments
	'&&': function() {
		return Array.prototype.slice.call(arguments).every(Boolean)
	},
	'||': function() {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
	}
})
