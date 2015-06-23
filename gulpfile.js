var	gulp 				= require('gulp'),
		sass 				= require('gulp-sass'),
		concat 			= require('gulp-concat'),
		watch 			= require('gulp-watch'),
		plumber 			= require('gulp-plumber'),
		minify_css 		= require('gulp-minify-css'),
		uglify 			= require('gulp-uglify'),
		sourcemaps 		= require('gulp-sourcemaps'),
		notify	 		= require('gulp-notify'),
		prefix		 	= require('gulp-autoprefixer')
		imagemin 		= require('gulp-imagemin'),
		jshint		   = require('gulp-jshint'),
		pngquant 		= require('imagemin-pngquant'),
		browserSync		= require('browser-sync');

//--------------------------------------------------------------
// VARIABLES DE DESTINO PARA SASS Y JS
//--------------------------------------------------------------

//preprocessor

var src = {
	sass: "src/sass/**/*.scss",
	js: 	"src/js/**/*.js",
	img: 	"src/img/*"
};

//OUTPUT

var output = {
	js: 			"output/js",
	css: 			"output/css",
	img: 			"output/img",
	html: 		"output/**/*.html",
	min_css: 	'app.min.css',
	min_js: 		'app.min.js',
	dev_css: 	'app.css'
};
	 
//--------------------------------------------------------------
// Gulp plumber error handler
//--------------------------------------------------------------

var onError = function(err) {
	console.log(err);
   this.emit('end');
}

//--------------------------------------------------------------
//  SASS TO CSS
//--------------------------------------------------------------

gulp.task('sass', function() {

	return gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write({includeContent: false}))
		.pipe(prefix('last 2 versions'))
		.pipe(concat(output.min_css))
		.pipe(gulp.dest(output.css))
		.pipe(minify_css())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(output.css))
		//.pipe(notify({message: "hello world are done"}))
		.pipe(browserSync.reload({stream: true}));
});
asdad
//--------------------------------------------------------------
//  COMPILE JS
//--------------------------------------------------------------

gulp.task('js', function() {

	return gulp.src(src.js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('output.min_js'))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js));
});

//--------------------------------------------------------------
// IMAGES
//--------------------------------------------------------------

gulp.task('img', function() {
	return gulp.src(src.img)
		.pipe(imagemin({
			prefressive: true,
			svgplugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(output.img));
});


//--------------------------------------------------------------
// WATCH 
//--------------------------------------------------------------

gulp.task('watch', function() {
	browserSync.init({
		server: "./output"
	});
	gulp.watch(src.js, ['js']);
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.img, ['img']);
	gulp.watch(output.html).on("change", browserSync.reload);
});

//--------------------------------------------------------------
// DEFAULT
//--------------------------------------------------------------

gulp.task('default', ['watch', 'sass', 'js', 'img']);

