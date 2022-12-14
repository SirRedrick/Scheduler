/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-work-sans)"],
      },
      colors: {
        slate: {
          1: "hsl(206, 30.0%, 98.8%)",
          2: "hsl(210, 16.7%, 97.6%)",
          3: "hsl(209, 13.3%, 95.3%)",
          4: "hsl(209, 12.2%, 93.2%)",
          5: "hsl(208, 11.7%, 91.1%)",
          6: "hsl(208, 11.3%, 88.9%)",
          7: "hsl(207, 11.1%, 85.9%)",
          8: "hsl(205, 10.7%, 78.0%)",
          9: "hsl(206, 6.0%, 56.1%)",
          10: "hsl(206, 5.8%, 52.3%)",
          11: "hsl(206, 6.0%, 43.5%)",
          12: "hsl(206, 24.0%, 9.0%)",
        },
        "slate-dark": {
          1: "hsl(200, 7.0%, 8.8%)",
          2: "hsl(195, 7.1%, 11.0%)",
          3: "hsl(197, 6.8%, 13.6%)",
          4: "hsl(198, 6.6%, 15.8%)",
          5: "hsl(199, 6.4%, 17.9%)",
          6: "hsl(201, 6.2%, 20.5%)",
          7: "hsl(203, 6.0%, 24.3%)",
          8: "hsl(207, 5.6%, 31.6%)",
          9: "hsl(206, 6.0%, 43.9%)",
          10: "hsl(206, 5.2%, 49.5%)",
          11: "hsl(206, 6.0%, 63.0%)",
          12: "hsl(210, 6.0%, 93.0%)",
        },
        indigo: {
          1: "hsl(225, 60.0%, 99.4%)",
          2: "hsl(223, 100%, 98.6%)",
          3: "hsl(223, 98.4%, 97.1%)",
          4: "hsl(223, 92.9%, 95.0%)",
          5: "hsl(224, 87.1%, 92.0%)",
          6: "hsl(224, 81.9%, 87.8%)",
          7: "hsl(225, 77.4%, 82.1%)",
          8: "hsl(226, 75.4%, 74.5%)",
          9: "hsl(226, 70.0%, 55.5%)",
          10: "hsl(226, 58.6%, 51.3%)",
          11: "hsl(226, 55.0%, 45.0%)",
          12: "hsl(226, 62.0%, 17.0%)",
        },
        "indigo-dark": {
          1: "hsl(229, 24.0%, 10.0%)",
          2: "hsl(230, 36.4%, 12.9%)",
          3: "hsl(228, 43.3%, 17.5%)",
          4: "hsl(227, 47.2%, 21.0%)",
          5: "hsl(227, 50.0%, 24.1%)",
          6: "hsl(226, 52.9%, 28.2%)",
          7: "hsl(226, 56.0%, 34.5%)",
          8: "hsl(226, 58.2%, 44.1%)",
          9: "hsl(226, 70.0%, 55.5%)",
          10: "hsl(227, 75.2%, 61.6%)",
          11: "hsl(228, 100%, 75.9%)",
          12: "hsl(226, 83.0%, 96.3%)",
        },
      },
    },
  },
  plugins: [],
};
