# 自动化构建

自动化的转换代码，使之兼容各种平台

- `yarn add sass --dev`
- npm script; commands related to project;
  - `"scripts":{ "build": "sass scss/main.scss css/style.css --watch"}` // watch will stop interacting
  - `yarn build` // run the `build` script
- `yarn add browser-sync --dev`
  - define npm script:
    - `//"preserve": "yarn build"`
    - `"serve": "browser-sync . --files \"css/*.css\""` // auto refresh when files change

* `yarn add npm-run-all --dev` run scripts at the same time
  - `"start": "run-p build serve"`

## common bundle tools

- grunt
- gulp
- fis

### grunt

- `yarn init --yes`
- `yarn add grunt`
- **gruntfile.js** entry // define tasks
- `yarn grunt task_name` // execute tasks
- `yarn grunt --help` // inspect available tasks

```javascript
// Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的对象类型的形参
// grunt 对象中提供一些创建任务时会用到的 API

module.exports = (grunt) => {
  grunt.registerTask("foo", "a sample task", () => {
    console.log("hello grunt");
  });

  grunt.registerTask("bar", () => {
    console.log("other task");
  });

  // // default 是默认任务名称
  // // 通过 grunt 执行时可以省略
  // grunt.registerTask('default', () => {
  //   console.log('default task')
  // })

  // 第二个参数可以指定此任务的映射任务，
  // 这样执行 default 就相当于执行对应的任务
  // 这里映射的任务会按顺序依次执行，不会同步执行
  grunt.registerTask("default", ["foo", "bar"]);

  // 也可以在任务函数中执行其他任务
  grunt.registerTask("run-other", () => {
    // foo 和 bar 会在当前任务执行完成过后自动依次执行
    grunt.task.run("foo", "bar");
    console.log("current task runing~");
  });

  // 默认 grunt 采用同步模式编码
  // 如果需要异步可以使用 this.async() 方法创建回调函数
  // grunt.registerTask('async-task', () => {
  //   setTimeout(() => {
  //     console.log('async task working~')
  //   }, 1000)
  // })

  // 由于函数体中需要使用 this，所以这里不能使用箭头函数
  grunt.registerTask("async-task", function () {
    const done = this.async();

    setTimeout(() => {
      console.log("async task working~");
      done(); // terminal grunt
    }, 1000);
  });

  // return false will ternimate task chain,
  // yarn grunt default --force; use --force to continue even paused
  grunt.registerTask("bad", () => {
    return false;
  });
  grunt.registerTask("bad-async", function () {
    const done = this.async();

    setTimeout(() => {
      done(false);
    }, 1000);
  });
};
```

- config for grunt

```javascript
module.exports = (grunt) => {
  // grunt.initConfig() 用于为任务添加一些配置选项
  grunt.initConfig({
    // 键一般对应任务的名称
    // 值可以是任意类型的数据
    foo: {
      bar: "baz",
    },
  });

  grunt.registerTask("foo", () => {
    // 任务中可以使用 grunt.config() 获取配置
    console.log(grunt.config("foo"));
    // 如果属性值是对象的话，config 中可以使用点的方式定位对象中属性的值
    console.log(grunt.config("foo.bar"));
  });
};
```

- multi-task

```javascript
module.exports = (grunt) => {
  // 多目标模式，可以让任务根据配置形成多个子任务

  // grunt.initConfig({
  //   build: {
  //     foo: 100,
  //     bar: '456'
  //   }
  // })

  // grunt.registerMultiTask('build', function () {
  //   console.log(`task: build, target: ${this.target}, data: ${this.data}`)
  // })

  // config for `build` task
  grunt.initConfig({
    // `build` is task name
    build: {
      // global options
      options: {
        msg: "task options",
      },

      // `foo` is task goal name
      foo: {
        // child options will overwrite global options
        options: {
          msg: "foo target options",
        },
      },

      // `bar` is task goal name
      bar: "456",
    },
  });

  // `build` is task name;
  grunt.registerMultiTask("build", function () {
    console.log(this.options()); // get options configured in initConfig

    console.log(this.target); // `foo` or `bar`
    console.log(this.data); // config object of `foo` or `bar`
  });
};

// `$ yarn grunt build` // run `build` task, `foo` and `bar` both
// `$ yarn grunt build:foo` // run `build` task, `foo` goal only
```

- plugins of grunt
  - `$ yarn add grunt-contrib-clean`
  - use `loadNpmTasks('task_name')` load plugin
  - configure by `initConfig`
  - `$ yran grunt clean` // delete temporary file; configured by initConfig

