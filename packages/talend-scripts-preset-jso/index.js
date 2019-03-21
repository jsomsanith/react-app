const getEslintConfigurationPath = require('./preset-talend-eslint');
const getJestConfigurationPath = require('./preset-talend-jest');
const getBabelConfigurationPath = require('./preset-talend-babel');

module.exports = {
	getEslintConfigurationPath,
	getJestConfigurationPath,
	getBabelConfigurationPath,
	getKarmaConfigurationPath: () => {
		throw new Error('Karma not supported in talend-scripts preset lib');
	},
	getWebpackConfiguration: () => {
		throw new Error('Webpack not supported in talend-scripts preset lib');
	},
};
