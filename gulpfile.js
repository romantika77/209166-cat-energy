"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  });

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
    ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/*.svg")
    .pipe(svgstore({
    inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
    include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"]);
});


gulp.task("build", function(done) {
  run("style", "sprite", "html", done);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
    ], {
    base: "source"
    })
    .pipe(gulp.dest("build"));
});

// таск для удаления
gulp.task("clean", function () {
  return del("build");
});

gulp.task("html:copy", function() {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

// таск запуска
gulp.task("build", function (done) {
  run(
  "clean",
  "copy",
  "style",
  "webp",
  "sprite",
  "html",
  done
  );
});


// "use strict";

// var gulp = require("gulp");
// var less = require("gulp-less");
// var plumber = require("gulp-plumber");
// var postcss = require("gulp-postcss");
// var autoprefixer = require("autoprefixer");
// var server = require("browser-sync").create();
// var minify = require("gulp-csso");
// var rename = require("gulp-rename");
// var imagemin = require("gulp-imagemin");
// var webp = require("gulp-webp");
// var svgstore = require("gulp-svgstore");
// var posthtml = require("gulp-posthtml");
// var include = require("posthtml-include");
// var run = require("run-sequence");
// var del = require("del");

// var onError = function (err) {
// console.log(err);
// };

// gulp.task("serve", function() {
//   server.init({
//     server: "build/",
//     notify: false,
//     open: true,
//     cors: true,
//     ui: false
//   });

//   gulp.watch("source/less/**/*.less", ["style"]);
//   gulp.watch("source/*.html", ["html"]).on("change", server.reload);
// });

// gulp.task("copy", function() {
//   return gulp.src([
//     "source/fonts/**/*.{woff,woff2}",
//     "source/img/**",
//     "source/js/**"
//     ], {
//       base: "source"
//     })
//     .pipe(gulp.dest("build"));
//   });

// gulp.task("clean", function() {
//   return del("build");
//   });

// gulp.task("style", function() {
//   gulp.src("source/less/style.less")
//     .pipe(plumber(
//       {
//     errorHandler: onError
//     }))
//     .pipe(less())
//     .pipe(postcss([
//       autoprefixer()
//     ]))
//     .pipe(gulp.dest("build/css"))
//     .pipe(minify())
//     .pipe(rename("style.min.css"))
//     .pipe(gulp.dest("build/css"))
//     .pipe(server.stream());
// });

// gulp.task("sprite", function() {
//   return gulp.src("source/img/icon-*.svg")
//     .pipe(svgstore({
//       inlineSvg: true
//     }))
//     .pipe(rename("sprite.svg"))
//     .pipe(gulp.dest("build/img"));
//   });

// gulp.task("images", function() {
//   return gulp.src("build/img/**/*.{png,jpg,svg}")
//     .pipe(imagemin([
//       imagemin.optipng({optimizationLevel: 3}),
//       imagemin.jpegtran({progressive: true}),
//       imagemin.svgo()
//       ]))

//   .pipe(gulp.dest("build/img"));
//   });

// gulp.task("webp", function() {
//   return gulp.src("build/img/**/*.{png,jpg}")
//     .pipe(webp({quality: 90}))
//     .pipe(gulp.dest("build/img"));
//   });

// gulp.task("html", function() {
//   return gulp.src("source/*.html")
//     .pipe(posthtml([
//       include()
//     ]))
//     .pipe(gulp.dest("build"));
//   });

// gulp.task("build", function(done) {
//   run(
//     "clean",
//     "copy",
//     "style",
//     "sprite",
//     "webp",
//     "html",
//     done
//     );
//   });
