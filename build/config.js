var entryFileName = 'main';

module.exports = {
	entryFileName: entryFileName,
	buildDirName: 'dist',
	// watchFile: '../dist/static/js/main.js',
	watchFile: '../dist/static/js/' + entryFileName + '.js',
	socketServerPort: 8080,
	dev: {
		cdnSrc: 'http://localhost'
	},
	prod: {
		cdnSrc: 'http://xx.xx.com'
	}
}
