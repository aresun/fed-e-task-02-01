#!/usr/bin/env node
// this make it a cli entry

const fs = require("fs");
const path = require("path");

// $ yarn add inquirer
const inquirer = require("inquirer");
// $ yarn add ejs
const ejs = require("ejs");

// `inquirer` is used for cli interaction
inquirer
  .prompt([
    {
      type: "input",
      name: "name", // key in answer
      message: "Project name?",
    },
  ])
  .then((answer) => {
    // console.log(answer);

    const dir_of_templates_files = path.join(__dirname, "templates");
    const dir_of_destination = process.cwd(); // cwd(), 当前 cmd 执行目录

    fs.readdir(dir_of_templates_files, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const file_path_of_template = path.join(dir_of_templates_files, file);
        const file_path_of_destination = path.join(dir_of_destination, file);
        const template_data = answer;

        ejs.renderFile(file_path_of_template, template_data, (err, result) => {
          if (err) throw err;

          fs.writeFileSync(file_path_of_destination, result);
        });
      });
    });
  });
