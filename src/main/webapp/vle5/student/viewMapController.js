define(['app'], 
        function(app) {
    app.$controllerProvider.register('ViewMapController', function($scope, ConfigService, NodeApplicationService, ProjectService, NodeService) {
        this.globalTools = ['hideNavigation', 'showNavigation', 'next', 'prev', 'portfolio', 'home', 'sign out'];
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.NodeApplicationService = NodeApplicationService;
        this.NodeService = NodeService

        var currentNodeId;
        this.receiveMessage = angular.bind(this, function(event) {
            // Do we trust the sender of this message?  (might be
            // different from what we originally opened, for example).
            //if (event.origin !== 'http://example.org')
            //    return;
             
        });
        
        this.globalToolButtonClicked = function(globalToolName) {
            if (globalToolName === 'hideNavigation') {
                $('#navigation').hide();
                $('#nodeIFrame').show();
            } else if (globalToolName === 'showNavigation') {
                $('#navigation').show();
                $('#nodeIFrame').hide();
            }
        }
        var wiseBaseURL = ConfigService.getConfigParam('wiseBaseURL');
        //angular.element($window).on('messsage',this.receiveMessage);
        //window.addEventListener('message', this.receiveMessage, false);
        
        $scope.$on('$messageIncoming', function(event, data) {
            console.log('received message in viewMapController.js');
            
            var msg = data;
            console.log('in view map controller, received message:'+JSON.stringify(msg));
            
            if (msg.messageType === 'requestStepContentAndStateAndAnnotationFromWISE') {
                var nodeSrc = this.ProjectService.getNodeSrcByNodeId(currentNodeId);
                this.NodeService.getNodeContentByNodeSrc(nodeSrc).then(function(nodeContent) {
                    var nodeIFrame = document.getElementById('nodeIFrame');
                    nodeIFrame.contentWindow.postMessage(
                        {'viewType':'student',
                            'content':nodeContent,
                            'globalStyle':'#title {color:purple;} body {background-color:yellow}',
                            'stepState':{'response':'my name is bob'}
                        }, 
                        '*');
                });

            } else if (msg.messageType === 'requestNavigationStateFromWISE') {
                var project = ProjectService.project;
                var navigationIFrame = document.getElementById('navigationIFrame');
                navigationIFrame.contentWindow
                    .postMessage({'viewType':'studentNavigation','project':project,
                        'globalStyle':'#title {color:purple;} body {background-color:yellow}'}, 
                        '*');
            } else if (msg.messageType === 'sendStateToWISE') {
                var nodeIFrame = document.getElementById('nodeIFrame');
                nodeIFrame.contentWindow
                    .postMessage({'viewType':'student','content':null,'globalStyle':null,'stepState':msg}, 
                         '*');
            } else if (msg.messageType === 'navigation_moveToNode') {
                var nodeId = msg.nodeId;
                var nodeType = this.ProjectService.getNodeTypeByNodeId(nodeId);

                $('#nodeIFrame').attr('src',this.NodeApplicationService.getNodeURL(nodeType));
                currentNodeId = nodeId;
                $('#navigation').hide();
                $('#nodeIFrame').show();
            }
        });
        
        $scope.sendMessage = function() {
            this.$emit('$messageOutgoing', angular.toJson({"response": "hi"}))
        };

        $('#navigation').html('<iframe id="navigationIFrame" '+ 
                'src="http://localhost:8080/wise/navigation/navigationMap/index.html"></iframe>');
    });
});