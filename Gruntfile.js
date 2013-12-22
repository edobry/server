module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    ts: {
      options: {
          compile: true,                 // perform compilation. [true (default) | false]
          comments: false,               // same as !removeComments. [true | false (default)]
          target: 'es5',                 // target javascript language. [es3 (default) | es5]
          module: 'amd',                 // target javascript module style. [amd (default) | commonjs]
          sourceMap: false,               // generate a source map for every output js file. [true (default) | false]
          //sourceRoot: 'src',                // where to locate TypeScript files. [(default) '' == source ts location]
          //mapRoot: '',                   // where to locate .map.js files. [(default) '' == generated js location.]
          declaration: true,         // generate a declaration .d.ts file for every output js file. [true | false (default)]
          amdloader: true
      },
      // a particular target
      dev: {
          src: ["src/**/*.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
          //html: ['app/**/**.tpl.html'],  // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
          reference: 'typings/reference.ts', // If specified, generate this file that you can use for your reference management
          //out: 'app/out.js',             // If specified, generate an out.js file which is the merged js file
          outDir: "bin",
          //watch: 'src',                  // If specified, watches this directory for changes, and re-runs the current target
          // use to override the grunt-ts project options above for this target
          options: {
              //module: 'commonjs',
          },
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.registerTask('default', ['ts']);
};