/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Medical/Healthcare Palette
                primary: {
                    DEFAULT: '#0ea5e9', // Sky 500 - Clear & Optimistic
                    light: '#7dd3fc',   // Sky 300
                    dark: '#0369a1',    // Sky 700
                },
                secondary: {
                    DEFAULT: '#14b8a6', // Teal 500 - Calm & Healing
                    light: '#5eead4',   // Teal 300
                    dark: '#0f766e',    // Teal 700
                },
                background: '#f8fafc', // Slate 50 - Clean Clinical Background
                surface: '#ffffff',

                // Soft Semantic Colors (Overriding/Next to defaults for badges)
                success: {
                    100: '#dcfce7', // Green 100
                    800: '#166534', // Green 800
                },
                error: {
                    100: '#fee2e2', // Red 100
                    800: '#991b1b', // Red 800
                },
                warning: {
                    100: '#fef3c7', // Amber 100
                    800: '#92400e', // Amber 800
                },
                info: {
                    100: '#e0f2fe', // Sky 100
                    800: '#075985', // Sky 800
                },

                // Neutral Tones (Soft Slate)
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Super soft floaty shadow
                'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)', // Clean crisp border-shadow
                'card-hover': '0 0 0 1px rgba(0,0,0,0.03), 0 12px 24px -8px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            }
        },
    },
    plugins: [],
}
