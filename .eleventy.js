const fs = require('fs')
const { data } = require('autoprefixer')
const htmlmin = require('html-minifier')
const env = require('dotenv').config()
const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster')

module.exports = (eleventyConfig) => {
  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform('htmlmin', htmlminTransform)
  } else {
    eleventyConfig.setBrowserSyncConfig({
      callbacks: { ready: browserSyncReady },
    })
  }

  // Eleventy plugin cache buster
  // A plugin for eleventy which adds a unique query parameter to css and js resources
  const cacheBusterOptions = {
    createResourceHash(outputDirectoy, url, target) {
      return Date.now()
    },
  }
  eleventyConfig.addPlugin(cacheBuster(cacheBusterOptions))
  // /Eleventy plugin cache buster

  // SHORTCODES
  // THUMB from CLoudinary
  eleventyConfig.addShortcode(
    'image',
    (src, className, title, figcaption, width, height) => {
      let classNameValue = className ? `class="${className}"` : ''
      let widthValue = width ? `width="${width}px"` : ''
      let heightValue = height ? `height="${height}px"` : ''
      let titleValue = title ? title : ' '
      let figcaptionValue = figcaption
        ? `<figcaption>${figcaption}</figcaption>`
        : '<figcaption class="hidden"></figcaption>'
      let cloudinary = src.replace(new RegExp('/image/upload/.*', 'g'), '')
      let path = src.replace(new RegExp('.*/image/upload/', 'g'), '')

      return `<picture ${classNameValue}>
							<img src="${cloudinary}/q_auto,f_auto/${path}" alt="${titleValue}" loading="lazy" ${widthValue} ${heightValue}>
							${figcaptionValue}
						</picture>`
    }
  )
  // /THUMB
  // /SHORTCODES
  // Display tag list on page
  eleventyConfig.addCollection('tagsList', function (collectionApi) {
    const tagsList = new Set()
    collectionApi.getAll().map((item) => {
      if (item.data.tags) {
        // handle pages that don't have tags
        item.data.tags
          .filter((tag) => !['posts'].includes(tag))
          .map((tag) => tagsList.add(tag))
      }
    })

    // console.log(tagsList)

    return tagsList
  })

  // Passthrough
  eleventyConfig.addPassthroughCopy({ 'src/pages/**': '/' })
  eleventyConfig.addPassthroughCopy({ 'src/js/**': '/js/' })
  eleventyConfig.addPassthroughCopy({
    'node_modules/swiper/swiper-bundle.min.css': '/css/swiper-bundle.min.css',
  })
  eleventyConfig.addPassthroughCopy({
    'node_modules/swiper/swiper-bundle.min.js': '/js//swiper-bundle.min.js',
  })
  eleventyConfig.addPassthroughCopy({ 'src/images/**': '/images/' })

  // Watch targets
  // eleventyConfig.addWatchTarget('./src/css/*')
  eleventyConfig.addWatchTarget('./src/css/tailwind.config.js')
  // eleventyConfig.addWatchTarget('./styles/tailwind.css')

  return {
    addPassthroughFileCopy: true,
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'components',
      layouts: 'layouts',
      data: 'data',
    },
  }
}

function browserSyncReady(err, bs) {
  bs.addMiddleware('*', (req, res) => {
    const content_404 = fs.readFileSync('dist/404.html')
    // Provides the 404 content without redirect.
    res.write(content_404)
    // Add 404 http status code in request header.
    // res.writeHead(404, { "Content-Type": "text/html" });
    res.writeHead(404)
    res.end()
  })
}

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith('.html')) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    })
    return minified
  }
  return content
}