```javascript
module.exports = (grunt) => {
  grunt.initConfig({
    clean: {
      temp: `temp/app.js`,
      // temp: `temp/*.txt`
      // temp: `temp/**`
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
};
```

- common grunt plugins

```javascript
const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");

module.exports = (grunt) => {
  grunt.initConfig({
    // $ yarn add grunt-sass sass --dev
    // load grunt sass
    // write config below
    // $ yarn grunt sass // to execute task
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      main: {
        files: {
          "dist/css/main.css": "src/scss/main.scss",
        },
      },
    },

    // $ yarn add grunt-babel @babel/core @bable/preset-env --dev
    // $ yarn grunt babel
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      main: {
        files: {
          "dist/js/app.js": "src/js/app.js",
        },
      },
    },

    // $ yarn add grunt-contrib-watch --dev
    // $ yarn grunt watch
    watch: {
      js: {
        files: ["src/js/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/scss/*.scss"],
        tasks: ["sass"],
      },
    },
  });

  // grunt.loadNpmTasks('grunt-sass')

  // $ yarn add load-grunt-tasks --dev
  loadGruntTasks(grunt); // 自动加载所有的 grunt 插件中的任务

  // yarn grunt
  grunt.registerTask("default", ["sass", "babel", "watch"]);
};
```

### gulp

- yarn add gulp --dev
- **gulpfile.js** // configure tasks
- `$ yarn gulp foo` // execue `foo` task configured in `gulpfile.js`

```javascript
// // 导出的函数都会作为 gulp 任务
// exports.foo = () => {
//   console.log('foo task working~')
// }

// gulp 的任务函数都是异步的
// 可以通过调用回调函数标识任务完成
exports.foo = (done) => {
  console.log("foo task working~");

  done(); // 标识任务执行完成
};

// default 是默认任务
// 在运行是可以省略任务名参数
// $ yarn gulp
exports.default = (done) => {
  console.log("default task working~");
  done();
};

// v4.0 之前需要通过 gulp.task() 方法注册任务
const gulp = require("gulp");

gulp.task("bar", (done) => {
  console.log("bar task working~");
  done();
});
```

- 并行 与 串行 任务

```javascript
const { series, parallel } = require("gulp");

const task1 = (done) => {
  setTimeout(() => {
    console.log("task1 working~");
    done();
  }, 1000);
};

const task2 = (done) => {
  setTimeout(() => {
    console.log("task2 working~");
    done();
  }, 1000);
};

const task3 = (done) => {
  setTimeout(() => {
    console.log("task3 working~");
    done();
  }, 1000);
};

// 让多个任务按照顺序依次执行
exports.foo = series(task1, task2, task3);

// 让多个任务同时执行
exports.bar = parallel(task1, task2, task3);
```

- async task

```javascript
const fs = require("fs");

// use `done`
exports.callback = (done) => {
  console.log("callback task");

  done();
};

exports.callback_error = (done) => {
  console.log("callback task");

  // terminate later task
  done(new Error("task failed"));
};

// use `promise`
exports.promise = () => {
  console.log("promise task");

  return Promise.resolve();
};

exports.promise_error = () => {
  console.log("promise task");

  return Promise.reject(new Error("task failed"));
};

// use async
const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

exports.async = async () => {
  await timeout(1000);

  console.log("async task");
};

// use `stream`
exports.stream = () => {
  const read = fs.createReadStream("yarn.lock");
  const write = fs.createWriteStream("a.txt");

  read.pipe(write); // read -> write

  return read; // returned a stream
};

// exports.stream = done => {
//   const read = fs.createReadStream('yarn.lock')
//   const write = fs.createWriteStream('a.txt')
//   read.pipe(write)
//   read.on('end', () => {
//     done()
//   })
// }
```

- gulp internal theory

```javascript
const fs = require("fs");
const { Transform } = require("stream");

exports.default = () => {
  // 文件读取流
  const readStream = fs.createReadStream("normalize.css");

  // 文件写入流
  const writeStream = fs.createWriteStream("normalize.min.css");

  // 文件转换流
  const transformStream = new Transform({
    // 核心转换过程
    transform: (chunk, encoding, callback) => {
      // chunk: content of sream
      const input = chunk.toString();
      // remove spaces, comments
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");

      const errorObj = null;
      callback(errorObj, output);
    },
  });

  return readStream
    .pipe(transformStream) // 转换
    .pipe(writeStream); // 写入
};
```

- file operation api & plugins
```javascript
const { src, dest } = require("gulp");
// plugin: $ yarn add gulp-clean-css --dev
const cleanCSS = require("gulp-clean-css");
// pulgin: $ yarn add gulp-rename --dev
const rename = require("gulp-rename");

exports.default = () => {
  return src("src/*.css")
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("dist"));
};
```

- demo
