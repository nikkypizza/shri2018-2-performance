var gulp = require(`gulp`);

// ######################## //
// DEVELOPMENT images START //
// ####################### //

var imagemin = require(`gulp-imagemin`);
var webp = require(`gulp-webp`);
var svgstore = require(`gulp-svgstore`);
var rename = require(`gulp-rename`);
var imageminPngquant = require(`imagemin-pngquant`);
var imageminGuetzli = require('imagemin-guetzli');
var cssmin = require(`gulp-csso`);
var run = require(`run-sequence`);
var del = require(`del`);
var uglify = require(`gulp-uglify-es`).default;
var concat = require('gulp-concat');

// Minify png
gulp.task(`pngmin`, () =>
  gulp.src(`assets-source/**/*.png`)
  .pipe(imagemin([
    imageminPngquant({ quality: 65 })
  ]))
  .pipe(gulp.dest(`assets`))
)

// Minify jpg and make them progressive
gulp.task('jpgmin', () =>
  gulp.src('assets-source/**/*.jpg')
  .pipe(imagemin([
    imageminGuetzli({ quality: 85 }),
    imagemin.jpegtran({ progressive: true })
  ]))
  .pipe(gulp.dest('assets'))
);

// Minify SVG
gulp.task(`svgo`, function() {
  gulp.src(`assets-source/svg/*.svg`)
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(`assets/svg`));
});

// Genetare SVG sprite from icons starting with `icon-`
gulp.task(`sprite`, function() {
  gulp.src(`assets-source/svg/icon-*.svg`)
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`assets/svg`));
});

gulp.task(`webp`, function() {
  return gulp.src(`assets-source/**/*.{png,jpg}`)
    .pipe(webp({ quality: 65 }))
    .pipe(gulp.dest(`assets/webp`));
});


// ###################### //
// DEVELOPMENT images END //
// ###################### //


// --------------------------------------------//


// ##### //
// Build //
// ##### //

gulp.task(`copy`, function() {
  return gulp.src([
      `*.html`,
      `favicon.ico`
    ], {
      base: `.`
    })
    .pipe(gulp.dest(`public`));
});

gulp.task(`clean`, function() {
  return del(`public`);
});

gulp.task(`cssmin`, function() {
  gulp.src(`css/style.css`)
    .pipe(cssmin())
    .pipe(gulp.dest(`public/css`));
});

gulp.task(`jsmin`, function() {
  gulp.src(`js/*.js`)
    .pipe(uglify())
    .pipe(concat('scripts-min.js'))
    .pipe(gulp.dest(`public/js`));
});

gulp.task(`build`, function(done) {
  run(`clean`, `copy`, `pngmin`, `jsmin`, `cssmin`, `svgo`, done);
});
