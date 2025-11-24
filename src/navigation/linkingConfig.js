const linking = {
  prefixes: [
    'https://digitattva.pages.dev',
    'digitattva://',
  ],
  config: {
    screens: {
      App: {
        screens: {
          MainTabs: {
            screens: {
              Home: 'home',
            },
          },
          ProductDetails: 'product/:id',
        },
      },
    },
  },
};

export default linking;
