'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { HelpIconComponent } from './themeComponents/helpIcon/help-icon.component';
import NavItemController from './themeComponents/navItem/navItemController';
import StepToolsCtrl from './themeComponents/stepTools/stepToolsController';
import NodeStatusIconCtrl from './themeComponents/nodeStatusIcon/nodeStatusIconController';

const NavItem = {
  bindings: {
    nodeId: '<',
    showPosition: '<',
    type: '<'
  },
  template: '<ng-include src="::navitemCtrl.getTemplateUrl()"></ng-include>',
  controller: 'NavItemController as navitemCtrl'
}

const NodeStatusIcon = {
  bindings: {
    nodeId: '<',
    customClass: '<'
  },
  template: '<ng-include src="::nodeStatusIconCtrl.getTemplateUrl()"></ng-include>',
  controller: 'NodeStatusIconCtrl as nodeStatusIconCtrl'
}

const StepTools = {
  bindings: {
    showPosition: '<'
  },
  template: '<ng-include src="::stepToolsCtrl.getTemplateUrl()"></ng-include>',
  controller: 'StepToolsCtrl as stepToolsCtrl'
}

let ThemeComponents = angular.module('theme.components', []);

ThemeComponents.controller('NavItemController', NavItemController)
    .controller('StepToolsCtrl', StepToolsCtrl)
    .controller('NodeStatusIconCtrl', NodeStatusIconCtrl)
    .directive('helpIcon',
        downgradeComponent({ component: HelpIconComponent }) as angular.IDirectiveFactory)
    .component('navItem', NavItem)
    .component('nodeStatusIcon', NodeStatusIcon)
    .component('stepTools', StepTools);

export default ThemeComponents;