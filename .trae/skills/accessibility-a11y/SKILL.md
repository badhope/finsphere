# Accessibility (a11y)

## Description
Expert in web accessibility standards (WCAG), ARIA patterns, accessible components, and inclusive design for users with disabilities.

## Usage Scenario
Use this skill when:
- Implementing WCAG compliance
- Creating accessible components
- ARIA attributes usage
- Keyboard navigation
- Screen reader support
- Color contrast issues

## Instructions

### WCAG Guidelines

1. **Perceivable**
   - Provide text alternatives for non-text content
   - Provide captions for multimedia
   - Create content that can be presented in different ways
   - Make it easier for users to see and hear content

2. **Operable**
   - Make all functionality available from keyboard
   - Give users enough time to read and use content
   - Don't use content that causes seizures
   - Help users navigate and find content

3. **Understandable**
   - Make text readable and understandable
   - Make pages appear and operate in predictable ways
   - Help users avoid and correct mistakes

4. **Robust**
   - Maximize compatibility with current and future tools

### Semantic HTML

1. **Landmarks**
   ```html
   <header role="banner">
     <nav role="navigation" aria-label="Main navigation">
       <!-- Navigation items -->
     </nav>
   </header>
   
   <main role="main">
     <article>
       <h1>Article Title</h1>
       <section aria-labelledby="section-heading">
         <h2 id="section-heading">Section Heading</h2>
       </section>
     </article>
   </main>
   
   <aside role="complementary">
     <!-- Sidebar content -->
   </aside>
   
   <footer role="contentinfo">
     <!-- Footer content -->
   </footer>
   ```

2. **Headings**
   ```html
   <!-- Correct hierarchy -->
   <h1>Main Title</h1>
   <h2>Section</h2>
   <h3>Subsection</h3>
   <h2>Another Section</h2>
   
   <!-- Avoid skipping levels -->
   <!-- Bad: h1 -> h3 -->
   ```

3. **Lists**
   ```html
   <ul role="list">
     <li>Item 1</li>
     <li>Item 2</li>
   </ul>
   
   <nav aria-label="Breadcrumb">
     <ol>
       <li><a href="/">Home</a></li>
       <li><a href="/products">Products</a></li>
       <li aria-current="page">Current Product</li>
     </ol>
   </nav>
   ```

### ARIA Patterns

1. **Buttons and Links**
   ```html
   <!-- Button -->
   <button type="button" aria-pressed="false">
     Toggle
   </button>
   
   <!-- Link that looks like button (avoid if possible) -->
   <a href="/action" role="button" tabindex="0">
     Action
   </a>
   
   <!-- Icon button -->
   <button aria-label="Close menu">
     <svg aria-hidden="true"><!-- icon --></svg>
   </button>
   ```

2. **Forms**
   ```html
   <form>
     <div>
       <label for="email">Email Address</label>
       <input
         id="email"
         type="email"
         name="email"
         aria-required="true"
         aria-describedby="email-hint"
         autocomplete="email"
       />
       <span id="email-hint">We'll never share your email</span>
     </div>
     
     <div>
       <label for="password">Password</label>
       <input
         id="password"
         type="password"
         name="password"
         aria-required="true"
         aria-invalid="false"
       />
     </div>
     
     <fieldset>
       <legend>Notification Preferences</legend>
       <label>
         <input type="checkbox" name="notifications" value="email" />
         Email notifications
       </label>
     </fieldset>
     
     <button type="submit">Submit</button>
   </form>
   ```

3. **Error Handling**
   ```html
   <div>
     <label for="username">Username</label>
     <input
       id="username"
       type="text"
       aria-invalid="true"
       aria-describedby="username-error"
     />
     <span id="username-error" role="alert">
       Username is required
     </span>
   </div>
   
   <!-- Multiple errors -->
   <div role="alert" aria-live="polite">
     <h3>Please fix the following errors:</h3>
     <ul>
       <li><a href="#email">Email is invalid</a></li>
       <li><a href="#password">Password is too short</a></li>
     </ul>
   </div>
   ```

4. **Modal Dialog**
   ```html
   <div
     role="dialog"
     aria-modal="true"
     aria-labelledby="dialog-title"
     aria-describedby="dialog-description"
   >
     <h2 id="dialog-title">Confirm Action</h2>
     <p id="dialog-description">Are you sure you want to proceed?</p>
     <button>Cancel</button>
     <button>Confirm</button>
   </div>
   ```

5. **Tabs**
   ```html
   <div role="tablist" aria-label="Settings">
     <button
       role="tab"
       id="tab-general"
       aria-selected="true"
       aria-controls="panel-general"
     >
       General
     </button>
     <button
       role="tab"
       id="tab-security"
       aria-selected="false"
       aria-controls="panel-security"
       tabindex="-1"
     >
       Security
     </button>
   </div>
   
   <div
     role="tabpanel"
     id="panel-general"
     aria-labelledby="tab-general"
     tabindex="0"
   >
     General settings content
   </div>
   <div
     role="tabpanel"
     id="panel-security"
     aria-labelledby="tab-security"
     tabindex="0"
     hidden
   >
     Security settings content
   </div>
   ```

