import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      'phc_8azpCMuXkWOiVslIDoD1hAKQcRZYlGBFYeuQsDFOB0F',
      {
        api_host: 'https://posthog.52cebu.com',
      }
    );
  },
};


// //./plugins/posthog.js
// import posthog from "posthog-js";

// export default {
//   install(app) {
//     app.config.globalProperties.$posthog = posthog.init(
//       'phc_c7MYcPtgmLzqsg7drAVIgdjagf629JYmqaug1K473YI',
//       {
//         api_host: 'https://us.i.posthog.com',
//       }
//     );
//   },
// };
