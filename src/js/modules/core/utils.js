var utils = {};

utils.commas = function(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports = utils;
