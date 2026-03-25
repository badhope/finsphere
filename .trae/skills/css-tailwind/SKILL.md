# CSS Tailwind

## Description
Expert in Tailwind CSS utility-first styling, responsive design, component patterns, and customization for modern web applications.

## Usage Scenario
Use this skill when:
- Setting up Tailwind CSS
- Creating responsive layouts
- Building component libraries
- Customizing Tailwind theme
- Optimizing for production
- Dark mode implementation

## Instructions

### Setup

1. **Installation**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configuration**
   ```javascript
   // tailwind.config.js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './src/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             50: '#eff6ff',
             100: '#dbeafe',
             200: '#bfdbfe',
             300: '#93c5fd',
             400: '#60a5fa',
             500: '#3b82f6',
             600: '#2563eb',
             700: '#1d4ed8',
             800: '#1e40af',
             900: '#1e3a8a',
           },
         },
         fontFamily: {
           sans: ['Inter', 'system-ui', 'sans-serif'],
           mono: ['Fira Code', 'monospace'],
         },
         spacing: {
           '128': '32rem',
           '144': '36rem',
         },
         borderRadius: {
           '4xl': '2rem',
         },
       },
     },
     plugins: [
       require('@tailwindcss/forms'),
       require('@tailwindcss/typography'),
       require('@tailwindcss/line-clamp'),
     ],
   };
   ```

3. **CSS Entry**
   ```css
   /* styles/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer base {
     html {
       @apply scroll-smooth;
     }
     
     body {
       @apply bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100;
     }
   }
   
   @layer components {
     .btn {
       @apply px-4 py-2 rounded-lg font-medium transition-colors;
     }
     
     .btn-primary {
       @apply btn bg-primary-600 text-white hover:bg-primary-700;
     }
     
     .btn-secondary {
       @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300;
     }
   }
   
   @layer utilities {
     .text-balance {
       text-wrap: balance;
     }
   }
   ```

### Layout Patterns

1. **Responsive Container**
   ```tsx
   function Container({ children, className }: { children: React.ReactNode; className?: string }) {
     return (
       <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
         {children}
       </div>
     );
   }
   ```

2. **Grid Layout**
   ```tsx
   function GridLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {children}
       </div>
     );
   }
   ```

3. **Flex Layout**
   ```tsx
   function FlexLayout() {
     return (
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="flex-1">Content</div>
         <div className="flex gap-2">Actions</div>
       </div>
     );
   }
   ```

### Component Patterns

1. **Button Component**
   ```tsx
   import { cva, type VariantProps } from 'class-variance-authority';
   
   const buttonVariants = cva(
     'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
     {
       variants: {
         variant: {
           primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
           secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
           outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
           ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
           danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
         },
         size: {
           sm: 'h-8 px-3 text-sm',
           md: 'h-10 px-4 text-base',
           lg: 'h-12 px-6 text-lg',
         },
       },
       defaultVariants: {
         variant: 'primary',
         size: 'md',
       },
     }
   );
   
   interface ButtonProps
     extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
     loading?: boolean;
   }
   
   export function Button({
     className,
     variant,
     size,
     loading,
     children,
     disabled,
     ...props
   }: ButtonProps) {
     return (
       <button
         className={buttonVariants({ variant, size, className })}
         disabled={disabled || loading}
         {...props}
       >
         {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
         {children}
       </button>
     );
   }
   ```

2. **Card Component**
   ```tsx
   function Card({ children, className }: { children: React.ReactNode; className?: string }) {
     return (
       <div className={cn(
         'rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
         className
       )}>
         {children}
       </div>
     );
   }
   
   function CardHeader({ title, description }: { title: string; description?: string }) {
     return (
       <div className="mb-4">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
         {description && (
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
         )}
       </div>
     );
   }
   ```

