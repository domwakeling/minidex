const beautify_html = require("js-beautify").html;
const sass = require('sass');
const CleanCSS = require("clean-css");

const codeblocks = require('@code-blocks/eleventy-plugin');
const charts = require('@code-blocks/charts');

module.exports = function (eleventyConfig) {

    eleventyConfig.addTransform("minimiseCSS", function (content, outputPath) {
        if (outputPath.endsWith(".css")) {
            return new CleanCSS({}).minify(content).styles;
        }
        return content;
    })

    // filter to convert SASS to CSS
    eleventyConfig.addNunjucksFilter("convertSASS", function (value) {
        return sass.renderSync({ data: value }).css.toString()
    });

    // filter to stringify JSON
    eleventyConfig.addNunjucksFilter("stringify", function (value) {
        return JSON.stringify(value);
    });

    // copy the images folder
    eleventyConfig.addPassthroughCopy("src/images");

    // copy from src/_includes/favicons to the root
    eleventyConfig.addPassthroughCopy({ "src/_includes/favicons": "." });

    // add a new shortcode to return a copyright period string
    eleventyConfig.addNunjucksShortcode("copyrightString", () => {
        const year = new Date().getFullYear();
        return "2021" + ( year === 2021 ? "" : "&mdash;" + year );
    });
    
    // charts plugin
    eleventyConfig.addPlugin(codeblocks([charts]));

    // beautify HTML files when output => ensures indentation is correct
    eleventyConfig.addTransform("beautifyHTML", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return beautify_html(content);
        }
        return content;
    });

    // because we're making a function we need to return the "normal" exports object
    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};