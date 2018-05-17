const del = require("del");
const gulp = require("gulp");
const sequence = require("gulp-sequence");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));
});

gulp.task("clean", function() {
  return del(['dist/**/*', '!dist/.gitkeep']);
});

gulp.task("watch", function() {
  gulp.watch("src/**/*", ["build"]);
});

gulp.task("default", sequence('clean', 'build'));