3. **Input Component**
   ```tsx
   const inputVariants = cva(
     'w-full rounded-lg border bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white',
     {
       variants: {
         variant: {
           default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700',
           error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
         },
         size: {
           sm: 'h-8 text-sm',
           md: 'h-10 text-base',
           lg: 'h-12 text-lg',
         },
       },
       defaultVariants: {
         variant: 'default',
         size: 'md',
       },
     }
   );
   
   interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
     label?: string;
     error?: string;
   }
   
   export function Input({ className, variant, size, label, error, ...props }: InputProps) {
     return (
       <div className="space-y-1">
         {label && (
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             {label}
           </label>
         )}
         <input
           className={inputVariants({ variant: error ? 'error' : variant, size, className })}
           {...props}
         />
         {error && <p className="text-sm text-red-500">{error}</p>}
       </div>
     );
   }
   ```

### Responsive Design

1. **Breakpoints**
   ```tsx
   // sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
   
   function ResponsiveExample() {
     return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         <div className="p-4 text-sm sm:text-base lg:text-lg">
           Responsive text
         </div>
       </div>
     );
   }
   ```

2. **Mobile-First Navigation**
   ```tsx
   function Navigation() {
     const [isOpen, setIsOpen] = useState(false);
     
     return (
       <nav className="bg-white dark:bg-gray-900">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="flex h-16 items-center justify-between">
             <div className="flex items-center">
               <Logo className="h-8 w-8" />
               <span className="ml-2 text-xl font-bold">Brand</span>
             </div>
             
             {/* Desktop menu */}
             <div className="hidden md:flex md:items-center md:gap-6">
               <a href="#" className="text-gray-700 hover:text-primary-600">Home</a>
               <a href="#" className="text-gray-700 hover:text-primary-600">About</a>
               <a href="#" className="text-gray-700 hover:text-primary-600">Contact</a>
             </div>
             
             {/* Mobile menu button */}
             <button
               className="md:hidden p-2"
               onClick={() => setIsOpen(!isOpen)}
             >
               <MenuIcon className="h-6 w-6" />
             </button>
           </div>
         </div>
         
         {/* Mobile menu */}
         {isOpen && (
           <div className="md:hidden border-t dark:border-gray-800">
             <div className="space-y-1 px-4 py-3">
               <a href="#" className="block py-2 text-gray-700">Home</a>
               <a href="#" className="block py-2 text-gray-700">About</a>
               <a href="#" className="block py-2 text-gray-700">Contact</a>
             </div>
           </div>
         )}
       </nav>
     );
   }
   ```

### Dark Mode

1. **Configuration**
   ```javascript
   // tailwind.config.js
   module.exports = {
     darkMode: 'class', // or 'media'
   };
   ```

2. **Toggle Implementation**
   ```tsx
   function ThemeToggle() {
     const [isDark, setIsDark] = useState(false);
     
     useEffect(() => {
       if (isDark) {
         document.documentElement.classList.add('dark');
       } else {
         document.documentElement.classList.remove('dark');
       }
     }, [isDark]);
     
     return (
       <button
         onClick={() => setIsDark(!isDark)}
         className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
       >
         {isDark ? <SunIcon /> : <MoonIcon />}
       </button>
     );
   }
   ```

### Animations

```tsx
function AnimatedCard() {
  return (
    <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="animate-pulse">Loading...</div>
      <div className="animate-spin h-5 w-5">Spinner</div>
      <div className="animate-bounce">Bouncing</div>
    </div>
  );
}

// Custom animation
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};
```

### Utility Functions

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Output Contract
- Tailwind configurations
- Component patterns
- Responsive layouts
- Dark mode setup
- Custom utilities

## Constraints
- Use utility classes
- Follow mobile-first
- Keep configurations minimal
- Use semantic class names
- Optimize for production

## Examples

### Example 1: Dashboard Layout
```tsx
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Users" value="1,234" />
          <StatCard title="Revenue" value="$12,345" />
        </div>
      </main>
    </div>
  );
}
```

### Example 2: Form Layout
```tsx
function Form() {
  return (
    <form className="space-y-6 max-w-md mx-auto">
      <Input label="Email" type="email" />
      <Input label="Password" type="password" />
      <Button variant="primary" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
```
