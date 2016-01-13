'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularMoment = require('angular-moment');

var _angularMoment2 = _interopRequireDefault(_angularMoment);

var _toArrayFilter = require('lib/angular-toArrayFilter/toArrayFilter');

var _toArrayFilter2 = _interopRequireDefault(_toArrayFilter);

var _angularUiRouter = require('angular-ui-router');

var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);

var _ngFileUpload = require('ng-file-upload');

var _ngFileUpload2 = _interopRequireDefault(_ngFileUpload);

var _angularMaterial = require('angular-material');

var _angularMaterial2 = _interopRequireDefault(_angularMaterial);

var _angularWebsocket = require('angular-websocket');

var _angularWebsocket2 = _interopRequireDefault(_angularWebsocket);

var _annotationController = require('../controllers/annotationController2');

var _annotationController2 = _interopRequireDefault(_annotationController);

var _annotationService = require('../services/annotationService2');

var _annotationService2 = _interopRequireDefault(_annotationService);

var _classroomMonitorController = require('./classroomMonitorController2');

var _classroomMonitorController2 = _interopRequireDefault(_classroomMonitorController);

var _configService = require('../services/configService2');

var _configService2 = _interopRequireDefault(_configService);

var _directives = require('../directives/directives2');

var _directives2 = _interopRequireDefault(_directives);

var _discussionController = require('../components/discussion/discussionController2');

var _discussionController2 = _interopRequireDefault(_discussionController);

var _discussionService = require('../components/discussion/discussionService2');

var _discussionService2 = _interopRequireDefault(_discussionService);

var _drawController = require('../components/draw/drawController2');

var _drawController2 = _interopRequireDefault(_drawController);

var _drawService = require('../components/draw/drawService2');

var _drawService2 = _interopRequireDefault(_drawService);

var _embeddedController = require('../components/embedded/embeddedController2');

var _embeddedController2 = _interopRequireDefault(_embeddedController);

var _embeddedService = require('../components/embedded/embeddedService2');

var _embeddedService2 = _interopRequireDefault(_embeddedService);

var _graphController = require('../components/graph/graphController2');

var _graphController2 = _interopRequireDefault(_graphController);

var _graphService = require('../components/graph/graphService2');

var _graphService2 = _interopRequireDefault(_graphService);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _highchartsNg = require('highcharts-ng');

var _highchartsNg2 = _interopRequireDefault(_highchartsNg);

var _htmlController = require('../components/html/htmlController2');

var _htmlController2 = _interopRequireDefault(_htmlController);

var _labelController = require('../components/label/labelController2');

var _labelController2 = _interopRequireDefault(_labelController);

var _labelService = require('../components/label/labelService2');

var _labelService2 = _interopRequireDefault(_labelService);

var _matchController = require('../components/match/matchController2');

var _matchController2 = _interopRequireDefault(_matchController);

var _matchService = require('../components/match/matchService2');

var _matchService2 = _interopRequireDefault(_matchService);

var _multipleChoiceController = require('../components/multipleChoice/multipleChoiceController2');

var _multipleChoiceController2 = _interopRequireDefault(_multipleChoiceController);

var _multipleChoiceService = require('../components/multipleChoice/multipleChoiceService2');

var _multipleChoiceService2 = _interopRequireDefault(_multipleChoiceService);

var _nodeProgressController = require('./nodeProgress/nodeProgressController2');

var _nodeProgressController2 = _interopRequireDefault(_nodeProgressController);

var _nodeGradingController = require('./nodeGrading/nodeGradingController2');

var _nodeGradingController2 = _interopRequireDefault(_nodeGradingController);

var _nodeService = require('../services/nodeService2');

var _nodeService2 = _interopRequireDefault(_nodeService);

var _openResponseController = require('../components/openResponse/openResponseController2');

var _openResponseController2 = _interopRequireDefault(_openResponseController);

var _openResponseService = require('../components/openResponse/openResponseService2');

var _openResponseService2 = _interopRequireDefault(_openResponseService);

