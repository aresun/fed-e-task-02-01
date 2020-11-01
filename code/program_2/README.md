## grunt 构建原理

---

### 实现步骤

- 安装开发依赖

  - `grunt-sass` `sass`
  - `grunt-bable` `@babel/core` `@babel/preset-env`
  - `grunt-contrib-watch`
  - `load-grunt-tasks`

- 编写 `gruntfile.js` 文件, 为 grunt 添加任务

  - 首先通过 `grunt.initConfig()` 配置 grunt 插件选项, 为后续任务提供配置
  - 然后通过 `loadGruntTasks(grunt)` 来加载所有安装好的 grunt 插件任务
  - 最后通过 `grunt.registerTask("default", [...])` 注册 默认任务, 里面的数组参数为 task name 数组

- 运行 `$ yarn grunt` 来执行 `default` 任务
  - 首先执行 `sass`, `bable` 任务, 然后开启 `watch` 监听任务
