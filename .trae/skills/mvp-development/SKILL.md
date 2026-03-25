# MVP Development

## Description
Expert in rapid MVP (Minimum Viable Product) development, prototype creation, feature prioritization, and agile delivery for quick market validation.

## Usage Scenario
Use this skill when:
- Building MVPs quickly
- Validating product ideas
- Rapid prototyping
- Feature prioritization
- Technical debt management in MVPs
- Scaling MVPs to production

## Instructions

### MVP Principles

1. **Core Philosophy**
   ```
   Build → Measure → Learn
   
   - Focus on core value proposition
   - Ship fast, iterate faster
   - Validate assumptions early
   - Embrace technical debt strategically
   ```

2. **Feature Prioritization**
   ```
   MoSCoW Method:
   - Must Have: Core functionality, no MVP without it
   - Should Have: Important but not critical
   - Could Have: Nice to have if time permits
   - Won't Have: Explicitly out of scope
   ```

3. **MVP Scope Definition**
   ```
   1. Define problem statement
   2. Identify target users
   3. List all possible features
   4. Prioritize ruthlessly
   5. Cut everything non-essential
   6. Define success metrics
   ```

### Tech Stack Selection

1. **Speed-Focused Stack**
   ```
   Frontend:
   - Next.js / Nuxt.js (SSR + routing)
   - Tailwind CSS (rapid styling)
   - shadcn/ui (pre-built components)
   
   Backend:
   - Supabase / Firebase (BaaS)
   - Next.js API routes
   - Serverless functions
   
   Database:
   - Supabase (PostgreSQL)
   - Firebase Firestore
   - PlanetScale (MySQL)
   
   Auth:
   - Clerk / Auth0 / Supabase Auth
   
   Deployment:
   - Vercel / Netlify
   - Railway / Render
   ```

2. **Decision Framework**
   ```
   Speed vs Control:
   - BaaS: Fastest, less control
   - Custom Backend: More control, slower
   
   Scale Considerations:
   - Start simple, plan for scale
   - Avoid premature optimization
   - Choose proven technologies
   ```

### MVP Architecture

1. **Simple Architecture**
   ```
   ┌─────────────────────────────────────┐
   │           Frontend (Next.js)         │
   │  ┌─────────┐ ┌─────────┐ ┌────────┐ │
   │  │  Pages  │ │Components│ │  API   │ │
   │  └─────────┘ └─────────┘ └────────┘ │
   └─────────────────┬───────────────────┘
                     │
   ┌─────────────────▼───────────────────┐
   │           Supabase                   │
   │  ┌─────────┐ ┌─────────┐ ┌────────┐ │
   │  │   DB    │ │   Auth  │ │Storage │ │
   │  └─────────┘ └─────────┘ └────────┘ │
   └─────────────────────────────────────┘
   ```

2. **Project Structure**
   ```
   mvp/
   ├── app/
   │   ├── (auth)/
   │   │   ├── login/
   │   │   └── signup/
   │   ├── (dashboard)/
   │   │   ├── dashboard/
   │   │   └── settings/
   │   ├── api/
   │   │   └── webhooks/
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   ├── ui/
   │   └── features/
   ├── lib/
   │   ├── supabase.ts
   │   └── utils.ts
   └── types/
       └── index.ts
   ```

### Rapid Development Patterns

1. **Component Library Setup**
   ```bash
   # Initialize with shadcn/ui
   npx shadcn-ui@latest init
   
   # Add components
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add form
   npx shadcn-ui@latest add table
   ```

2. **Authentication Template**
   ```typescript
   // lib/auth.ts
   import { createClient } from '@supabase/supabase-js';
   
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   
   export async function signUp(email: string, password: string) {
     return supabase.auth.signUp({ email, password });
   }
   
   export async function signIn(email: string, password: string) {
     return supabase.auth.signInWithPassword({ email, password });
   }
   
   export async function signOut() {
     return supabase.auth.signOut();
   }
   ```

