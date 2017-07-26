'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const validate = require('validate-element-name');
const path = require('path');

const templates = {
  app: {
    description: 'a standalone application template',
    defaultName: 'my-app'
  },
  element: {
    description: 'a reusable element template',
    defaultName: 'my-element'
  },
  'hello-world': {
    description: 'an example element to get you started',
    defaultName: 'hello-world',
    type: 'example'
  },
  'hello-ajax': {
    description: 'an example element using async ajax',
    defaultName: 'hello-ajax',
    type: 'example'
  }
};

// !! TODO !!
// Include common files
// Const common = {
//   travis: [
//     '.travis.yml'
//   ],
//   docker: [
//     'Dockerfile',
//     'Dockerfile.test',
//     'docker-compose.yml',
//     'docker-compose-test.yml'
//   ]
// };

const getProjectName = () => {
  const dir = process.cwd();
  const name = dir.split('\\').pop();
  return name;
};

const validateProjectName = name => {
  const validity = validate(name);
  if (validity.isValid) {
    return true;
  }
  return validity.message;
};

const getTemplateChoices = templates => {
  let list = [];
  for (let template in templates) {
    if (template) {
      list.push(template + ' : ' + templates[template].description);
    }
  }
  return list;
};

const getTemplateNameFromAnswer = answer => {
  const name = answer.split(' ')[0];
  return name;
};

const getTemplateTypeFromAnswer = answer => {
  const name = answer.split(' ')[0];
  const type = templates[name].type ? templates[name].type : name;
  return type;
};

const getTemplateDefault = answer => {
  const name = answer.split(' ')[0];
  const defaultName = templates[name].defaultName ? templates[name].defaultName : '';
  return defaultName;
};

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      required: false
    });

    this.argument('template', {
      type: String,
      required: false,
      default: getTemplateTypeFromAnswer(Object.keys(templates)[0])
    });

    // Exit if name is invalid
    const name = this.options.name;
    if (name) {
      const validity = validateProjectName(name);
      if (validity !== true) {
        this.log(chalk.red(validity));
        process.exit(1);
      }
    }

    // Exit if template is invalid
    const template = this.options.template;
    if (!templates[template]) {
      const types = Object.keys(templates).join(', ');
      this.log(chalk.red(`Template "${template}" does not exist. Select either ${types}.`));
      process.exit(1);
    }
  }

  prompting() {
    // Exit if arguments were set
    if (this.options.name) {
      // Respond
      const type = getTemplateTypeFromAnswer(this.options.template);
      this.log(chalk.whiteBright(`Creating your ${chalk.green(type)} named ${chalk.green(this.options.name)}...`));
      // Set properties from options
      this.props = this.props || {};
      this.props.name = this.options.name;
      this.props.template = this.options.template;
      this.props.installDependencies = Boolean(!this.options.skipInstall);
      this.props.confirm = true;
      return true;
    }

    this.log(yosay(
      'Welcome to the ' + chalk.green('wc-kickstart') + ' generator!'
    ));

    const prompts = [
      {
        type: 'rawlist',
        name: 'type',
        message: 'Which template would you like to kickstart?',
        choices: getTemplateChoices(templates)
      },
      {
        type: 'input',
        name: 'name',
        message: answers => {
          const projectType = getTemplateTypeFromAnswer(answers.type);
          return `What should your ${projectType} be called?`;
        },
        validate: validateProjectName,
        default: answers => {
          const name = getProjectName();
          const validity = validateProjectName(name);
          let defaultName = null;
          if (validity === true) {
            defaultName = name;
          } else {
            defaultName = getTemplateDefault(answers.type);
          }
          return defaultName;
        }
      },
      {
        type: 'confirm',
        name: 'createDirectory',
        message: answers => {
          return `Would you like me to create the project directory '/${answers.name}'`;
        },
        when: answers => {
          let currentDir = process.cwd();
          let currentFolderName = currentDir.match(/([^\\]*)\\*$/)[1];
          return currentFolderName !== answers.name;
        },
        default: true
      },
      {
        type: 'confirm',
        name: 'installDependencies',
        message: 'Would you like me to install the required npm & bower dependencies?',
        default: true
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: answers => {
          let type = getTemplateTypeFromAnswer(answers.type);
          let currentDir = process.cwd();
          let installDir = answers.createDirectory ? currentDir + '\\' + answers.name : currentDir;
          return `Install ${type} in '${installDir}'?`;
        },
        default: true
      }
    ];

    return this.prompt(prompts).then(answers => {
      this.props = {
        template: getTemplateNameFromAnswer(answers.type),
        name: answers.name,
        installDependencies: answers.installDependencies,
        createDirectory: answers.createDirectory,
        confirm: answers.confirm
      };
    });
  }

  writing() {
    const name = this.props.name;
    const template = this.props.template;
    const createDirectory = this.props.createDirectory;
    const confirm = this.props.confirm;

    // Exit if not confimed
    if (!confirm) {
      this.log(chalk.whiteBright(('\r\nExiting generator...')));
      process.exit();
    }

    // Update destinationPath
    if (createDirectory) {
      let directory = path.join(process.cwd(), name);
      this.destinationRoot(directory);
    }

    // Set the root to the selected template
    this.sourceRoot(this.templatePath(template));

    // Copy everything but underscore (ejs template) files
    this.fs.copyTpl(
      `${this.templatePath()}/**/!(_)*`,
      this.destinationPath(),
      this.props
    );

    // Copy gitignore
    // NOTE: yo doesn't want to copy dot files from templates
    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath(`.gitignore`)
    );

    // Copy and rename main file
    if (template === 'app') {
      this.fs.copyTpl(
        this.templatePath('src/_name.html'),
        this.destinationPath(`src/${name}.html`),
        this.props
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('_name.html'),
        this.destinationPath(`${name}.html`),
        this.props
      );
    }

    // Copy and rename test file
    this.fs.copyTpl(
      this.templatePath('test/_name.html'),
      this.destinationPath(`test/${name}.html`),
      this.props
    );
  }

  install() {
    const installDependencies = this.props.installDependencies;

    if (installDependencies) {
      this.installDependencies();
    }
  }

};
