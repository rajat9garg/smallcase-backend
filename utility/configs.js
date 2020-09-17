var fs = require('fs');

var configs = {
  'MONGO_HOST'                         : process.env.MONGO_HOST ? process.env.MONGO_HOST : "127.0.0.1",
  'MONGO_PORT' 					       : "27017" ,
  'PORT'                               : 3000,
  'DB_NAME'                           : "smallcase" 
};

var overwriteConfigFulFileName = __dirname + '/' + configs.CONFIGS_OVERWRITE_FILE;

if (fs.existsSync(overwriteConfigFulFileName)) {
    var overwriteConfig = require(overwriteConfigFulFileName);
    for (var key in overwriteConfig) {
        configs[key] = overwriteConfig[key];
    }
} else {
    console.log('[[[[[[[ No Overwrite Configs File Found to overwrite any config key ]]]]]]]]');
}

module.exports = configs;