3. **Database Schema Template**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- RLS Policies
   CREATE POLICY "Users can read own data"
     ON users FOR SELECT
     USING (auth.uid() = id);
   ```

4. **API Route Template**
   ```typescript
   // app/api/users/route.ts
   import { NextResponse } from 'next/server';
   import { supabase } from '@/lib/supabase';
   
   export async function GET() {
     const { data, error } = await supabase
       .from('users')
       .select('*');
     
     if (error) {
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
     
     return NextResponse.json(data);
   }
   
   export async function POST(request: Request) {
     const body = await request.json();
     
     const { data, error } = await supabase
       .from('users')
       .insert(body)
       .select()
       .single();
     
     if (error) {
       return NextResponse.json({ error: error.message }, { status: 500 });
     }
     
     return NextResponse.json(data, { status: 201 });
   }
   ```

### MVP Checklist

```markdown
## MVP Launch Checklist

### Core Features
- [ ] User authentication
- [ ] Core value proposition feature
- [ ] Basic user profile
- [ ] Essential CRUD operations

### Technical
- [ ] Database setup
- [ ] API endpoints
- [ ] Error handling
- [ ] Basic logging
- [ ] Environment variables

### User Experience
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages
- [ ] Success feedback
- [ ] Basic navigation

### Legal & Security
- [ ] Privacy policy
- [ ] Terms of service
- [ ] HTTPS enabled
- [ ] Input validation
- [ ] Rate limiting

### Analytics
- [ ] Event tracking
- [ ] User analytics
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Deployment
- [ ] Production environment
- [ ] Domain configured
- [ ] SSL certificate
- [ ] Database backups
```

### Technical Debt Strategy

1. **Acceptable Debt**
   ```
   - Hardcoded values (document them)
   - Simplified error handling
   - Basic UI (functional over pretty)
   - Minimal test coverage
   - Monolithic architecture
   ```

2. **Debt Tracking**
   ```markdown
   # Technical Debt Log
   
   | Item | Impact | Effort | Priority |
   |------|--------|--------|----------|
   | Add proper error boundaries | High | Low | P1 |
   | Implement rate limiting | Medium | Medium | P2 |
   | Add unit tests | Medium | High | P3 |
   | Refactor auth module | Low | Medium | P4 |
   ```

### Success Metrics

1. **Key Metrics**
   ```
   Acquisition:
   - Sign-ups per day
   - Traffic sources
   
   Activation:
   - Time to first value
   - Feature adoption rate
   
   Retention:
   - DAU/MAU ratio
   - Churn rate
   
   Revenue:
   - MRR (if applicable)
   - Conversion rate
   ```

2. **Analytics Setup**
   ```typescript
   // lib/analytics.ts
   export function trackEvent(event: string, properties?: Record<string, any>) {
     if (typeof window !== 'undefined') {
       window.gtag?.('event', event, properties);
       window.posthog?.capture(event, properties);
     }
   }
   
   // Usage
   trackEvent('user_signed_up', { method: 'email' });
   trackEvent('feature_used', { feature: 'export' });
   ```

### Scaling Path

```
MVP → v1.0 → v2.0

MVP (Week 1-4):
- Single monolith
- BaaS backend
- Basic features
- Manual processes

v1.0 (Month 2-3):
- Separate services
- Custom backend
- Enhanced features
- Some automation

v2.0 (Month 4+):
- Microservices
- Full CI/CD
- Advanced features
- Full automation
```

## Output Contract
- MVP project structure
- Feature prioritization
- Tech stack recommendations
- Development timeline
- Success metrics definition

## Constraints
- Time-box development
- Focus on core value
- Accept imperfection
- Plan for iteration
- Document technical debt

## Examples

### Example 1: MVP Feature List
```markdown
## Task Manager MVP

### Must Have (Week 1-2)
- [x] User registration/login
- [x] Create task
- [x] List tasks
- [x] Complete task
- [x] Delete task

### Should Have (Week 3)
- [ ] Task categories
- [ ] Due dates
- [ ] Task priority

### Could Have (Week 4)
- [ ] Task sharing
- [ ] Mobile responsive
- [ ] Dark mode

### Won't Have (Post-MVP)
- Team collaboration
- Calendar integration
- Mobile app
- API access
```

### Example 2: MVP Timeline
```markdown
## 4-Week MVP Timeline

Week 1: Foundation
- Project setup
- Authentication
- Database schema
- Basic UI shell

Week 2: Core Features
- CRUD operations
- User dashboard
- Basic navigation
- Form handling

Week 3: Polish
- Error handling
- Loading states
- Responsive design
- Basic tests

Week 4: Launch Prep
- Performance optimization
- Security review
- Analytics setup
- Deployment
```
