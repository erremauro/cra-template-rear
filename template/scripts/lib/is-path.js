const PATH_PATTERN = /(\.{1,2})?(\w+)?\//;
module.exports = str => PATH_PATTERN.test(str);