var _outsideURLController = require('../components/outsideURL/outsideURLController2');

var _outsideURLController2 = _interopRequireDefault(_outsideURLController);

var _outsideURLService = require('../components/outsideURL/outsideURLService2');

var _outsideURLService2 = _interopRequireDefault(_outsideURLService);

var _projectService = require('../services/projectService2');

var _projectService2 = _interopRequireDefault(_projectService);

var _sessionService = require('../services/sessionService2');

var _sessionService2 = _interopRequireDefault(_sessionService);

var _studentAssetService = require('../services/studentAssetService2');

var _studentAssetService2 = _interopRequireDefault(_studentAssetService);

var _studentDataService = require('../services/studentDataService2');

var _studentDataService2 = _interopRequireDefault(_studentDataService);

var _studentStatusService = require('../services/studentStatusService2');

var _studentStatusService2 = _interopRequireDefault(_studentStatusService);

var _studentWebSocketService = require('../services/studentWebSocketService2');

var _studentWebSocketService2 = _interopRequireDefault(_studentWebSocketService);

var _tableController = require('../components/table/tableController2');

var _tableController2 = _interopRequireDefault(_tableController);

var _tableService = require('../components/table/tableService2');

var _tableService2 = _interopRequireDefault(_tableService);

var _teacherDataService = require('../services/teacherDataService2');

var _teacherDataService2 = _interopRequireDefault(_teacherDataService);

var _studentProgressController = require('./studentProgress/studentProgressController2');

var _studentProgressController2 = _interopRequireDefault(_studentProgressController);

var _teacherWebSocketService = require('../services/teacherWebSocketService2');

var _teacherWebSocketService2 = _interopRequireDefault(_teacherWebSocketService);

var _utilService = require('../services/utilService2');

