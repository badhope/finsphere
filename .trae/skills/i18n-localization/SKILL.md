# i18n Localization

## Description
Expert in internationalization and localization including translation management, locale handling, pluralization, and cultural formatting for global applications.

## Usage Scenario
Use this skill when:
- Adding multi-language support
- Implementing i18n libraries
- Managing translations
- Date/number formatting
- RTL language support
- Locale detection

## Instructions

### React i18next

1. **Setup**
   ```typescript
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';
   
   i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       fallbackLng: 'en',
       debug: process.env.NODE_ENV === 'development',
       interpolation: {
         escapeValue: false,
       },
       resources: {
         en: {
           translation: {
             welcome: 'Welcome',
             greeting: 'Hello, {{name}}!',
           },
         },
         zh: {
           translation: {
             welcome: '欢迎',
             greeting: '你好，{{name}}！',
           },
         },
       },
     });
   
   export default i18n;
   ```

2. **Usage in Components**
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   function Welcome() {
     const { t, i18n } = useTranslation();
     
     return (
       <div>
         <h1>{t('welcome')}</h1>
         <p>{t('greeting', { name: 'John' })}</p>
         <button onClick={() => i18n.changeLanguage('zh')}>
           中文
         </button>
         <button onClick={() => i18n.changeLanguage('en')}>
           English
         </button>
       </div>
     );
   }
   ```

3. **Namespaces**
   ```typescript
   i18n.init({
     ns: ['common', 'home', 'auth'],
     defaultNS: 'common',
     fallbackNS: 'common',
   });
   
   // Usage
   const { t } = useTranslation(['home', 'common']);
   t('home:title');
   t('common:submit');
   ```

4. **Pluralization**
   ```json
   {
     "item_one": "{{count}} item",
     "item_other": "{{count}} items",
     "item_zero": "No items"
   }
   ```
   ```tsx
   t('item', { count: 1 });   // "1 item"
   t('item', { count: 5 });   // "5 items"
   t('item', { count: 0 });   // "No items"
   ```

5. **Lazy Loading**
   ```typescript
   i18n.use(initReactI18next).init({
     backend: {
       loadPath: '/locales/{{lng}}/{{ns}}.json',
     },
   });
   ```

### Vue i18n

1. **Setup**
   ```typescript
   import { createI18n } from 'vue-i18n';
   
   const messages = {
     en: {
       welcome: 'Welcome',
       nav: {
         home: 'Home',
         about: 'About',
       },
     },
     zh: {
       welcome: '欢迎',
       nav: {
         home: '首页',
         about: '关于',
       },
     },
   };
   
   export const i18n = createI18n({
     legacy: false,
     locale: 'en',
     fallbackLocale: 'en',
     messages,
   });
   
   const app = createApp(App);
   app.use(i18n);
   ```

2. **Usage in Components**
   ```vue
   <script setup lang="ts">
   import { useI18n } from 'vue-i18n';
   
   const { t, locale } = useI18n();
   </script>
   
   <template>
     <h1>{{ t('welcome') }}</h1>
     <nav>
       <a href="#">{{ t('nav.home') }}</a>
       <a href="#">{{ t('nav.about') }}</a>
     </nav>
     <select v-model="locale">
       <option value="en">English</option>
       <option value="zh">中文</option>
     </select>
   </template>
   ```

### Date and Time Formatting

1. **Intl API**
   ```typescript
   function formatDate(date: Date, locale: string): string {
     return new Intl.DateTimeFormat(locale, {
       year: 'numeric',
       month: 'long',
       day: 'numeric',
     }).format(date);
   }
   
   function formatTime(date: Date, locale: string): string {
     return new Intl.DateTimeFormat(locale, {
       hour: '2-digit',
       minute: '2-digit',
     }).format(date);
   }
   
   function formatRelative(date: Date, locale: string): string {
     const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
     const diff = date.getTime() - Date.now();
     const days = Math.round(diff / (1000 * 60 * 60 * 24));
     return rtf.format(days, 'day');
   }
   ```

2. **i18next Integration**
   ```typescript
   i18n.init({
     interpolation: {
       format: (value, format, lng) => {
         if (value instanceof Date) {
           return new Intl.DateTimeFormat(lng, {
             dateStyle: format as any,
           }).format(value);
         }
         return value;
       },
     },
   });
   
   t('lastLogin', { date: new Date() });
   ```

### Number and Currency Formatting

```typescript
function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(num);
}

