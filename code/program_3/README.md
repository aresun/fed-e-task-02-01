## grunt 构建原理

---

### 实现步骤

- 安装开发依赖

  - `del`
  - `browser-sync`
  - `gulp-load-plugins`
  - `gulp-sass`
  - `gulp-babel`, `@babel/core`, `@babel/preset-env`
  - `gulp-swig`
  - `gulp-imagemin`
  - `gulp-useref`, `gulp-if`, `gulp-htmlmin`, `gulp-uglify`, `gulp-clean-css`

- 编写 `gulpfile.js` 文件, 为 gulp 添加任务

  - 首先引入需要的模块
  - 定义 `data`, 用于模板变量
  - 通过 `loadPlugins()` 自动加载安装好的 gulp plugins
  - 定义 `clean` 任务
    - 用于清除 `dist`, `temp` 目录
  - 定义 `style` 任务
    - 通过 `sass` plugin 将 所有 sass 文件转化成 css 文件
  - 定义 `script` 任务
    - 使用 `babel` 转换 ES6 代码
  - 定义 `page` 任务
    - 使用 `swig` plugin 将 `src/` 下的 `.html` 模板文件转换成浏览器可用的 `.html` 文件, 传入之前定义的 `data` 作为模板参数
  - 定义 `image`, `font` 任务
    - 使用 `imagemin` 插件压缩 图片和 字体 文件
  - 定义 `extra` 任务
    - 直接将 `public/` 下所有文件拷贝至 `dist/` 下
  - 定义 `serve` 任务
    - 监听 `src` 目录下的 scss, js, html 文件变化, 改变时触发对应文件的构建任务
    - 监听 图片, 字体, public 目录, 触发浏览器刷新
    - 通过 `bs.init(options)` 配置开发 server
  - 定义 `useref` 任务
    - 使用 `useref` plugin 来将引用注释内的引用替换到合并后的对应的路径
    - 通过 `if` plugin 判断文件类型, 使用对应处理 plugin
  - 定义 `clean`, `build`, `develop` 三个任务
    - `build` 任务, 先 执行 `clean`, 清除之前生成的文件, 然后并发执行 `series(compile, useref), image, font, extra`, `compile` 任务生成后需要 `useref` 变更引用, 所以使用 `series` 将这 2 个任务串联
    - `develop` 任务, 执行 `complie` 任务后, 开启开发任务 `serve`

- 使用
  - 运行 `$ yarn gulp task_name` 来执行 `task_name` 任务
    - `task_name` 包含, `clean`, `build`, `develop` 三个任务