var _utilService2 = _interopRequireDefault(_utilService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainModule = _angular2.default.module('classroomMonitor', ['angularMoment', 'angular-toArrayFilter', 'directives', 'highcharts-ng', 'ngAnimate', 'ngAria', 'ngFileUpload', 'ngMaterial', 'ngWebSocket', 'ui.router']).service(_annotationService2.default.name, _annotationService2.default).service(_configService2.default.name, _configService2.default).service(_discussionService2.default.name, _discussionService2.default).service(_drawService2.default.name, _drawService2.default).service(_embeddedService2.default.name, _embeddedService2.default).service(_graphService2.default.name, _graphService2.default).service(_labelService2.default.name, _labelService2.default).service(_matchService2.default.name, _matchService2.default).service(_multipleChoiceService2.default.name, _multipleChoiceService2.default).service(_nodeService2.default.name, _nodeService2.default).service(_openResponseService2.default.name, _openResponseService2.default).service(_outsideURLService2.default.name, _outsideURLService2.default).service(_projectService2.default.name, _projectService2.default).service(_sessionService2.default.name, _sessionService2.default).service(_studentAssetService2.default.name, _studentAssetService2.default).service(_studentDataService2.default.name, _studentDataService2.default).service(_studentStatusService2.default.name, _studentStatusService2.default).service(_studentWebSocketService2.default.name, _studentWebSocketService2.default).service(_tableService2.default.name, _tableService2.default).service(_teacherDataService2.default.name, _teacherDataService2.default).service(_teacherWebSocketService2.default.name, _teacherWebSocketService2.default).service(_utilService2.default.name, _utilService2.default).controller(_annotationController2.default.name, _annotationController2.default).controller(_classroomMonitorController2.default.name, _classroomMonitorController2.default).controller(_discussionController2.default.name, _discussionController2.default).controller(_drawController2.default.name, _drawController2.default).controller(_embeddedController2.default.name, _embeddedController2.default).controller(_graphController2.default.name, _graphController2.default).controller(_htmlController2.default.name, _htmlController2.default).controller(_labelController2.default.name, _labelController2.default).controller(_matchController2.default.name, _matchController2.default).controller(_multipleChoiceController2.default.name, _multipleChoiceController2.default).controller(_nodeGradingController2.default.name, _nodeGradingController2.default).controller(_nodeProgressController2.default.name, _nodeProgressController2.default).controller(_openResponseController2.default.name, _openResponseController2.default).controller(_outsideURLController2.default.name, _outsideURLController2.default).controller(_studentProgressController2.default.name, _studentProgressController2.default).controller(_tableController2.default.name, _tableController2.default).config(['$urlRouterProvider', '$stateProvider', '$controllerProvider', '$mdThemingProvider', function ($urlRouterProvider, $stateProvider, $controllerProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/studentProgress');

    $stateProvider.state('root', {
        url: '',
        abstract: true,
        templateUrl: 'wise5/classroomMonitor/classroomMonitor.html',
        controller: 'ClassroomMonitorController',
        controllerAs: 'classroomMonitorController',
        resolve: {
            config: function config(ConfigService) {
                var configURL = window.configURL;

                return ConfigService.retrieveConfig(configURL);
            },
            project: function project(ProjectService, config) {
                return ProjectService.retrieveProject();
            },
            studentStatuses: function studentStatuses(StudentStatusService, config) {
                return StudentStatusService.retrieveStudentStatuses();
            },
            webSocket: function webSocket(TeacherWebSocketService, config) {
                return TeacherWebSocketService.initialize();
            }
        }
    }).state('root.studentProgress', {
        url: '/studentProgress',
        templateUrl: 'wise5/classroomMonitor/studentProgress/studentProgress.html',
        controller: 'StudentProgressController',
        controllerAs: 'studentProgressController',
        resolve: {}
    }).state('root.nodeProgress', {
        url: '/nodeProgress',
        templateUrl: 'wise5/classroomMonitor/nodeProgress/nodeProgress.html',
        controller: 'NodeProgressController',
        controllerAs: 'nodeProgressController',
        resolve: {}
    }).state('root.nodeGrading', {
        url: '/nodeGrading/:nodeId',
        templateUrl: 'wise5/classroomMonitor/nodeGrading/nodeGrading.html',
        controller: 'NodeGradingController',
        controllerAs: 'nodeGradingController',
        resolve: {
            studentData: function studentData($stateParams, TeacherDataService, config) {
                return TeacherDataService.retrieveStudentDataByNodeId($stateParams.nodeId);
            },
            load: function load() {}
            /*
            System.import('components/discussion/discussionController2').then((DiscussionController) => {
                $controllerProvider.register(DiscussionController.default.name, DiscussionController.default);
            });
            System.import('components/draw/drawController2').then((DrawController) => {
                $controllerProvider.register(DrawController.default.name, DrawController.default);
            });
            System.import('components/embedded/embeddedController2').then((EmbeddedController) => {
                $controllerProvider.register(EmbeddedController.default.name, EmbeddedController.default);
            });
            System.import('components/graph/graphController2').then((GraphController) => {
                $controllerProvider.register(GraphController.default.name, GraphController.default);
            });
            System.import('components/match/matchController2').then((MatchController) => {
                $controllerProvider.register(MatchController.default.name, MatchController.default);
            });
            System.import('components/multipleChoice/multipleChoiceController2').then((MultipleChoiceController) => {
                $controllerProvider.register(MultipleChoiceController.default.name, MultipleChoiceController.default);
            });
            System.import('components/html/htmlController2').then((HTMLController) => {
                $controllerProvider.register(HTMLController.default.name, HTMLController.default);
            });
            System.import('components/label/labelController2').then((LabelController) => {
                $controllerProvider.register(LabelController.default.name, LabelController.default);
            });
            System.import('components/openResponse/openResponseController2').then((OpenResponseController) => {
                $controllerProvider.register(OpenResponseController.default.name, OpenResponseController.default);
            });
            System.import('components/outsideURL/outsideURLController2').then((OutsideURLController) => {
                $controllerProvider.register(OutsideURLController.default.name, OutsideURLController.default);
            });
            System.import('components/table/tableController2').then((TableController) => {
                $controllerProvider.register(TableController.default.name, TableController.default);
            });
            */

            /*
            annotationController: app.loadController('annotationController'),
            embeddedController: app.loadController('embeddedController'),
            graphController: app.loadController('graphController'),
            discussionController: app.loadController('discussionController'),
            drawController: app.loadController('drawController'),
            labelController: app.loadController('labelController'),
            matchController: app.loadController('matchController'),
            multipleChoiceController: app.loadController('multipleChoiceController'),
            nodeController: app.loadController('nodeController'),
            tableController: app.loadController('tableController')
            */
        }
    });
    /*
                    .state('root.project', {
                        url: '/project',
                        templateUrl: 'wise5/authoringTool/project/project.html',
                        controller: 'ProjectController',
                        controllerAs: 'projectController',
                        resolve: {
                        }
                    })
                    .state('root.node', {
                        url: '/node/:nodeId',
                        templateUrl: 'wise5/authoringTool/node/node.html',
                        controller: 'NodeController',
                        controllerAs: 'nodeController',
                        resolve: {
                            load: () => {
                            System.import('components/html/htmlController2').then((HTMLController) => {
                            $controllerProvider.register(HTMLController.default.name, HTMLController.default);
                            });
                                System.import('components/openResponse/openResponseController2').then((OpenResponseController) => {
                                    $controllerProvider.register(OpenResponseController.default.name, OpenResponseController.default);
                            });
    
                            }
                        }
    
                    });
                */
    // ngMaterial default theme configuration
    // TODO: make dynamic and support alternate themes; allow projects to specify theme parameters and settings
    $mdThemingProvider.definePalette('primaryPaletteWise', {
        '50': 'e1f0f4',
        '100': 'b8dbe4',
        '200': '8ec6d4',
        '300': '5faec2',
        '400': '3d9db5',
        '500': '1c8ca8',
        '600': '197f98',
        '700': '167188',
        '800': '136377',
        '900': '0e4957',
        'A100': 'abf3ff',
        'A200': '66e2ff',
        'A400': '17bee5',
        'A700': '00A1C6',
        'contrastDefaultColor': 'light', // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', 'A100'],
        'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.definePalette('accentPaletteWise', {
        '50': 'fde9e6',
        '100': 'fbcbc4',
        '200': 'f8aca1',
        '300': 'f4897b',
        '400': 'f2705f',
        '500': 'f05843',
        '600': 'da503c',
        '700': 'c34736',
        '800': 'aa3e2f',
        '900': '7d2e23',
        'A100': 'ff897d',
        'A200': 'ff7061',
        'A400': 'ff3829',
        'A700': 'cc1705',
        'contrastDefaultColor': 'light', // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', 'A100'],
        'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default').primaryPalette('primaryPaletteWise').accentPalette('accentPaletteWise');
}]);

exports.default = mainModule;
/*
require.config({
    baseUrl: 'wise5/',
    waitSeconds: 0,
    paths: {
        'angular': [
            '//ajax.googleapis.com/ajax/libs/angularjs/1.3.20/angular.min',
            'vendor/angular/angular.min'
        ],
        'angularAnimate': 'vendor/angular-animate/angular-animate.min',
        'angularAria': 'vendor/angular-aria/angular-aria.min',
        'angularAudio': 'vendor/angular-audio/app/angular.audio',
        'angularDragDrop': 'vendor/angular-dragdrop/src/angular-dragdrop.min',
        'angularFileUpload': 'vendor/ng-file-upload/ng-file-upload.min',
        'angularMaterial': 'vendor/angular-material/angular-material.min',
        'angularMoment': 'vendor/angular-moment/angular-moment.min',
        'angularSanitize': 'vendor/angular-sanitize/angular-sanitize.min',
        'angularSortable': 'vendor/angular-ui-sortable/sortable.min',
        'angularToArrayFilter': 'vendor/angular-toArrayFilter/toArrayFilter',
        'angularUIRouter': 'vendor/angular-ui-router/release/angular-ui-router.min',
        'angularUITinymce': 'vendor/angular-ui-tinymce/src/tinymce',
        'angularUITree': 'vendor/angular-ui-tree/dist/angular-ui-tree.min',
        'angularWebSocket': 'vendor/angular-websocket/angular-websocket.min',
        'annotationController': 'controllers/annotationController',
        'annotationService': 'services/annotationService',
        'app': 'classroomMonitor/app',
        'audioRecorderController': 'components/audioRecorder/audioRecorderController',
        'audioRecorderService': 'components/audioRecorder/audioRecorderService',
        'bootstrap': [ // TODO: remove once no longer using
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
            'lib/bootstrap/bootstrap.min'
        ],
        'classroomMonitorController': 'classroomMonitor/classroomMonitorController',
        'configService': 'services/configService',
        'cRaterController': 'components/cRater/cRaterController',
        'cRaterService': 'components/cRater/cRaterService',
        'd3': 'lib/d3/d3',
        'drawingTool': 'lib/drawingTool/drawing-tool',
        'directives': 'directives/directives',
        'discussionController': 'components/discussion/discussionController',
        'discussionService': 'components/discussion/discussionService',
        'draggablePoints': 'vendor/draggable-points/draggable-points',
        'drawController': 'components/draw/drawController',
        'drawService': 'components/draw/drawService',
        'embeddedController': 'components/embedded/embeddedController',
        'embeddedService': 'components/embedded/embeddedService',
        'fabric': 'vendor/fabric/dist/fabric.min',
        'filters': 'filters/filters',
        'graphController': 'components/graph/graphController',
        'graphService': 'components/graph/graphService',
        'highcharts': 'vendor/highcharts/lib/highcharts',
        'highcharts-more': 'vendor/highcharts/lib/highcharts-more',
        'highcharts-ng': 'vendor/highcharts-ng/dist/highcharts-ng.min',
        'htmlController': 'components/html/htmlController',
        'htmlService': 'components/html/htmlService',
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min',
            'vendor/jquery/dist/jquery.min'
        ],
        'jqueryUI': [ // TODO: switch to pared down custom build
            '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
            'vendor/jquery-ui/jquery-ui.min'
        ],
        'labelController': 'components/label/labelController',
        'labelService': 'components/label/labelService',
        'matchController': 'components/match/matchController',
        'matchService': 'components/match/matchService',
        'moment': 'vendor/moment/min/moment.min',
        'multipleChoiceController': 'components/multipleChoice/multipleChoiceController',
        'multipleChoiceService': 'components/multipleChoice/multipleChoiceService',
        'navigationController': 'vle/navigation/navigationController',
        'nodeController': 'node/nodeController',
        'nodeGradingController': 'classroomMonitor/nodeGrading/nodeGradingController',
        'nodeProgressController': 'classroomMonitor/nodeProgress/nodeProgressController',
        'nodeService': 'services/nodeService',
        'openResponseController': 'components/openResponse/openResponseController',
        'openResponseService': 'components/openResponse/openResponseService',
        'outsideURLController': 'components/outsideURL/outsideURLController',
        'outsideURLService': 'components/outsideURL/outsideURLService',
        'photoBoothController': 'components/photoBooth/photoBoothController',
        'photoBoothService': 'components/photoBooth/photoBoothService',
        'planningController': 'components/planning/planningController',
        'planningService': 'components/planning/planningService',
        'notebook': 'vle/notebook/notebook',
        //'notebookController': 'vle/notebook/notebookController',
        'notebookService': 'services/notebookService',
        'projectService': 'services/projectService',
        'sessionService': 'services/sessionService',
        'studentAssetService': 'services/studentAssetService',
        'studentDataService': 'services/studentDataService',
        'studentGradingController': 'classroomMonitor/studentGrading/studentGradingController',
        'studentProgressController': 'classroomMonitor/studentProgress/studentProgressController',
        'studentStatusService': 'services/studentStatusService',
        'studentWebSocketService': 'services/studentWebSocketService',
        'tableController': 'components/table/tableController',
        'tableService': 'components/table/tableService',
        'teacherDataService': 'services/teacherDataService',
        'teacherWebSocketService': 'services/teacherWebSocketService',
        'tinymce': 'vendor/tinymce-dist/tinymce.min',
        'utilService': 'services/utilService',
        'vendor': 'lib/drawingTool/vendor',
        'vleController': 'vle/vleController',
        'webfont': [
            '//ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont',
            'vendor/webfontloader/webfontloader'
        ],
        'webfonts': 'js/webfonts'
    },
    shim: {
        'angular': {
            'exports': 'angular',
            'deps': [
                'jquery'
            ]
        },
        'angularAnimate': {
            'exports': 'angularAnimate',
            'deps': [
                'angular'
            ]
        },
        'angularAria': {
            'exports': 'angularAria',
            'deps': [
                'angular'
            ]
        },
        'angularAudio': {
            'exports': 'angularAudio',
            'deps': [
                'angular'
            ]
        },
        'angularDragDrop': {
            'exports': 'angularDragDrop',
            'deps': [
                'angular'
            ]
        },
        'angularFileUpload': {
            'exports': 'angularFileUpload',
            'deps': [
                'angular'
            ]
        },
        'angularMaterial': {
            'exports': 'angularMaterial',
            'deps': [
                'angularAnimate',
                'angularAria'
            ]
        },
        'angularMoment': {
            'exports': 'angularMoment',
            'deps': [
                'angular',
                'moment'
            ]
        },
        'angularSanitize': {
            'exports': 'angularSanitize',
            'deps': [
                'angular'
            ]
        },
        'angularSortable': {
            'exports': 'angularSortable',
            'deps': [
                'angular'
            ]
        },
        'angularToArrayFilter': {
            'exports': 'angularToArrayFilter',
            'deps': [
                'angular'
            ]
        },
        'angularUIRouter': {
            'exports': 'angularUIRouter',
            'deps': [
                'angular'
            ]
        },
        'angularUITinymce': {
            'exports': 'angularUITinymce',
            'deps': [
                'tinymce',
                'angular'
            ]
        },
        'angularUITree': {
            'exports': 'angularUITree',
            'deps': [
                'angular'
            ]
        },
        'angularWebSocket': {
            'exports': 'angularWebSocket',
            'deps': [
                'angular'
            ]
        },
        'bootstrap': {
            'exports': 'bootstrap',
            'deps': [
                'jquery'
            ]
        },
        'draggablePoints': {
            'exports': 'draggablePoints',
            'deps': [
                'angular',
                'highcharts'
            ]
        },
        'drawingTool': {
            'exports': 'drawingTool',
            'deps': [
                'vendor'
            ]
        },
        'fabric': {
            'exports': 'fabric'
        },
        'highcharts': {
            'exports': 'highcharts',
            'deps': [
                'angular',
                'jquery'
            ]
        },
        'highcharts-more': {
            'exports': 'highcharts-more',
            'deps': [
                'angular',
                'highcharts'
            ]
        },
        'highcharts-ng': {
            'exports': 'highcharts-ng',
            'deps': [
                'angular',
                'highcharts'
            ]
        },
        'jquery': {
            'exports': 'jquery'
        },
        'jqueryUI': {
            'exports': 'jqueryUI',
            'deps': [
                'jquery'
            ]
        },
        'moment': {
            'exports': 'moment'
        },
        'ocLazyLoad': {
            'expports': 'ocLazyLoad',
            'deps': [
                'angular'
            ]
        },
        'tinymce': {
            'exports': 'tinymce'
        },
        'vendor': {
            'exports': 'vendor'
        },
        'webfont': {
            'exports': 'webfont'
        },
        'webfonts': {
            'exports': 'webfonts',
            'deps': [
                'webfont'
            ]
        }
    }
});
require(['app'],function(app){
    app.init();
});
    */