function formatCurrency(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

function formatPercent(num: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
  }).format(num);
}

function formatUnit(num: number, locale: string, unit: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
  }).format(num);
}

formatNumber(1234567.89, 'en-US');  // "1,234,567.89"
formatNumber(1234567.89, 'de-DE');  // "1.234.567,89"
formatCurrency(1234.56, 'en-US', 'USD');  // "$1,234.56"
formatCurrency(1234.56, 'ja-JP', 'JPY');  // "¥1,235"
```

### RTL Support

1. **Direction Detection**
   ```typescript
   const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];
   
   function isRTL(locale: string): boolean {
     return RTL_LANGUAGES.includes(locale);
   }
   
   function setDirection(locale: string): void {
     document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
     document.documentElement.lang = locale;
   }
   ```

2. **CSS Handling**
   ```css
   [dir="ltr"] .sidebar {
     left: 0;
     right: auto;
   }
   
   [dir="rtl"] .sidebar {
     left: auto;
     right: 0;
   }
   
   .margin-start {
     margin-inline-start: 1rem;
   }
   
   .padding-end {
     padding-inline-end: 1rem;
   }
   ```

3. **Component Direction**
   ```tsx
   function Layout({ locale }: { locale: string }) {
     return (
       <div dir={isRTL(locale) ? 'rtl' : 'ltr'}>
         <nav>
           <Icon className={isRTL(locale) ? 'rotate-180' : ''} />
         </nav>
       </div>
     );
   }
   ```

### Translation Management

1. **JSON Structure**
   ```json
   // en/common.json
   {
     "buttons": {
       "submit": "Submit",
       "cancel": "Cancel",
       "save": "Save"
     },
     "errors": {
       "required": "This field is required",
       "email": "Please enter a valid email"
     },
     "validation": {
       "minLength": "Must be at least {{min}} characters",
       "maxLength": "Must be no more than {{max}} characters"
     }
   }
   ```

2. **Extraction Script**
   ```typescript
   import fs from 'fs';
   import glob from 'glob';
   import i18nextParser from 'i18next-parser';
   
   // i18next-parser.config.js
   module.exports = {
     input: ['src/**/*.{ts,tsx}'],
     output: 'locales/$LOCALE/$NAMESPACE.json',
     locales: ['en', 'zh'],
     defaultNamespace: 'common',
   };
   ```

3. **Missing Key Handler**
   ```typescript
   i18n.init({
     saveMissing: true,
     missingKeyHandler: (lng, ns, key, fallbackValue) => {
       console.log(`Missing translation: ${lng}/${ns}/${key}`);
     },
   });
   ```

### Server-Side Detection

```typescript
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'zh', 'ja'];
const DEFAULT_LOCALE = 'en';

function detectLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => SUPPORTED_LOCALES.includes(lang));
    
    if (preferredLocale) return preferredLocale;
  }
  
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  return DEFAULT_LOCALE;
}
```

## Output Contract
- i18n configurations
- Translation files
- Formatting utilities
- RTL implementations
- Locale detection

## Constraints
- Use Unicode for all text
- Handle plural forms correctly
- Support RTL languages
- Cache translations
- Lazy load languages

## Examples

### Example 1: Complete Setup
```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'ja'],
    ns: ['common', 'home', 'auth'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie'],
    },
  });

export default i18n;
```

### Example 2: Localized Component
```tsx
function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h3>{product.name[i18n.language]}</h3>
      <p>{formatCurrency(product.price, i18n.language, product.currency)}</p>
      <p>{t('product.inStock', { count: product.stock })}</p>
    </div>
  );
}
```