6. **Accordion**
   ```html
   <div>
     <h3>
       <button
         aria-expanded="true"
         aria-controls="accordion-content-1"
         id="accordion-header-1"
       >
         Section 1
       </button>
     </h3>
     <div
       id="accordion-content-1"
       role="region"
       aria-labelledby="accordion-header-1"
     >
       Content for section 1
     </div>
   </div>
   ```

### Keyboard Navigation

1. **Focus Management**
   ```typescript
   function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
     const modalRef = useRef<HTMLDivElement>(null);
     const previousFocus = useRef<HTMLElement | null>(null);
     
     useEffect(() => {
       if (isOpen) {
         previousFocus.current = document.activeElement as HTMLElement;
         modalRef.current?.focus();
         
         const handleTab = (e: KeyboardEvent) => {
           if (e.key === 'Tab' && modalRef.current) {
             const focusable = modalRef.current.querySelectorAll(
               'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
             );
             const first = focusable[0] as HTMLElement;
             const last = focusable[focusable.length - 1] as HTMLElement;
             
             if (e.shiftKey && document.activeElement === first) {
               e.preventDefault();
               last.focus();
             } else if (!e.shiftKey && document.activeElement === last) {
               e.preventDefault();
               first.focus();
             }
           }
         };
         
         document.addEventListener('keydown', handleTab);
         return () => document.removeEventListener('keydown', handleTab);
       } else {
         previousFocus.current?.focus();
       }
     }, [isOpen]);
     
     return (
       <div
         ref={modalRef}
         role="dialog"
         aria-modal="true"
         tabIndex={-1}
         onKeyDown={(e) => e.key === 'Escape' && onClose()}
       >
         Modal content
       </div>
     );
   }
   ```

2. **Skip Links**
   ```html
   <a href="#main-content" class="skip-link">
     Skip to main content
   </a>
   
   <main id="main-content">
     <!-- Main content -->
   </main>
   
   <style>
     .skip-link {
       position: absolute;
       top: -40px;
       left: 0;
       padding: 8px;
       background: #000;
       color: #fff;
       z-index: 100;
     }
     .skip-link:focus {
       top: 0;
     }
   </style>
   ```

### Screen Reader Support

1. **Live Regions**
   ```html
   <!-- Polite announcements -->
   <div aria-live="polite" aria-atomic="true">
     <!-- Dynamic content announced when changed -->
   </div>
   
   <!-- Assertive announcements -->
   <div role="alert" aria-live="assertive">
     <!-- Important message announced immediately -->
   </div>
   
   <!-- Status messages -->
   <div role="status" aria-live="polite">
     Loading complete
   </div>
   ```

2. **Hidden Content**
   ```html
   <!-- Visually hidden but accessible -->
   <span class="sr-only">Screen reader only text</span>
   
   <!-- Hidden from everyone -->
   <div aria-hidden="true" hidden>
     Not accessible
   </div>
   
   <style>
     .sr-only {
       position: absolute;
       width: 1px;
       height: 1px;
       padding: 0;
       margin: -1px;
       overflow: hidden;
       clip: rect(0, 0, 0, 0);
       white-space: nowrap;
       border: 0;
     }
   </style>
   ```

### Color and Contrast

1. **Contrast Ratios**
   - Normal text: 4.5:1 minimum
   - Large text (18px+ or 14px bold): 3:1 minimum
   - UI components: 3:1 minimum

2. **Focus Indicators**
   ```css
   :focus {
     outline: 2px solid #000;
     outline-offset: 2px;
   }
   
   :focus-visible {
     outline: 2px solid #0066ff;
     outline-offset: 2px;
   }
   
   :focus:not(:focus-visible) {
     outline: none;
   }
   ```

3. **Color Independence**
   ```css
   /* Don't rely on color alone */
   .error {
     color: #dc2626;
     border-left: 4px solid #dc2626;
   }
   
   .error::before {
     content: "⚠ ";
   }
   ```

### Testing

1. **Automated Testing**
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';
   
   expect.extend(toHaveNoViolations);
   
   test('should have no accessibility violations', async () => {
     const { container } = render(<MyComponent />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

2. **Manual Testing Checklist**
   - Keyboard-only navigation
   - Screen reader testing (NVDA, VoiceOver, JAWS)
   - Color contrast verification
   - Zoom to 200%
   - Disable CSS
   - Disable JavaScript

## Output Contract
- Accessible components
- ARIA implementations
- Keyboard navigation code
- Focus management
- Testing configurations

## Constraints
- Follow WCAG 2.1 AA
- Test with real assistive tech
- Don't override user styles
- Maintain focus visibility
- Use semantic HTML first

## Examples

### Example 1: Accessible Button
```tsx
function IconButton({ icon, label, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="p-2 rounded focus:ring-2 focus:ring-offset-2"
    >
      <svg aria-hidden="true" className="w-5 h-5">
        {icon}
      </svg>
    </button>
  );
}
```

### Example 2: Accessible Form
```tsx
function SearchForm() {
  return (
    <form role="search">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        id="search"
        type="search"
        placeholder="Search..."
        aria-describedby="search-hint"
      />
      <span id="search-hint" className="sr-only">
        Press Enter to search
      </span>
      <button type="submit">
        <svg aria-hidden="true" />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
```
