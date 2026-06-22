import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#155e75",
      light: "#2c8ea5",
      dark: "#0f3f4f",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#f97316",
      light: "#fb923c",
      dark: "#c2410c",
      contrastText: "#ffffff"
    },
    success: {
      main: "#15803d"
    },
    warning: {
      main: "#d97706"
    },
    error: {
      main: "#dc2626"
    },
    background: {
      default: "#f6f8f7",
      paper: "#ffffff"
    },
    text: {
      primary: "#102027",
      secondary: "#5d6b72"
    },
    divider: "rgba(15, 63, 79, 0.12)"
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: 0
    },
    h5: {
      fontWeight: 750,
      letterSpacing: 0
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: "none"
    }
  },
  shadows: [
    "none",
    "0 1px 2px rgba(16, 32, 39, 0.06)",
    "0 8px 24px rgba(16, 32, 39, 0.08)",
    "0 12px 32px rgba(16, 32, 39, 0.10)",
    "0 16px 40px rgba(16, 32, 39, 0.12)",
    "0 20px 48px rgba(16, 32, 39, 0.14)",
    "0 24px 56px rgba(16, 32, 39, 0.16)",
    "0 28px 64px rgba(16, 32, 39, 0.18)",
    "0 32px 72px rgba(16, 32, 39, 0.20)",
    "0 36px 80px rgba(16, 32, 39, 0.22)",
    "0 40px 88px rgba(16, 32, 39, 0.24)",
    "0 44px 96px rgba(16, 32, 39, 0.26)",
    "0 48px 104px rgba(16, 32, 39, 0.28)",
    "0 52px 112px rgba(16, 32, 39, 0.30)",
    "0 56px 120px rgba(16, 32, 39, 0.32)",
    "0 60px 128px rgba(16, 32, 39, 0.34)",
    "0 64px 136px rgba(16, 32, 39, 0.36)",
    "0 68px 144px rgba(16, 32, 39, 0.38)",
    "0 72px 152px rgba(16, 32, 39, 0.40)",
    "0 76px 160px rgba(16, 32, 39, 0.42)",
    "0 80px 168px rgba(16, 32, 39, 0.44)",
    "0 84px 176px rgba(16, 32, 39, 0.46)",
    "0 88px 184px rgba(16, 32, 39, 0.48)",
    "0 92px 192px rgba(16, 32, 39, 0.50)",
    "0 96px 200px rgba(16, 32, 39, 0.52)"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f7fbfa 0%, #edf7f5 44%, #fff7ed 100%)",
          color: "#102027"
        },
        "::selection": {
          background: "rgba(249, 115, 22, 0.24)"
        },
        "*": {
          boxSizing: "border-box"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 30px rgba(15, 63, 79, 0.12)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 40
        },
        contained: {
          "&.MuiButton-colorPrimary": {
            background: "linear-gradient(135deg, #155e75 0%, #0f766e 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #0f3f4f 0%, #115e59 100%)"
            }
          },
          "&.MuiButton-colorSecondary": {
            background: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(15, 63, 79, 0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.90) 100%)",
          boxShadow: "0 14px 36px rgba(16, 32, 39, 0.08)",
          transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgba(21, 94, 117, 0.22)",
            boxShadow: "0 18px 48px rgba(16, 32, 39, 0.13)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        },
        rounded: {
          borderRadius: 8
        },
        elevation1: {
          border: "1px solid rgba(15, 63, 79, 0.10)",
          boxShadow: "0 12px 32px rgba(16, 32, 39, 0.08)"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.76)"
        }
      }
    }
  }
});

export default theme;
