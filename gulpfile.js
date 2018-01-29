var gulp = require("gulp");
var browsersync = require("browser-sync");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var pug = require("gulp-pug");
var notify = require("gulp-notify");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var gulpif = require("gulp-if");
var emittypug = require("emitty").setup("src/pug", "pug");
var emittysass = require("emitty").setup("src/sass", "sass");

var jsLibsPaths = [""];

var watchList = [
  "sass",
  "js",
  "pug",
  //"jslibs",
  "browsersync"
];

var buildList = [
  "cleanbuild",
  "sass",
  "js",
  "pug",
  // "jslibs",
  "imagemin"
];

gulp.task("browsersync", function() {
  return browsersync({
    server: { baseDir: "dev" },
    // index: "main.html",
    notify: false
  });
});

gulp.task("sass", function() {
  return gulp
    .src([
      "src/sass/**/*.sass",
      "!src/sass/**/_*.sass",
      "src/sass/**/*.scss",
      "!src/sass/**/_*.scss"
    ])
    .pipe(gulpif(global.watch, emittysass.stream()))
    .pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(gulp.dest("dev/css"))
    .pipe(browsersync.reload({ stream: true }));
});

gulp.task("pug", function() {
  return gulp
    .src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
    .pipe(gulpif(global.watch, emittypug.stream()))
    .pipe(pug({ pretty: true }).on("error", notify.onError()))
    .pipe(gulp.dest("dev/"))
    .pipe(browsersync.reload({ stream: true }));
});

gulp.task("js", function() {
  return (gulp
      .src("src/js/main.js")
      .pipe(uglify())
      //.pipe(concat("main.min.js"))
      .pipe(gulp.dest("dev/js"))
      .pipe(browsersync.reload({ stream: true })) );
});

// gulp.task("jslibs", function() {
//   return gulp
//     .src(jsLibsPaths)
//     .pipe(uglify())
//     .pipe(concat("lib.min.js"))
//     .pipe(gulp.dest("dev/js"))
//     .pipe(browsersync.reload({stream: true}));
// });

gulp.task("imagemin", function() {
  return gulp
    .src("src/img/**/*")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dev/img"));
});

gulp.task("watch", watchList, function() {
  global.watch = true;
  gulp.watch("src/sass/**/*.sass", ["sass"]);
  gulp.watch("src/js/main.js", ["js"]);
  // gulp.watch(jsLibsPaths,["jslibs"]);
  gulp.watch("src/pug/**/*.pug", ["pug"]);
  // gulp.watch("dev/**/*.html", browsersync.reload);
});

gulp.task("build", buildList, function() {
  var buildCss = gulp.src("dev/css/**/*.css").pipe(gulp.dest("build/css"));

  var buildHtml = gulp.src("dev/**/*.html").pipe(gulp.dest("build/"));

  var buildJs = gulp.src("dev/js/**/*.js").pipe(gulp.dest("build/js"));

  var buildImgs = gulp.src("dev/img/**/*").pipe(gulp.dest("build/img"));

  var buildFonts = gulp.src("src/fonts/**/*").pipe(gulp.dest("build/fonts"));
});

gulp.task("cleanbuild", function() {
  return del.sync([
    "build/**/*",
    "!build/README.md",
    "!build/CNAME",
    "!build/.git",
    "!build/.gitignore"
  ]);
});

gulp.task("cleancache", function() {
  return cache.clearAll();
});

gulp.task("default", ["watch"]);
