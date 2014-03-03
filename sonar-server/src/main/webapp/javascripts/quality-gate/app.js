// Generated by CoffeeScript 1.6.3
(function() {
  requirejs.config({
    baseUrl: "" + baseUrl + "/javascripts",
    paths: {
      'jquery': 'third-party/jquery',
      'backbone': 'third-party/backbone',
      'backbone.marionette': 'third-party/backbone.marionette',
      'handlebars': 'third-party/handlebars',
      'moment': 'third-party/moment',
      'select-list': 'common/select-list'
    },
    shim: {
      'backbone.marionette': {
        deps: ['backbone'],
        exports: 'Marionette'
      },
      'backbone': {
        exports: 'Backbone'
      },
      'handlebars': {
        exports: 'Handlebars'
      },
      'moment': {
        exports: 'moment'
      },
      'select-list': {
        exports: 'SelectList'
      }
    }
  });

  requirejs(['backbone', 'backbone.marionette', 'handlebars', 'quality-gate/collections/quality-gates', 'quality-gate/collections/metrics', 'quality-gate/views/quality-gate-sidebar-list-view', 'quality-gate/views/quality-gate-actions-view', 'quality-gate/views/quality-gate-edit-view', 'quality-gate/router', 'quality-gate/layout', 'common/handlebars-extensions'], function(Backbone, Marionette, Handlebars, QualityGates, Metrics, QualityGateSidebarListItemView, QualityGateActionsView, QualityGateEditView, QualityGateRouter, QualityGateLayout) {
    var App, qualityGatesXHR;
    jQuery.ajaxSetup({
      error: function(jqXHR) {
        var _ref;
        if (((_ref = jqXHR.responseJSON) != null ? _ref.errors : void 0) != null) {
          return alert(_.pluck(jqXHR.responseJSON.errors, 'msg').join('. '));
        } else {
          return alert(jqXHR.responseText);
        }
      }
    });
    jQuery('html').addClass('navigator-page quality-gates-page');
    App = new Marionette.Application;
    App.metrics = new Metrics;
    App.qualityGates = new QualityGates;
    App.openFirstQualityGate = function() {
      if (this.qualityGates.length > 0) {
        return this.router.navigate("show/" + (this.qualityGates.models[0].get('id')), {
          trigger: true
        });
      } else {
        return App.layout.contentRegion.reset();
      }
    };
    App.deleteQualityGate = function(id) {
      App.qualityGates.remove(id);
      return App.openFirstQualityGate();
    };
    App.unsetDefaults = function(id) {
      return App.qualityGates.each(function(gate) {
        if (gate.id !== id) {
          return gate.set('default', false);
        }
      });
    };
    App.addInitializer(function() {
      this.layout = new QualityGateLayout;
      return jQuery('body').append(this.layout.render().el);
    });
    App.addInitializer(function() {
      this.qualityGateActionsView = new QualityGateActionsView({
        app: this
      });
      return this.layout.actionsRegion.show(this.qualityGateActionsView);
    });
    App.addInitializer(function() {
      this.qualityGateSidebarListView = new QualityGateSidebarListItemView({
        collection: this.qualityGates,
        app: this
      });
      return this.layout.listRegion.show(this.qualityGateSidebarListView);
    });
    App.addInitializer(function() {
      this.qualityGateEditView = new QualityGateEditView({
        app: this
      });
      return this.qualityGateEditView.render();
    });
    App.addInitializer(function() {
      this.router = new QualityGateRouter({
        app: this
      });
      return Backbone.history.start();
    });
    App.addInitializer(function() {
      var initial;
      initial = Backbone.history.fragment === '';
      if (initial) {
        return App.openFirstQualityGate();
      }
    });
    qualityGatesXHR = App.qualityGates.fetch();
    return jQuery.when(App.metrics.fetch(), qualityGatesXHR).done(function() {
      App.canEdit = false;
      jQuery('.quality-gate-page-loader').remove();
      return App.start();
    });
  });

}).call(this);
