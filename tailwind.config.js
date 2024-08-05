/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  prefix: "plasmo-",
  theme: {
    extend: {
      spacing: {
        15: "60px",
        90: "360px",
        145: "580px",
        80.5: "320px"
      }
    }
  }
}
