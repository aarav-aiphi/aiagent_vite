// Azure Application Insights configuration

export const initializeAppInsights = () => {
  if (typeof window !== 'undefined') {
    const appInsights = window.appInsights || function (config) {
      function i(config) {
        t[config] = function () {
          const i = arguments;
          t.queue.push(() => { t[config].apply(t, i); });
        };
      }
      
      const t = { config };
      t.initialize = true;
      t.queue = [];
      
      const methods = [
        'trackEvent',
        'trackPageView',
        'trackException',
        'trackTrace',
        'trackDependency',
        'trackMetric',
        'flush',
        'setAuthenticatedUserContext',
        'clearAuthenticatedUserContext'
      ];
      
      methods.forEach(i);
      
      return t;
    };
    
    const connectionString = process.env.VITE_APPINSIGHTS_CONNECTION_STRING || '';
    
    if (connectionString) {
      window.appInsights = appInsights({
        connectionString,
        enableAutoRouteTracking: true
      });
      
      window.appInsights.trackPageView();
    }
  }
}; 