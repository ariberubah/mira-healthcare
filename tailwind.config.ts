const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
        body: ["var(--font-body)"],
      },
      colors: {
        hud: {
          bg: "#050B18",
          surface: "#0A1628",
          cyan: "#00D4FF",
          green: "#00FF88",
          amber: "#FFB800",
          red: "#FF3B5C",
          text: "#E8F4FD",
          muted: "#5B8DB8",
        },
      },
      boxShadow: {
        cyan: "0 0 20px rgba(0, 212, 255, 0.3)",
        green: "0 0 20px rgba(0, 255, 136, 0.3)",
        red: "0 0 20px rgba(255, 59, 92, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;