/**
 * 🎨 COLOR CONSTANTS - GOLDEN ESSENCE RESTAURANT
 * 
 * Centralized color definitions for luxurious dining experience
 * Professional Warm Gold & Deep Navy color palette
 * 
 * USAGE IN COMPONENTS:
 * import { COLORS } from './constants/COLORS';
 * className={`${COLORS.PRIMARY_BACKGROUND.NAVY_900} ${COLORS.TEXT.WHITE}`}
 */

export const COLORS = {
  // ============== PRIMARY COLORS ==============
  
  PRIMARY_BACKGROUND: {
    // Deep Navy - Main backgrounds, navbars, sections
    NAVY_900: "bg-slate-900",          // #0f172a - Darkest navy
    NAVY_800: "bg-slate-800",          // #1e293b - Dark navy
    NAVY_900_ALPHA: "bg-slate-900/90",  // 90% opacity
    NAVY_800_ALPHA: "bg-slate-800/90",  // 90% opacity
    GRADIENT_DARK: "bg-gradient-to-br from-slate-900 to-slate-800",
    GRADIENT_DARK_OVERLAY: "bg-gradient-to-r from-slate-900/70 to-slate-800/70",
  },

  ACCENT: {
    // Warm Gold - Buttons, highlights, CTAs, borders
    GOLD_600: "bg-amber-600",          // #d97706 - Primary gold
    GOLD_700: "bg-amber-700",          // #b45309 - Darker gold
    GOLD_500: "bg-amber-500",          // #f59e0b - Lighter gold
    GRADIENT_GOLD: "bg-gradient-to-r from-amber-600 to-amber-500",
    GRADIENT_GOLD_HOVER: "hover:from-amber-700 hover:to-amber-600",
  },

  SECONDARY: {
    // Slate Gray - Secondary text, borders, subtle elements
    LIGHT_50: "bg-slate-50",           // #f8fafc - Very light
    LIGHT_100: "bg-slate-100",         // #f1f5f9 - Light
    GRAY_400: "bg-slate-400",          // #94a3b8 - Medium gray
    GRAY_600: "bg-slate-600",          // #475569 - Dark gray
    GRAY_700: "bg-slate-700",          // #334155 - Very dark gray
  },

  LIGHT_SECTIONS: {
    // Light backgrounds for contrast sections
    LIGHT_TO_WHITE: "bg-gradient-to-br from-slate-50 to-white",
  },

  // ============== TEXT COLORS ==============

  TEXT: {
    WHITE: "text-white",
    DARK: "text-slate-900",
    SECONDARY: "text-slate-600",
    LIGHT_SECONDARY: "text-slate-300",
    ACCENT_GOLD: "text-amber-400",
    ACCENT_GOLD_DARK: "text-amber-600",
    ERROR: "text-amber-300",
    SUCCESS: "text-amber-400",
  },

  // ============== BORDER COLORS ==============

  BORDERS: {
    LIGHT: "border-amber-200",         // Light theme borders
    DARK: "border-amber-600",          // Dark theme borders
    SUBTLE: "border-slate-600",        // Form input borders
    SUBTLE_FOCUS: "focus:border-amber-400",  // Input focus
    GOLD_FOCUS: "focus:border-amber-400",
    GOLD_SUBTLE: "border-amber-500/40",  // Very subtle gold
    GOLD_LIGHT: "border-amber-200/50",   // Light gold
  },

  // ============== SHADOW & EFFECTS ==============

  SHADOWS: {
    BUTTON: "shadow-lg",
    MODAL: "shadow-xl",
    GOLD_TINTED: "hover:shadow-amber-500/50",
  },

  TRANSITIONS: {
    STANDARD: "transition duration-300",
  },

  OPACITY: {
    OVERLAY_LIGHT: "bg-black/50",
    OVERLAY_DARK: "bg-gradient-to-b from-slate-900/60 to-black/70",
    GRADIENT_FADE_UP: "from-slate-900/70 to-slate-800/70",
    GRADIENT_FADE_DOWN: "bg-gradient-to-t from-slate-900/90 to-transparent",
  },

  // ============== COMPONENT-SPECIFIC STYLES ==============

  COMPONENTS: {
    NAV_BAR: {
      background: "bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur",
      text: "text-white",
      link_hover: "hover:text-amber-400",
      border: "border-amber-200",
      transition: "transition duration-300",
    },

    PRIMARY_BUTTON: {
      background: "bg-gradient-to-r from-amber-600 to-amber-500",
      hover: "hover:from-amber-700 hover:to-amber-600",
      text: "text-white",
      shadow: "shadow-lg",
      padding: "px-6 py-2",
      style: "rounded-lg",
      transition: "transition duration-300",
    },

    SECONDARY_BUTTON: {
      background: "bg-slate-700",
      hover: "hover:bg-slate-600",
      text: "text-white",
      padding: "px-6 py-2",
      style: "rounded-lg",
      transition: "transition duration-300",
    },

    FORM_INPUT: {
      background: "bg-transparent",
      border: "border-b border-slate-600",
      focus_border: "focus:border-amber-400",
      text: "text-white",
      placeholder: "placeholder-slate-400",
      outline: "focus:outline-none",
      transition: "transition",
    },

    DARK_CARD: {
      background: "bg-slate-800",
      border: "border border-amber-600",
      text: "text-white",
      shadow: "shadow-lg",
      rounded: "rounded-lg",
      padding: "p-6",
    },

    LIGHT_CARD: {
      background: "bg-slate-50",
      border: "border border-amber-200",
      text: "text-slate-900",
      shadow: "shadow-md",
      rounded: "rounded-lg",
      padding: "p-6",
      hover: "hover:bg-amber-50",
    },

    FORM_CONTAINER: {
      background: "bg-slate-900",
      border: "border border-amber-500",
      shadow: "shadow-2xl",
      rounded: "rounded-lg",
      overflow: "overflow-hidden",
    },

    AUTH_PANEL_GRADIENT: {
      background: "bg-gradient-to-br from-amber-600 to-amber-700",
      text: "text-white",
    },

    PAYMENT_CARD: {
      background: "bg-slate-800",
      border: "border border-amber-600",
      header_text: "text-white",
      amount_text: "text-amber-400",
    },

    DROPDOWN_MENU: {
      background: "bg-slate-50",
      text: "text-slate-900",
      border: "border-b border-amber-200",
      hover_bg: "hover:bg-amber-50",
      shadow: "shadow-lg",
      rounded: "rounded-lg",
    },

    ICON: {
      dark_theme: "text-amber-400",
      light_theme: "text-amber-600",
    },

    BADGE: {
      special_bg: "bg-amber-600",
      special_text: "text-white",
      padding: "px-3 py-1",
      rounded: "rounded-full",
      size: "text-sm",
    },
  },

  // ============== HEX COLOR CODES ==============

  HEX: {
    SLATE_900: "#0f172a",
    SLATE_800: "#1e293b",
    SLATE_700: "#334155",
    SLATE_600: "#475569",
    SLATE_50: "#f8fafc",
    SLATE_100: "#f1f5f9",
    AMBER_700: "#b45309",
    AMBER_600: "#d97706",
    AMBER_500: "#f59e0b",
    AMBER_400: "#fbbf24",
    AMBER_300: "#fcd34d",
    WHITE: "#ffffff",
  },
};

export default COLORS;
