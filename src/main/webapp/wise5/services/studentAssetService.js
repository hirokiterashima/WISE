define(['configService'], function(configService) {

    var service = ['$http', '$q', '$upload', '$rootScope', 'ConfigService', 
                                    function($http, $q, $upload, $rootScope, ConfigService) {
        var serviceObject = {};
        
        serviceObject.retrieveAssets = function() {
            var config = {};
            config.method = 'GET';
            config.url = ConfigService.getStudentAssetManagerURL();
            config.params = {};
            config.params.command = 'assetList';
            return $http(config).then(function(response) {
                // loop through the assets and make them into JSON object with more details
                var assets = [];
                var filenames = response.data;
                var config = response.config;
                var studentUploadsBaseURL = ConfigService.getStudentUploadsBaseURL();
                var runId = ConfigService.getRunId();
                var workgroupId = ConfigService.getWorkgroupId();
                var assetBaseURL = studentUploadsBaseURL + '/' + runId + '/' + workgroupId + '/unreferenced/';
                for (var f = 0; f < filenames.length; f++) {
                    var filename = filenames[f];
                    if (filename != '.DS_Store') {
                        var asset = {};
                        asset.name = filename;
                        asset.url = assetBaseURL + filename;
                        assets.push(asset);
                    }
                }
                return assets;
            });
        };
        
        serviceObject.uploadAssets = function(files) {
            var studentAssetManagerURL = ConfigService.getStudentAssetManagerURL();
            var promises = files.map(function(file) {
                return $upload.upload({
                    url: studentAssetManagerURL,
                    fields: {
                        'command': 'uploadAsset'
                    },
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    //console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
                });
            });
            return $q.all(promises);
        };
        
        return serviceObject;
    }];
    
    return service;
});