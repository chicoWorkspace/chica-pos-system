export const productPaletteDemo = {
  meta: {
    name: "product-palette-demo",
    route: "/product-palette-demo",
    direction: "Graphite + Indigo",
    description:
      "Dark premium product-management palette based on semantic tokens.",
  },
  colors: {
    background: {
      appBg: "#0F1115",
      surface1: "#171A21",
      surface2: "#1E2430",
      surface3: "#141922",
      surfaceOverlay: "#11151B",
    },
    primary: {
      base: "#6F7BF7",
      hover: "#5C67E8",
      soft: "rgba(111,123,247,0.14)",
      border: "rgba(111,123,247,0.25)",
    },
    semantic: {
      success: "#34C38F",
      successSoft: "rgba(52,195,143,0.10)",
      warning: "#F5B546",
      warningSoft: "rgba(245,181,70,0.12)",
      danger: "#E35D6A",
      dangerSoft: "rgba(227,93,106,0.10)",
    },
    text: {
      main: "#F3F5F7",
      strong: "#D9DEEA",
      sub: "#98A2B3",
      muted: "#6B7280",
      inverse: "#FFFFFF",
    },
    border: {
      default: "rgba(255,255,255,0.10)",
      strong: "#222834",
    },
  },
  componentRules: {
    page: {
      background: "background.appBg",
    },
    card: {
      default: "background.surface1",
      secondary: "background.surface2",
    },
    toolbar: {
      background: "background.surface2",
      text: "text.strong",
      border: "border.default",
    },
    table: {
      headerBackground: "background.surface2",
      headerText: "text.strong",
      rowOdd: "background.surface3",
      rowEven: "background.surface1",
      rowHover: "background.surface2",
      border: "border.strong",
    },
    button: {
      primary: {
        background: "primary.base",
        hover: "primary.hover",
        text: "text.inverse",
      },
      secondary: {
        background: "background.surface2",
        border: "border.default",
        text: "text.strong",
      },
      danger: {
        background: "semantic.dangerSoft",
        border: "rgba(227,93,106,0.25)",
        text: "#FFCCD2",
      },
    },
    badge: {
      active: {
        background: "primary.soft",
        border: "primary.border",
        text: "#D5D9FF",
      },
      success: {
        background: "semantic.successSoft",
        border: "rgba(52,195,143,0.20)",
        text: "#B8F1DA",
      },
      warning: {
        background: "semantic.warningSoft",
        border: "rgba(245,181,70,0.25)",
        text: "#F3D59D",
      },
      danger: {
        background: "semantic.dangerSoft",
        border: "rgba(227,93,106,0.25)",
        text: "#FFCCD2",
      },
    },
    input: {
      background: "background.surface2",
      border: "border.default",
      text: "text.main",
      placeholder: "text.sub",
      focus: "primary.base",
    },
    dialog: {
      shell: "background.surfaceOverlay",
      section: "background.surface1",
      field: "background.surface2",
      title: "text.main",
      subtitle: "text.sub",
    },
    feedback: {
      success: "semantic.success",
      warning: "semantic.warning",
      danger: "semantic.danger",
    },
  },
  states: [
    "default",
    "hover",
    "active",
    "selected",
    "focus-visible",
    "disabled",
    "loading",
    "empty",
    "success",
    "warning",
    "danger",
  ],
  antiPatterns: [
    "Do not use cyan as the main accent for the product module.",
    "Do not mix blue, violet, orange, and pink as competing primary accents.",
    "Do not style list, dialog, and form as separate visual systems.",
    "Do not add one-off color classes before updating the token system.",
  ],
} as const;

export type ProductPaletteDemo = typeof productPaletteDemo;
