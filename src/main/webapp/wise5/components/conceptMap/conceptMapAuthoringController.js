'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('svg.js');

require('svg.draggable.js');

var _conceptMapController = require('./conceptMapController');

var _conceptMapController2 = _interopRequireDefault(_conceptMapController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConceptMapAuthoringController = function (_ConceptMapController) {
  _inherits(ConceptMapAuthoringController, _ConceptMapController);

  function ConceptMapAuthoringController($anchorScroll, $filter, $location, $mdDialog, $q, $rootScope, $scope, $timeout, AnnotationService, ConceptMapService, ConfigService, CRaterService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, UtilService) {
    _classCallCheck(this, ConceptMapAuthoringController);

    var _this = _possibleConstructorReturn(this, (ConceptMapAuthoringController.__proto__ || Object.getPrototypeOf(ConceptMapAuthoringController)).call(this, $anchorScroll, $filter, $location, $mdDialog, $q, $rootScope, $scope, $timeout, AnnotationService, ConceptMapService, ConfigService, CRaterService, NodeService, NotebookService, ProjectService, StudentAssetService, StudentDataService, UtilService));

    _this.allowedConnectedComponentTypes = [{ type: 'ConceptMap' }, { type: 'Draw' }, { type: 'Embedded' }, { type: 'Graph' }, { type: 'Label' }, { type: 'Table' }];

    _this.shouldOptions = [{
      value: false, label: _this.$translate('conceptMap.should')
    }, {
      value: true, label: _this.$translate('conceptMap.shouldNot')
    }];

    // the options for when to update this component from a connected component
    _this.connectedComponentUpdateOnOptions = [{
      value: 'change',
      text: 'Change'
    }, {
      value: 'submit',
      text: 'Submit'
    }];

    _this.isPromptVisible = true;
    _this.isSaveButtonVisible = _this.componentContent.showSaveButton;
    _this.isSubmitButtonVisible = _this.componentContent.showSubmitButton;
    _this.availableNodes = _this.componentContent.nodes;
    _this.availableLinks = _this.componentContent.links;

    if (_this.componentContent.showNodeLabels == null) {
      _this.componentContent.showNodeLabels = true;
      _this.authoringComponentContent.showNodeLabels = true;
    }

    // generate the summernote rubric element id
    _this.summernoteRubricId = 'summernoteRubric_' + _this.nodeId + '_' + _this.componentId;

    // set the component rubric into the summernote rubric
    _this.summernoteRubricHTML = _this.componentContent.rubric;

    // the tooltip text for the insert WISE asset button
    var insertAssetString = _this.$translate('INSERT_ASSET');

    /*
     * create the custom button for inserting WISE assets into
     * summernote
     */
    var InsertAssetButton = _this.UtilService.createInsertAssetButton(_this, null, _this.nodeId, _this.componentId, 'rubric', insertAssetString);

    /*
     * the options that specifies the tools to display in the
     * summernote prompt
     */
    _this.summernoteRubricOptions = {
      toolbar: [['style', ['style']], ['font', ['bold', 'underline', 'clear']], ['fontname', ['fontname']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'video']], ['view', ['fullscreen', 'codeview', 'help']], ['customButton', ['insertAssetButton']]],
      height: 300,
      disableDragAndDrop: true,
      buttons: {
        insertAssetButton: InsertAssetButton
      }
    };

    _this.updateAdvancedAuthoringView();

    $scope.$watch(function () {
      return this.authoringComponentContent;
    }.bind(_this), function (newValue, oldValue) {
      this.componentContent = this.ProjectService.injectAssetPaths(newValue);
      this.isSaveButtonVisible = this.componentContent.showSaveButton;
      this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
      this.availableNodes = this.componentContent.nodes;
      this.availableLinks = this.componentContent.links;
      this.width = this.componentContent.width;
      this.height = this.componentContent.height;
      this.setBackgroundImage(this.componentContent.background, this.componentContent.stretchBackground);

      /*
       * make sure the SVG element can be accessed. we need to
       * perform this check because this watch is getting fired
       * before angular sets the svgId on the svg element. if
       * setupSVG() is called before the svgId is set on the svg
       * element, we will get an error.
       */
      if (document.getElementById(this.svgId) != null) {
        this.setupSVG();
      }
    }.bind(_this), true);

    /*
     * Listen for the assetSelected event which occurs when the user
     * selects an asset from the choose asset popup
     */
    _this.$scope.$on('assetSelected', function (event, args) {

      if (args != null) {

        // make sure the event was fired for this component
        if (args.nodeId == _this.nodeId && args.componentId == _this.componentId) {
          // the asset was selected for this component
          var assetItem = args.assetItem;

          if (assetItem != null) {
            var fileName = assetItem.fileName;

            if (fileName != null) {
              /*
               * get the assets directory path
               * e.g.
               * /wise/curriculum/3/
               */
              var assetsDirectoryPath = _this.ConfigService.getProjectAssetsDirectoryPath();
              var fullAssetPath = assetsDirectoryPath + '/' + fileName;

              var summernoteId = '';

              if (args.target == 'prompt') {
                // the target is the summernote prompt element
                summernoteId = 'summernotePrompt_' + _this.nodeId + '_' + _this.componentId;
              } else if (args.target == 'rubric') {
                // the target is the summernote rubric element
                summernoteId = 'summernoteRubric_' + _this.nodeId + '_' + _this.componentId;
              } else if (args.target == 'background') {
                // the target is the background image

                // set the background file name
                _this.authoringComponentContent.background = fileName;

                // the authoring component content has changed so we will save the project
                _this.authoringViewComponentChanged();
              } else if (args.target != null && args.target.indexOf('node') == 0) {
                // the target is a node image

                // get the concept map node
                var node = _this.authoringViewGetNodeById(args.target);

                if (node != null) {
                  // set the file name of the node
                  node.fileName = fileName;
                }

                // the authoring component content has changed so we will save the project
                _this.authoringViewComponentChanged();
              }

              if (summernoteId != '') {
                if (_this.UtilService.isImage(fileName)) {
                  /*
                   * move the cursor back to its position when the asset chooser
                   * popup was clicked
                   */
                  $('#' + summernoteId).summernote('editor.restoreRange');
                  $('#' + summernoteId).summernote('editor.focus');

                  // add the image html
                  $('#' + summernoteId).summernote('insertImage', fullAssetPath, fileName);
                } else if (_this.UtilService.isVideo(fileName)) {
                  /*
                   * move the cursor back to its position when the asset chooser
                   * popup was clicked
                   */
                  $('#' + summernoteId).summernote('editor.restoreRange');
                  $('#' + summernoteId).summernote('editor.focus');

                  // insert the video element
                  var videoElement = document.createElement('video');
                  videoElement.controls = 'true';
                  videoElement.innerHTML = '<source ng-src="' + fullAssetPath + '" type="video/mp4">';
                  $('#' + summernoteId).summernote('insertNode', videoElement);
                }
              }
            }
          }
        }
      }

      // close the popup
      _this.$mdDialog.hide();
    });

    /*
     * The advanced button for a component was clicked. If the button was
     * for this component, we will show the advanced authoring.
     */
    _this.$scope.$on('componentAdvancedButtonClicked', function (event, args) {
      if (args != null) {
        var componentId = args.componentId;
        if (_this.componentId === componentId) {
          _this.showAdvancedAuthoring = !_this.showAdvancedAuthoring;
        }
      }
    });
    return _this;
  }

  /**
   * The component has changed in the regular authoring view so we will save the project
   */


  _createClass(ConceptMapAuthoringController, [{
    key: 'authoringViewComponentChanged',
    value: function authoringViewComponentChanged() {

      // update the JSON string in the advanced authoring view textarea
      this.updateAdvancedAuthoringView();

      /*
       * notify the parent node that the content has changed which will save
       * the project to the server
       */
      this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
    }
  }, {
    key: 'advancedAuthoringViewComponentChanged',


    /**
     * The component has changed in the advanced authoring view so we will update
     * the component and save the project.
     */
    value: function advancedAuthoringViewComponentChanged() {

      try {
        /*
         * create a new component by converting the JSON string in the advanced
         * authoring view into a JSON object
         */
        var editedComponentContent = angular.fromJson(this.authoringComponentContentJSONString);

        // replace the component in the project
        this.ProjectService.replaceComponent(this.nodeId, this.componentId, editedComponentContent);

        // set the new component into the controller
        this.componentContent = editedComponentContent;

        /*
         * notify the parent node that the content has changed which will save
         * the project to the server
         */
        this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
      } catch (e) {
        this.$scope.$parent.nodeAuthoringController.showSaveErrorAdvancedAuthoring();
      }
    }
  }, {
    key: 'authoringViewNodeUpButtonClicked',


    /**
     * A node up button was clicked in the authoring tool so we will move the
     * node up
     * @param index the index of the node that we will move
     */
    value: function authoringViewNodeUpButtonClicked(index) {

      // check if the node is at the top
      if (index != 0) {
        // the node is not at the top so we can move it up

        // get the nodes
        var nodes = this.authoringComponentContent.nodes;

        if (nodes != null) {

          // get the node at the given index
          var node = nodes[index];

          // remove the node
          nodes.splice(index, 1);

          // insert the node back in one index back
          nodes.splice(index - 1, 0, node);

          /*
           * the author has made changes so we will save the component
           * content
           */
          this.authoringViewComponentChanged();
        }
      }
    }

    /**
     * A node down button was clicked in the authoring tool so we will move the
     * node down
     * @param index the index of the node that we will move
     */

  }, {
    key: 'authoringViewNodeDownButtonClicked',
    value: function authoringViewNodeDownButtonClicked(index) {

      // get the nodes
      var nodes = this.authoringComponentContent.nodes;

      // check if the node is at the bottom
      if (nodes != null && index != nodes.length - 1) {
        // the node is not at the bottom so we can move it down

        // get the node at the given index
        var node = nodes[index];

        // remove the node
        nodes.splice(index, 1);

        // insert the node back in one index ahead
        nodes.splice(index + 1, 0, node);

        /*
         * the author has made changes so we will save the component
         * content
         */
        this.authoringViewComponentChanged();
      }
    }

    /**
     * A node delete button was clicked in the authoring tool so we will remove
     * the node
     * @param index the index of the node that we will delete
     */

  }, {
    key: 'authoringViewNodeDeleteButtonClicked',
    value: function authoringViewNodeDeleteButtonClicked(index) {

      // get the nodes
      var nodes = this.authoringComponentContent.nodes;

      if (nodes != null) {

        // get the node
        var node = nodes[index];

        if (node != null) {

          // get the file name and label
          var nodeFileName = node.fileName;
          var nodeLabel = node.label;

          // confirm with the author that they really want to delete the node
          var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToDeleteThisNode', { nodeFileName: nodeFileName, nodeLabel: nodeLabel }));

          if (answer) {
            /*
             * the author is sure they want to delete the node so we
             * will remove it from the array
             */
            nodes.splice(index, 1);

            /*
             * the author has made changes so we will save the component
             * content
             */
            this.authoringViewComponentChanged();
          }
        }
      }
    }

    /**
     * A link up button was clicked in the authoring tool so we will move the
     * link up
     * @param index the index of the link
     */

  }, {
    key: 'authoringViewLinkUpButtonClicked',
    value: function authoringViewLinkUpButtonClicked(index) {

      // check if the link is at the top
      if (index != 0) {

        // get the links
        var links = this.authoringComponentContent.links;

        if (links != null) {

          // get a link
          var link = links[index];

          if (link != null) {

            // remove the link
            links.splice(index, 1);

            // add the link back in one index back
            links.splice(index - 1, 0, link);

            /*
             * the author has made changes so we will save the component
             * content
             */
            this.authoringViewComponentChanged();
          }
        }
      }
    }

    /**
     * A link down button was clicked in the authoring tool so we will move the
     * link down
     * @param index the index of the link
     */

  }, {
    key: 'authoringViewLinkDownButtonClicked',
    value: function authoringViewLinkDownButtonClicked(index) {

      // get the links
      var links = this.authoringComponentContent.links;

      // check if the link is at the bottom
      if (links != null && index != links.length - 1) {
        // the node is not at the bottom so we can move it down

        if (links != null) {

          // get the link
          var link = links[index];

          if (link != null) {

            // remove the link
            links.splice(index, 1);

            // add the link back in one index ahead
            links.splice(index + 1, 0, link);

            /*
             * the author has made changes so we will save the component
             * content
             */
            this.authoringViewComponentChanged();
          }
        }
      }
    }

    /**
     * A link delete button was clicked in the authoring tool so we remove the
     * link
     * @param index the index of the link
     */

  }, {
    key: 'authoringViewLinkDeleteButtonClicked',
    value: function authoringViewLinkDeleteButtonClicked(index) {

      // get the links
      var links = this.authoringComponentContent.links;

      if (links != null) {

        // get a link
        var link = links[index];

        if (link != null) {

          // get the link label
          var linkLabel = link.label;

          // confirm with the author that they really want to delete the link
          var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToDeleteThisLink', { linkLabel: linkLabel }));

          if (answer) {
            /*
             * the author is sure they want to delete the link so we
             * will remove it from the array
             */
            links.splice(index, 1);

            /*
             * the author has made changes so we will save the component
             * content
             */
            this.authoringViewComponentChanged();
          }
        }
      }
    }

    /**
     * Add a node in the authoring tool
     */

  }, {
    key: 'authoringViewAddNode',
    value: function authoringViewAddNode() {

      // get a new node id
      var id = this.authoringGetNewConceptMapNodeId();

      // create the new node
      var newNode = {};
      newNode.id = id;
      newNode.label = '';
      newNode.fileName = '';
      newNode.width = 100;
      newNode.height = 100;

      // get the nodes
      var nodes = this.authoringComponentContent.nodes;

      // add the new node
      nodes.push(newNode);

      /*
       * the author has made changes so we will save the component
       * content
       */
      this.authoringViewComponentChanged();
    }

    /**
     * Get the concept map node with the given id
     * @param nodeId the concept map node id
     * @return the concept map node with the given node id
     */

  }, {
    key: 'authoringViewGetNodeById',
    value: function authoringViewGetNodeById(nodeId) {

      if (nodeId != null && this.authoringComponentContent != null && this.authoringComponentContent.nodes != null) {

        // loop through all the concept map nodes
        for (var n = 0; n < this.authoringComponentContent.nodes.length; n++) {
          var node = this.authoringComponentContent.nodes[n];

          if (node != null) {
            if (nodeId === node.id) {
              // we have found the concept map node that we want
              return node;
            }
          }
        }
      }

      return null;
    }

    /**
     * Add a link in the authoring tool
     */

  }, {
    key: 'authoringViewAddLink',
    value: function authoringViewAddLink() {

      // get a new link id
      var id = this.authoringGetNewConceptMapLinkId();

      // create a new link
      var newLink = {};
      newLink.id = id;
      newLink.label = '';
      newLink.color = '';

      // get the links
      var links = this.authoringComponentContent.links;

      // add the new link
      links.push(newLink);

      /*
       * the author has made changes so we will save the component
       * content
       */
      this.authoringViewComponentChanged();
    }

    /**
     * Get a new ConceptMapNode id that isn't being used
     * @returns a new ConceptMapNode id e.g. 'node3'
     */

  }, {
    key: 'authoringGetNewConceptMapNodeId',
    value: function authoringGetNewConceptMapNodeId() {

      var nextAvailableNodeIdNumber = 1;

      // array to remember the numbers that have been used in node ids already
      var usedNumbers = [];

      // loop through all the nodes
      for (var x = 0; x < this.authoringComponentContent.nodes.length; x++) {
        var node = this.authoringComponentContent.nodes[x];

        if (node != null) {

          // get the node id
          var nodeId = node.id;

          if (nodeId != null) {

            // get the number from the node id
            var nodeIdNumber = parseInt(nodeId.replace('node', ''));

            if (nodeIdNumber != null) {
              // add the number to the array of used numbers
              usedNumbers.push(nodeIdNumber);
            }
          }
        }
      }

      if (usedNumbers.length > 0) {
        // get the max number used
        var maxNumberUsed = Math.max.apply(Math, usedNumbers);

        if (!isNaN(maxNumberUsed)) {
          // increment the number by 1 to get the next available number
          nextAvailableNodeIdNumber = maxNumberUsed + 1;
        }
      }

      var newId = 'node' + nextAvailableNodeIdNumber;

      return newId;
    }

    /**
     * Get a new ConceptMapLink id that isn't being used
     * @returns a new ConceptMapLink id e.g. 'link3'
     */

  }, {
    key: 'authoringGetNewConceptMapLinkId',
    value: function authoringGetNewConceptMapLinkId() {

      var nextAvailableLinkIdNumber = 1;

      // array to remember the numbers that have been used in link ids already
      var usedNumbers = [];

      // loop through all the nodes
      for (var x = 0; x < this.authoringComponentContent.links.length; x++) {
        var link = this.authoringComponentContent.links[x];

        if (link != null) {

          // get the node id
          var nodeId = link.id;

          if (nodeId != null) {

            // get the number from the node id
            var nodeIdNumber = parseInt(nodeId.replace('link', ''));

            if (nodeIdNumber != null) {
              // add the number to the array of used numbers
              usedNumbers.push(nodeIdNumber);
            }
          }
        }
      }

      if (usedNumbers.length > 0) {
        // get the max number used
        var maxNumberUsed = Math.max.apply(Math, usedNumbers);

        if (!isNaN(maxNumberUsed)) {
          // increment the number by 1 to get the next available number
          nextAvailableLinkIdNumber = maxNumberUsed + 1;
        }
      }

      var newId = 'link' + nextAvailableLinkIdNumber;

      return newId;
    }

    /**
     * A "with link" checkbox was checked
     * @param ruleIndex the index of the rule
     */

  }, {
    key: 'authoringRuleLinkCheckboxClicked',
    value: function authoringRuleLinkCheckboxClicked(ruleIndex) {

      // get the rule that was checked
      var rule = this.authoringComponentContent.rules[ruleIndex];

      if (rule != null) {
        if (rule.type == 'node') {
          /*
           * the rule has been set to 'node' instead of 'link' so we
           * will remove the link label and other node label
           */

          delete rule.linkLabel;
          delete rule.otherNodeLabel;
        }
      }

      // perform updating and saving
      this.authoringViewComponentChanged();
    }

    /**
     * Add a new rule
     */

  }, {
    key: 'authoringAddRule',
    value: function authoringAddRule() {

      // create the new rule
      var newRule = {};
      newRule.name = '';
      newRule.type = 'node';
      newRule.categories = [];
      newRule.nodeLabel = '';
      newRule.comparison = 'exactly';
      newRule.number = 1;
      newRule.not = false;

      // add the rule to the array of rules
      this.authoringComponentContent.rules.push(newRule);

      var showSubmitButton = false;

      if (this.authoringComponentContent.rules.length > 0) {
        // there are scoring rules so we will show the submit button
        showSubmitButton = true;
      }

      // set the value of the showSubmitButton field
      this.setShowSubmitButtonValue(showSubmitButton);

      // perform updating and saving
      this.authoringViewComponentChanged();
    }

    /**
     * Move a rule up
     * @param index the index of the rule
     */

  }, {
    key: 'authoringViewRuleUpButtonClicked',
    value: function authoringViewRuleUpButtonClicked(index) {

      // check if the rule is at the top
      if (index != 0) {
        // the rule is not at the top so we can move it up

        // get the rules
        var rules = this.authoringComponentContent.rules;

        if (rules != null) {

          // get the rule at the given index
          var rule = rules[index];

          // remove the rule
          rules.splice(index, 1);

          // insert the rule back in one index back
          rules.splice(index - 1, 0, rule);

          /*
           * the author has made changes so we will save the component
           * content
           */
          this.authoringViewComponentChanged();
        }
      }
    }

    /**
     * Move a rule down
     * @param index the index of the rule
     */

  }, {
    key: 'authoringViewRuleDownButtonClicked',
    value: function authoringViewRuleDownButtonClicked(index) {

      // get the rules
      var rules = this.authoringComponentContent.rules;

      // check if the rule is at the bottom
      if (rules != null && index != rules.length - 1) {
        // the rule is not at the bottom so we can move it down

        // get the rule at the given index
        var rule = rules[index];

        // remove the rule
        rules.splice(index, 1);

        // insert the rule back in one index ahead
        rules.splice(index + 1, 0, rule);

        /*
         * the author has made changes so we will save the component
         * content
         */
        this.authoringViewComponentChanged();
      }
    }

    /*
     * Delete a rule
     * @param index the index of the rule to delete
     */

  }, {
    key: 'authoringViewRuleDeleteButtonClicked',
    value: function authoringViewRuleDeleteButtonClicked(index) {

      // get the rule
      var rule = this.authoringComponentContent.rules[index];

      if (rule != null) {

        // get the rule name
        var ruleName = rule.name;

        // confirm with the author that they really want to delete the rule
        var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToDeleteThisRule', { ruleName: ruleName }));

        if (answer) {
          // remove the rule at the given index
          this.authoringComponentContent.rules.splice(index, 1);

          // perform updating and saving
          this.authoringViewComponentChanged();
        }
      }

      var showSubmitButton = false;

      if (this.authoringComponentContent.rules.length > 0) {
        // there are scoring rules so we will show the submit button
        showSubmitButton = true;
      }

      // set the value of the showSubmitButton field
      this.setShowSubmitButtonValue(showSubmitButton);
    }

    /**
     * Add a category to a rule
     * @param rule the rule
     */

  }, {
    key: 'authoringViewAddCategoryClicked',
    value: function authoringViewAddCategoryClicked(rule) {

      if (rule != null) {
        // add an empty category name
        rule.categories.push('');
      }

      // perform updating and saving
      this.authoringViewComponentChanged();
    }

    /**
     * Delete a category from a rule
     * @param rule delete a category from this rule
     * @param index the index of the category
     */

  }, {
    key: 'authoringViewDeleteCategoryClicked',
    value: function authoringViewDeleteCategoryClicked(rule, index) {

      if (rule != null) {

        // get the rule name
        var ruleName = rule.name;

        // get the category name
        var categoryName = rule.categories[index];

        // confirm with the author that they really want to delete the category from the rule
        var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToDeleteTheCategory', { ruleName: ruleName, categoryName: categoryName }));

        if (answer) {
          // remove the category at the index
          rule.categories.splice(index, 1);

          // perform updating and saving
          this.authoringViewComponentChanged();
        }
      }
    }

    /**
     * Update the component JSON string that will be displayed in the advanced authoring view textarea
     */

  }, {
    key: 'updateAdvancedAuthoringView',
    value: function updateAdvancedAuthoringView() {
      this.authoringComponentContentJSONString = angular.toJson(this.authoringComponentContent, 4);
    }

    /**
     * Save the starter concept map
     */

  }, {
    key: 'saveStarterConceptMap',
    value: function saveStarterConceptMap() {

      var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToSaveTheStarterConceptMap'));

      if (answer) {
        // get the concept map data
        var conceptMapData = this.getConceptMapData();

        // set the starter concept map data
        this.authoringComponentContent.starterConceptMap = conceptMapData;

        /*
         * the author has made changes so we will save the component
         * content
         */
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Delete the starter concept map
     */

  }, {
    key: 'deleteStarterConceptMap',
    value: function deleteStarterConceptMap() {

      var answer = confirm(this.$translate('conceptMap.areYouSureYouWantToDeleteTheStarterConceptMap'));

      if (answer) {
        // set the starter concept map data
        this.authoringComponentContent.starterConceptMap = null;

        // clear the concept map
        this.clearConceptMap();

        /*
         * the author has made changes so we will save the component
         * content
         */
        this.authoringViewComponentChanged();
      }
    }

    /**
     * The authoring view show save button checkbox was clicked
     */

  }, {
    key: 'authoringViewShowSaveButtonClicked',
    value: function authoringViewShowSaveButtonClicked() {

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * The authoring view show submit button checkbox was clicked
     */

  }, {
    key: 'authoringViewShowSubmitButtonClicked',
    value: function authoringViewShowSubmitButtonClicked() {

      if (!this.authoringComponentContent.showSubmitButton) {
        /*
         * we are not showing the submit button to the student so
         * we will clear the max submit count
         */
        this.authoringComponentContent.maxSubmitCount = null;
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * The author has changed the rubric
     */

  }, {
    key: 'summernoteRubricHTMLChanged',
    value: function summernoteRubricHTMLChanged() {

      // get the summernote rubric html
      var html = this.summernoteRubricHTML;

      /*
       * remove the absolute asset paths
       * e.g.
       * <img src='https://wise.berkeley.edu/curriculum/3/assets/sun.png'/>
       * will be changed to
       * <img src='sun.png'/>
       */
      html = this.ConfigService.removeAbsoluteAssetPaths(html);

      /*
       * replace <a> and <button> elements with <wiselink> elements when
       * applicable
       */
      html = this.UtilService.insertWISELinks(html);

      // update the component rubric
      this.authoringComponentContent.rubric = html;

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Show the asset popup to allow the author to choose the background image
     */

  }, {
    key: 'chooseBackgroundImage',
    value: function chooseBackgroundImage() {

      // generate the parameters
      var params = {};
      params.isPopup = true;
      params.nodeId = this.nodeId;
      params.componentId = this.componentId;
      params.target = 'background';

      // display the asset chooser
      this.$rootScope.$broadcast('openAssetChooser', params);
    }

    /**
     * Show the asset popup to allow the author to choose an image for the node
     * @param conceptMapNodeId the id of the node in the concept map
     */

  }, {
    key: 'chooseNodeImage',
    value: function chooseNodeImage(conceptMapNodeId) {
      // generate the parameters
      var params = {};
      params.isPopup = true;
      params.nodeId = this.nodeId;
      params.componentId = this.componentId;
      params.target = conceptMapNodeId;

      // display the asset chooser
      this.$rootScope.$broadcast('openAssetChooser', params);
    }

    /**
     * Add a connected component
     */

  }, {
    key: 'addConnectedComponent',
    value: function addConnectedComponent() {

      /*
       * create the new connected component object that will contain a
       * node id and component id
       */
      var newConnectedComponent = {};
      newConnectedComponent.nodeId = this.nodeId;
      newConnectedComponent.componentId = null;
      newConnectedComponent.updateOn = 'change';

      // initialize the array of connected components if it does not exist yet
      if (this.authoringComponentContent.connectedComponents == null) {
        this.authoringComponentContent.connectedComponents = [];
      }

      // add the connected component
      this.authoringComponentContent.connectedComponents.push(newConnectedComponent);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Delete a connected component
     * @param index the index of the component to delete
     */

  }, {
    key: 'deleteConnectedComponent',
    value: function deleteConnectedComponent(index) {

      if (this.authoringComponentContent.connectedComponents != null) {
        this.authoringComponentContent.connectedComponents.splice(index, 1);
      }

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Set the show submit button value
     * @param show whether to show the submit button
     */

  }, {
    key: 'setShowSubmitButtonValue',
    value: function setShowSubmitButtonValue(show) {

      if (show == null || show == false) {
        // we are hiding the submit button
        this.authoringComponentContent.showSaveButton = false;
        this.authoringComponentContent.showSubmitButton = false;
      } else {
        // we are showing the submit button
        this.authoringComponentContent.showSaveButton = true;
        this.authoringComponentContent.showSubmitButton = true;
      }

      /*
       * notify the parent node that this component is changing its
       * showSubmitButton value so that it can show save buttons on the
       * step or sibling components accordingly
       */
      this.$scope.$emit('componentShowSubmitButtonValueChanged', { nodeId: this.nodeId, componentId: this.componentId, showSubmitButton: show });
    }

    /**
     * The showSubmitButton value has changed
     */

  }, {
    key: 'showSubmitButtonValueChanged',
    value: function showSubmitButtonValueChanged() {

      /*
       * perform additional processing for when we change the showSubmitButton
       * value
       */
      this.setShowSubmitButtonValue(this.authoringComponentContent.showSubmitButton);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Add a connected component
     */

  }, {
    key: 'authoringAddConnectedComponent',
    value: function authoringAddConnectedComponent() {

      /*
       * create the new connected component object that will contain a
       * node id and component id
       */
      var newConnectedComponent = {};
      newConnectedComponent.nodeId = this.nodeId;
      newConnectedComponent.componentId = null;
      newConnectedComponent.type = null;
      this.authoringAutomaticallySetConnectedComponentComponentIdIfPossible(newConnectedComponent);

      // initialize the array of connected components if it does not exist yet
      if (this.authoringComponentContent.connectedComponents == null) {
        this.authoringComponentContent.connectedComponents = [];
      }

      // add the connected component
      this.authoringComponentContent.connectedComponents.push(newConnectedComponent);

      // the authoring component content has changed so we will save the project
      this.authoringViewComponentChanged();
    }

    /**
     * Automatically set the component id for the connected component if there
     * is only one viable option.
     * @param connectedComponent the connected component object we are authoring
     */

  }, {
    key: 'authoringAutomaticallySetConnectedComponentComponentIdIfPossible',
    value: function authoringAutomaticallySetConnectedComponentComponentIdIfPossible(connectedComponent) {
      if (connectedComponent != null) {
        var components = this.getComponentsByNodeId(connectedComponent.nodeId);
        if (components != null) {
          var numberOfAllowedComponents = 0;
          var allowedComponent = null;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var component = _step.value;

              if (component != null) {
                if (this.isConnectedComponentTypeAllowed(component.type) && component.id != this.componentId) {
                  // we have found a viable component we can connect to
                  numberOfAllowedComponents += 1;
                  allowedComponent = component;
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (numberOfAllowedComponents == 1) {
            /*
             * there is only one viable component to connect to so we
             * will use it
             */
            connectedComponent.componentId = allowedComponent.id;
            connectedComponent.type = 'importWork';
            this.authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent);
          }
        }
      }
    }

    /**
     * Delete a connected component
     * @param index the index of the component to delete
     */

  }, {
    key: 'authoringDeleteConnectedComponent',
    value: function authoringDeleteConnectedComponent(index) {

      // ask the author if they are sure they want to delete the connected component
      var answer = confirm(this.$translate('areYouSureYouWantToDeleteThisConnectedComponent'));

      if (answer) {
        // the author answered yes to delete

        if (this.authoringComponentContent.connectedComponents != null) {
          this.authoringComponentContent.connectedComponents.splice(index, 1);
        }

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Get the connected component type
     * @param connectedComponent get the component type of this connected component
     * @return the connected component type
     */

  }, {
    key: 'authoringGetConnectedComponentType',
    value: function authoringGetConnectedComponentType(connectedComponent) {

      var connectedComponentType = null;

      if (connectedComponent != null) {

        // get the node id and component id of the connected component
        var nodeId = connectedComponent.nodeId;
        var componentId = connectedComponent.componentId;

        // get the component
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(nodeId, componentId);

        if (component != null) {
          // get the component type
          connectedComponentType = component.type;
        }
      }

      return connectedComponentType;
    }

    /**
     * The connected component node id has changed
     * @param connectedComponent the connected component that has changed
     */

  }, {
    key: 'authoringConnectedComponentNodeIdChanged',
    value: function authoringConnectedComponentNodeIdChanged(connectedComponent) {
      if (connectedComponent != null) {
        connectedComponent.componentId = null;
        connectedComponent.type = null;
        delete connectedComponent.importWorkAsBackground;
        this.authoringAutomaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * The connected component component id has changed
     * @param connectedComponent the connected component that has changed
     */

  }, {
    key: 'authoringConnectedComponentComponentIdChanged',
    value: function authoringConnectedComponentComponentIdChanged(connectedComponent) {

      if (connectedComponent != null) {

        // default the type to import work
        connectedComponent.type = 'importWork';
        this.authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent);

        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * If the component type is a certain type, we will set the importWorkAsBackground
     * field to true.
     * @param connectedComponent The connected component object.
     */

  }, {
    key: 'authoringSetImportWorkAsBackgroundIfApplicable',
    value: function authoringSetImportWorkAsBackgroundIfApplicable(connectedComponent) {
      var componentType = this.authoringGetConnectedComponentType(connectedComponent);
      if (componentType == 'Draw' || componentType == 'Embedded' || componentType == 'Graph' || componentType == 'Label' || componentType == 'Table') {
        connectedComponent.importWorkAsBackground = true;
      } else {
        delete connectedComponent.importWorkAsBackground;
      }
    }

    /**
     * The connected component type has changed
     * @param connectedComponent the connected component that changed
     */

  }, {
    key: 'authoringConnectedComponentTypeChanged',
    value: function authoringConnectedComponentTypeChanged(connectedComponent) {

      if (connectedComponent != null) {

        if (connectedComponent.type == 'importWork') {
          /*
           * the type has changed to import work
           */
        } else if (connectedComponent.type == 'showWork') {}
        /*
         * the type has changed to show work
         */


        // the authoring component content has changed so we will save the project
        this.authoringViewComponentChanged();
      }
    }

    /**
     * Check if we are allowed to connect to this component type
     * @param componentType the component type
     * @return whether we can connect to the component type
     */

  }, {
    key: 'isConnectedComponentTypeAllowed',
    value: function isConnectedComponentTypeAllowed(componentType) {

      if (componentType != null) {

        var allowedConnectedComponentTypes = this.allowedConnectedComponentTypes;

        // loop through the allowed connected component types
        for (var a = 0; a < allowedConnectedComponentTypes.length; a++) {
          var allowedConnectedComponentType = allowedConnectedComponentTypes[a];

          if (allowedConnectedComponentType != null) {
            if (componentType == allowedConnectedComponentType.type) {
              // the component type is allowed
              return true;
            }
          }
        }
      }

      return false;
    }

    /**
     * The show JSON button was clicked to show or hide the JSON authoring
     */

  }, {
    key: 'showJSONButtonClicked',
    value: function showJSONButtonClicked() {
      // toggle the JSON authoring textarea
      this.showJSONAuthoring = !this.showJSONAuthoring;

      if (this.jsonStringChanged && !this.showJSONAuthoring) {
        /*
         * the author has changed the JSON and has just closed the JSON
         * authoring view so we will save the component
         */
        this.advancedAuthoringViewComponentChanged();

        // scroll to the top of the component
        this.$rootScope.$broadcast('scrollToComponent', { componentId: this.componentId });

        this.jsonStringChanged = false;
      }
    }

    /**
     * The author has changed the JSON manually in the advanced view
     */

  }, {
    key: 'authoringJSONChanged',
    value: function authoringJSONChanged() {
      this.jsonStringChanged = true;
    }

    /**
     * The "Import Work As Background" checkbox was clicked.
     * @param connectedComponent The connected component associated with the
     * checkbox.
     */

  }, {
    key: 'authoringImportWorkAsBackgroundClicked',
    value: function authoringImportWorkAsBackgroundClicked(connectedComponent) {
      if (!connectedComponent.importWorkAsBackground) {
        delete connectedComponent.importWorkAsBackground;
      }
      this.authoringViewComponentChanged();
    }
  }, {
    key: 'submit',
    value: function submit(submitTriggeredBy) {
      _get(ConceptMapAuthoringController.prototype.__proto__ || Object.getPrototypeOf(ConceptMapAuthoringController.prototype), 'submit', this).call(this, submitTriggeredBy);

      /*
       * set values appropriately here because the 'componentSubmitTriggered'
       * event won't work in authoring mode
       */
      this.isDirty = false;
      this.isSubmitDirty = false;
      this.createComponentState('submit');
    }
  }]);

  return ConceptMapAuthoringController;
}(_conceptMapController2.default);

ConceptMapAuthoringController.$inject = ['$anchorScroll', '$filter', '$location', '$mdDialog', '$q', '$rootScope', '$scope', '$timeout', 'AnnotationService', 'ConceptMapService', 'ConfigService', 'CRaterService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentAssetService', 'StudentDataService', 'UtilService'];

exports.default = ConceptMapAuthoringController;
//# sourceMappingURL=conceptMapAuthoringController.js.map
