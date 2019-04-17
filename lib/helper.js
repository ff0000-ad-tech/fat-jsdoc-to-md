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
