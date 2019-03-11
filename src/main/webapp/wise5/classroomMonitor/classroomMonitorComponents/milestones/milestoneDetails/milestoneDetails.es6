"use strict";

class MilestoneDetailsController {
    constructor($filter,
                $scope,
                $state,
                ConfigService,
                ProjectService,
                TeacherDataService) {
        this.$filter = $filter;
        this.$scope = $scope;
        this.$state = $state;
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.TeacherDataService = TeacherDataService;

        this.$translate = this.$filter('translate');
        this.periodId = this.TeacherDataService.getCurrentPeriod().periodId;

        this.$onInit = () => {
            this.requirements = this.getRequirements();
        }

        this.$scope.$on('currentPeriodChanged', (event, args) => {
            this.periodId = args.currentPeriod.periodId;
        });
    };

    getRequirements() {
        let requirements = [];
        let items = this.milestone.items;

        angular.forEach(items, (value, key) => {
            if (value.checked) {
                requirements.push(key);
            }
        });

        return requirements;
    }

    getNodeNumberByNodeId(nodeId) {
        return this.ProjectService.nodeIdToNumber[nodeId];
    }

    getNodeTitleByNodeId(nodeId) {
        return this.ProjectService.getNodeTitleByNodeId(nodeId);
    }

    /**
     * Get the user names for a workgroup id
     * @param workgroupId the workgroup id
     * @return the user names in the workgroup
     */
    getDisplayUserNamesByWorkgroupId(workgroupId) {
        return this.ConfigService.getDisplayUserNamesByWorkgroupId(workgroupId);
    }

    /**
     * Get the avatar coloer for a workgroup id
     * @param workgroupId the workgroup id
     * @return the avatar color for the workgroup
     */
    getAvatarColorForWorkgroupId(workgroupId) {
        return this.ConfigService.getAvatarColorForWorkgroupId(workgroupId);
    }

    showWorkgroup(workgroup) {
        this.onShowWorkgroup({ value: workgroup });
    }

    visitNodeGrading() {
        this.onVisitNodeGrading();
    }
}

MilestoneDetailsController.$inject = [
    '$filter',
    '$scope',
    '$state',
    'ConfigService',
    'ProjectService',
    'TeacherDataService'
];

const MilestoneDetails = {
    bindings: {
        milestone: '<',
        onShowWorkgroup: '&',
        onVisitNodeGrading: '&'
    },
    template:
        `<div class="milestone-details md-whiteframe-1dp">
            <span layout="row" layout-align="start center">
                <period-select custom-class="'md-no-underline md-button toolbar__select'"></period-select>
                <span flex></span>
                <span layout="row" layout-align="start center">
                    <md-progress-linear class="milestone-details__progress" md-mode="determinate" value="{{ $ctrl.milestone.percentageCompleted }}"></md-progress-linear>
                    <span class="md-body-2 text-secondary ng-binding">
                        {{ $ctrl.milestone.percentageCompleted }}%
                    </span>
                </span>
            </span>
            <p ng-if="$ctrl.milestone.description"><span class="heavy accent-2">{{ 'description' | translate }}: </span> {{ $ctrl.milestone.description }}</p>
            <p ng-if="$ctrl.milestone.params.targetDate"><span class="heavy accent-2">{{ 'dueDate' | translate }}: </span> {{ $ctrl.milestone.params.targetDate | date: 'EEE MMM d, yyyy' }}</p>
            <p ng-if="$ctrl.requirements.length">
                <span class="heavy accent-2">{{ 'REQUIREMENTS' | translate }}: </span>
                <a ng-repeat="requirement in $ctrl.requirements" ui-sref="root.project({nodeId: \'{{ requirement }}\'})" ng-click="$ctrl.visitNodeGrading(event)">
                    {{ $ctrl.getNodeNumberByNodeId(requirement) }}: {{ $ctrl.getNodeTitleByNodeId(requirement) }}<span ng-if="!$last">, </span>
                </a>
            </p>
        </div>
        <div ng-if="$ctrl.milestone.type === 'milestoneReport'"
             class="milestone-details md-whiteframe-1dp">
            <div class="milestone-details__header accent-2 md-body-2 gray-lightest-bg">{{ 'classReport' | translate }}</div>
            <div ng-if="!$ctrl.milestone.isReportAvailable || $ctrl.periodId === -1"
                class="center md-body-1">
                {{ 'milestoneReportExplanation' | translate }} {{ 'milestoneReportAvailability' | translate }}<br />
                <span class="md-body-2" ng-if="$ctrl.milestone.satisfyConditional === 'any'">
                    {{ 'milestoneReportAvailabilityRequirementsAny' | translate: { num: $ctrl.milestone.satisfyMinNumWorkgroups, percent: $ctrl.milestone.satisfyMinPercentage } }}
                </span>
                <span class="md-body-2" ng-if="$ctrl.milestone.satisfyConditional === 'all'">
                    {{ 'milestoneReportAvailabilityRequirementsAll' | translate: { num: $ctrl.milestone.satisfyMinNumWorkgroups, percent: $ctrl.milestone.satisfyMinPercentage } }}
                </span>
            </div>
            <div ng-if="$ctrl.milestone.isReportAvailable && $ctrl.periodId > -1">
                <compile data="$ctrl.milestone.generatedReport"></compile>
            </div>
        </div>
        <md-list class="user-list">
            <md-list-item class="thead md-whiteframe-1dp md-with-secondary gray-lightest-bg">
                <p>{{ 'team' | translate }}</p>
                <div class="md-secondary-container">{{ 'completed' | translate }}</div>
            </md-list-item>
            <md-list-item class="list-item md-whiteframe-1dp md-with-secondary"
                          ng-repeat="workgroup in $ctrl.milestone.workgroups | orderBy:'-achievementTime'"
                          ng-click="$ctrl.showWorkgroup(workgroup)"
                          aria-label="{{ 'viewTeam' | translate }}">
                <div class="md-avatar" hide-xs>
                    <md-icon class="md-36" style="color: {{ $ctrl.getAvatarColorForWorkgroupId(workgroup.workgroupId) }};"> account_circle </md-icon>
                </div>
                <p class="heavy">{{ $ctrl.getDisplayUserNamesByWorkgroupId(workgroup.workgroupId) }}</p>
                <div class="md-secondary-container heavy">
                    <span ng-if="workgroup.achievementTime !== null" class="success">
                        {{ workgroup.achievementTime | amTimeAgo }}
                    </span>
                    <span ng-if="workgroup.achievementTime === null" class="warn">
                        {{ 'notCompleted' | translate }}
                    </span>
                </div>
            </md-list-item>
        </md-list>`,
    controller: MilestoneDetailsController
};

export default MilestoneDetails;
