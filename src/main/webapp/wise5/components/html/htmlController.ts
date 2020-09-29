'use strict';

import ComponentController from '../componentController';

class HTMLController extends ComponentController {
  $state: any;
  $stateParams: any;
  $sce: any;
  html: string;

  static $inject = [
    '$injector',
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$sce',
    '$filter',
    '$mdDialog',
    'AnnotationService',
    'ConfigService',
    'NodeService',
    'NotebookService',
    'NotificationService',
    'ProjectService',
    'StudentAssetService',
    'StudentDataService',
    'UtilService'
  ];

  constructor(
    $injector,
    $q,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $sce,
    $filter,
    $mdDialog,
    AnnotationService,
    ConfigService,
    NodeService,
    NotebookService,
    NotificationService,
    ProjectService,
    StudentAssetService,
    StudentDataService,
    UtilService
  ) {
    super(
      $filter,
      $injector,
      $mdDialog,
      $q,
      $rootScope,
      $scope,
      AnnotationService,
      ConfigService,
      NodeService,
      NotebookService,
      NotificationService,
      ProjectService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$sce = $sce;

    if (this.mode === 'authoring') {
    } else if (this.mode === 'grading') {
    } else if (this.mode === 'student') {
      if (this.componentContent != null) {
        this.html = this.componentContent.html;
      }
    }

    this.broadcastDoneRenderingComponent();
  }
}

export default HTMLController;
