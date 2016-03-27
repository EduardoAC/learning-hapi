// a simple example of a handlebars helper

module.exports = function (context) {
    if(context && context !== ''){
      return context.toUpperCase();
    }
    return '';
}
