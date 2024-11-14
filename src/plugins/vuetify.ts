// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";

export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
    breakpoints: { mobile: 600, tablet: 960, desktop: 1280 },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          surface: "#F8F4FE",
          primary: "#7211FB",
          secondary: "#03DAC6",
          error: "#E33636",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FBB400",
          white: "#FFFFFF",
        },
      },
    },
  },
});
