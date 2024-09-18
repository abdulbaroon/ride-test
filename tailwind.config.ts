import type { Config } from "tailwindcss";

const rem = (num: number) => ({ [num]: `${num / 16}rem` });

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primaryText: "#29a9e1",
                primaryButton: "#266c9a",
                secondaryButton: "#244161",
                primaryDarkblue: "#003057",
                violet: "#1f1b2d",
                lightViolet: "#282435",
                lightGray: "#dee4eb",
                darkred: "#f23c49",
                lightwhite: "#e7eef1",
                orange: "#f65624",
                primaryGray: "#f5f5f5",
                LinkColor: "#f5f4f8",
                LinkButton:"#115674"
            },
            screens: {
                desktop: "1180px",
                tablet: "774px",
                mobile: "420px",
            },
            fontSize: {
                ...rem(13),
            },
            lineHeight: {
                ...rem(67),
            },
            spacing: {
                ...rem(13),
            },
            height: {
                "89": "89.1vh",
            },

            borderRadius: {
                ...rem(32),
            },
            zIndex: {
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
            },
        },
    },
    plugins: [],
};
export default config;
