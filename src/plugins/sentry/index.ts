import type { App } from 'vue'
import * as Sentry from "@sentry/vue";

const initSentry = (app: App<Element>, router) =>{
  Sentry.init({
    app,
    dsn: "https://2117ae7681e9419498b1c264e7cf24ca@sentry.52cebu.com/21",
    environment: import.meta.env.MODE, // 显式设置环境
    // This enables automatic instrumentation (highly recommended),
    // but is not necessary for purely manual usage
    // If you only want to use custom instrumentation:
    // * Remove the BrowserTracing integration
    // * add Sentry.addTracingExtensions() above your Sentry.init() call
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // Set tracePropagationTargets to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      "localhost",
      ...(import.meta.env.VITE_CRM_URL
        ? [import.meta.env.VITE_CRM_URL.replace(/^https?:\/\//, "")]
        : []), // 仅当 VITE_CRM_URL 存在时才加入
      ...(import.meta.env.VITE_BASE_URL
        ? [import.meta.env.VITE_BASE_URL.replace(/^https?:\/\//, "")]
        : []), // 仅当 VITE_BASE_URL 存在时才加入
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}


export default initSentry
