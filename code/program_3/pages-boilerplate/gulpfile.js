// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require("gulp");

// $ yarn add del --dev
const del = require("del");
// $ yarn add browser-sync --dev
const browserSync = require("browser-sync");
const bs = browserSync.create();

// $ yarn add gulp-load-plugins --dev
const loadPlugins = require("gulp-load-plugins");
// load all gulp plugins
const plugins = loadPlugins();

const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

const clean = () => {
  return del(["dist", "temp"]);
};

const style = () => {
  // `base`: output path remained form `src`
  return (
    src("src/assets/styles/*.scss", { base: "src" })
      // $ yarn add gulp-sass --dev
      .pipe(plugins.sass({ outputStyle: "expanded" }))
      .pipe(dest("temp"))
      .pipe(bs.reload({ stream: true }))
  );
};

const script = () => {
  return (
    src("src/assets/scripts/*.js", { base: "src" })
      // $ yarn add gulp-babel --dev
      // $ yarn add @babel/core @babel/preset-env --dev
      .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
      .pipe(dest("temp"))
      .pipe(bs.reload({ stream: true }))
  );
};

const page = () => {
  // $ yarn add gulp-swig --dev // template plugin
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const image = () => {
  return (
    src("src/assets/images/**", { base: "src" })
      // $ yarn add gulp-imagemin --dev
      .pipe(plugins.imagemin())
      .pipe(dest("dist"))
  );
};

const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**', // if dist/**  files change, server will auto refresh page to update page
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        // herf reference `/node_modules` to `node_modules`
        "/node_modules": "node_modules",
      },
    },
  });
};

const useref = () => {
  return (
    src("temp/*.html", { base: "temp" })
      // $ yarn add gulp-useref --dev
      // replace references by comments in basic.html
      // `searchPath`: search path of source reference
      // /node_modules from ./
      // assets from temp/
      // after useref task, references of js, css will be combined
      .pipe(plugins.useref({ searchPath: ["temp", "."] }))
      // html js css
      // $ yarn add gulp-htmlmin gulp-uglify gulp-clean-css --dev
      // $ yarn add gulp-if --dev
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest("dist"))
  );
};

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const develop = series(compile, serve);

module.exports = {
  clean,
  build,
  develop,
};
