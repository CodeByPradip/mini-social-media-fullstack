// src/theme/theme.js

export const COLORS = {
  // ===========================
  // Brand Colors
  // ===========================
  primary: "#4346f7",
  primaryLight: "#A78BFA",
  primaryDark: "#5B21B6",

  accent: "#EC4899",

  // ===========================
  // Backgrounds
  // ===========================
  // background: "#0F172A",
  background: "#000000",
  surface: "#0d0d0d",
  card: "#334155",
  elevated: "#475569",

  // ===========================
  // Text
  // ===========================
  text: "#FFFFFF",
  textSecondary: "#a0a7af",
  textMuted: "#777",
  placeholder: "#64748B",

  // ===========================
  // Border
  // ===========================
  border: "#334155",
  divider: "#1E293B",

  // ===========================
  // Status
  // ===========================
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  // ===========================
  // Social
  // ===========================
  online: "#22C55E",
  offline: "#64748B",

  // ===========================
  // Overlay
  // ===========================
  overlay: "rgba(0,0,0,0.55)",
  shadow: "rgba(0,0,0,0.25)",

  // ===========================
  // White & Black
  // ===========================
  white: "#FFFFFF",
  black: "#000000",

  // input bg placeholder color
  inputBg: "rgba(255, 255, 255, 0.06)",
};

export const GRADIENTS = {
  // Login Screen
  login: ["#0F172A", "#1E1B4B", "#312E81"],

  // signup Screen
  signup: ["#0B0F19", "#1F1B3A", "#312E81"],

  // Splash Screen
  splash: ["#020617", "#0F172A", "#1E1B4B"],

  // Primary Buttons
  primaryButton: ["#7C3AED", "#EC4899"],

  // Stories Ring
  storyRing: ["#F59E0B", "#EC4899"],

  // Premium
  premium: ["#7C3AED", "#3B82F6"],

  // Success
  success: ["#22C55E", "#14B8A6"],

  // Warning
  warning: ["#F59E0B", "#EF4444"],
};

export const FONT_SIZE = {
  xxs:9,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  hero: 49,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  large: 50,
  screenHorizontal: 20,
  screenVertical: 16,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  round: 999,
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  button: {
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const THEME = {
  COLORS,
  GRADIENTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  SHADOW,
};

export default THEME;
