module.exports = function(eleventyConfig) {
  // Copy assets directory to output
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy any other static files you might add
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Watch CSS files for changes in serve mode
  eleventyConfig.addWatchTarget("src/assets/css/");
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};