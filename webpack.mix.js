//const { mix } = require("laravel-mix/src/File");

//mix.js('resources/js/app.js','public/js/app.js').sass('resources/scss/app.scss','public/css/app.css');

let mix = require('laravel-mix');

//mix.js('resources/js/app.js','public/js/app.js').sass('resources/scss/app.scss','public/css/app.css');

mix.js('resources/js/app.js','public/js/app.js').sass('resources/scss/app.scss','public/css/app.css');
//mix.sass('resources/scss/app.scss','public/css/app.css').setPublicPath('public/css/app.css');