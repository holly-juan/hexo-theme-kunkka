// Code from http://stackoverflow.com/a/4673436
// Example: printf('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
// Result: "ASP is dead, but ASP.NET is alive! ASP {2}"

hexo.extend.helper.register('printf',function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
});


// The default toc() helper does not escape correctly
'use strict';

var cheerio;
var escapeHtml = require('hexo-util').escapeHTML;
hexo.extend.helper.register('toc_fix',function(str, options) {
  options = options || {};

  if (!cheerio) cheerio = require('cheerio');

  var $ = cheerio.load(str);
  var headingsMaxDepth = options.hasOwnProperty('max_depth') ? options.max_depth : 6;
  var headingsSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, headingsMaxDepth).join(',');
  var headings = $(headingsSelector);

  if (!headings.length) return '';

  var className = options.class || 'toc';
  var listNumber = options.hasOwnProperty('list_number') ? options.list_number : true;
  var result = '<ol class="' + className + '">';
  var lastNumber = [0, 0, 0, 0, 0, 0];
  var firstLevel = 0;
  var lastLevel = 0;
  var i = 0;

  headings.each(function() {
    var level = +this.name[1];
    var id = $(this).attr('id');
    var text = escapeHtml($(this).text());

    lastNumber[level - 1]++;

    for (i = level; i <= 5; i++) {
      lastNumber[i] = 0;
    }

    if (firstLevel) {
      for (i = level; i < lastLevel; i++) {
        result += '</li></ol>';
      }

      if (level > lastLevel) {
        result += '<ol class="' + className + '-child">';
      } else {
        result += '</li>';
      }
    } else {
      firstLevel = level;
    }

    result += '<li class="' + className + '-item ' + className + '-level-' + level + '">';
    result += '<a class="' + className + '-link" href="#' + id + '">';

    if (listNumber) {
      result += '<span class="' + className + '-number">';

      for (i = firstLevel - 1; i < level; i++) {
        result += lastNumber[i] + '.';
      }

      result += '</span> ';
    }

    result += '<span class="' + className + '-text">' + text + '</span></a>';

    lastLevel = level;
  });

  for (i = firstLevel - 1; i < lastLevel; i++) {
    result += '</li></ol>';
  }

  return result;
});
