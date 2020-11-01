## 自定义脚手架工作原理

### 脚手架即一个 cli 应用

- 所以需要创建一个 cli 项目

### 使用方式

- 在需要生成文件的目录里, 打开终端, 运行 cli 命令, 通过 cli 交互的方式获得用户输入, cli 程序通过用户输入来替换模板中的数据, 然后写入 cli 运行时的目录

### 作用

- 添加模板代码, 减少重复性工作

---

- 实现步骤
  - `yarn init`
    - 编辑 `package.json`
      - `{ "bin": "cli.js" ,}` // cli app entry file
    - 修改 `cli.js` 文件, 实现 cli 逻辑
  - `yarn link` // 将当前 cli 项目 link 到全局
  - `$ program_1` // 用 `program_1` 运行这个 cli 程序

---

### cli.js 实现思路

- 引入依赖
  - `inquirer`
    - 用来运行 cli 交互的包
  - `ejs`
    - 处理模板文件, 生成替换数据后的模板文件
- 执行`inquirer.prompt()` 来与用户交互, `name` 选项来设置后续存储用户输入的 `key`
- 执行完后获得 `answer` 对象, 存储了用户输入后的结果
- 然后读取 `templates` 目录下所有文件, 遍历文件名, 通过 `ejs.renderFile()` 来处理模板文件, 生成替换数据后的模板文件, 然后通过 `fs.writeFileSync()` 将转换后的结果放入 cli 命令执行时的目录, 实现自动生成模板文件
