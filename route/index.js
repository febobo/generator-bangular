'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('underscore.string');

var utils = require('../util');

var BangularGenerator = yeoman.generators.NamedBase.extend({

  initializing: function () {
    this.appName = _.camelize(this.appname);
    this.controllerName = _.capitalize(_.camelize(this.name)) + 'Ctrl';
    this.dashName = _.dasherize(this.name);
  },

  prompting: function () {
    var self = this;
    var done = self.async();
    self.prompt([{
      type: 'input',
      name: 'route',
      message: 'Choose an url route',
      default: '/' + self.dashName
    }, {
      type: 'confirm',
      name: 'import',
      message: 'Do you want to create and import the ' + chalk.blue(this.dashName + '.scss') + ' style in your app.scss?',
      default: false
    }], function (props) {
      self.route = props.route;
      self.import = props.import;
      done();
    });
  },

  writing: function () {

    var basePath = 'client/views/' + this.dashName + '/' + this.dashName;

    this.template('index.js', basePath + '.js');
    this.template('controller.js', basePath + '.controller.js');
    this.template('view.html', basePath + '.html');

    var filters = this.config.get('filters');

    if (filters && filters.karma) {
      this.template('spec.js', basePath + '.spec.js');
    }
    if (filters && filters.e2e) {
      this.template('e2e.js', basePath + '.e2e.js');
    }

    if (this.import) {

      this.template('style.scss', basePath + '.scss');

      setTimeout(function () {

        utils.appendNeedleOrOnTop({
          needle: '// imports',
          file: 'client/styles/app.scss',
          append: '@import "../views/' + this.dashName + '/' + this.dashName + '";'
        }, function importCallback (err) {
          /* istanbul ignore if */
          if (err) {
            utils.bangLog('There was an error importing the style.', 'red');
          } else {
            utils.bangLog('Your style was successfully injected.', 'green');
          }
        });

      }.bind(this), 250);

    }

  }

});

module.exports = BangularGenerator;
