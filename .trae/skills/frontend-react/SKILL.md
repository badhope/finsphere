# Frontend React

## Description
Expert in React and Next.js development including hooks, state management, server components, performance optimization, and best practices.

## Usage Scenario
Use this skill when:
- Building React applications
- Implementing React hooks
- State management with Redux/Zustand
- Next.js app router and server components
- Performance optimization
- Testing React components

## Instructions

### Core Concepts

1. **Functional Components**
   ```tsx
   import { useState, useEffect } from 'react';
   
   interface UserProps {
     id: string;
     onUpdate?: (user: User) => void;
   }
   
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   export function UserProfile({ id, onUpdate }: UserProps) {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);
     
     useEffect(() => {
       let mounted = true;
       
       async function fetchUser() {
         try {
           const response = await fetch(`/api/users/${id}`);
           if (!response.ok) throw new Error('Failed to fetch user');
           const data = await response.json();
           if (mounted) {
             setUser(data);
             setLoading(false);
           }
         } catch (err) {
           if (mounted) {
             setError(err as Error);
             setLoading(false);
           }
         }
       }
       
       fetchUser();
       
       return () => {
         mounted = false;
       };
     }, [id]);
     
     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;
     if (!user) return null;
     
     return (
       <div className="user-profile">
         <h1>{user.name}</h1>
         <p>{user.email}</p>
       </div>
     );
   }
   ```

2. **Custom Hooks**
   ```tsx
   import { useState, useEffect, useCallback } from 'react';
   
   function useFetch<T>(url: string) {
     const [data, setData] = useState<T | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);
     
     const refetch = useCallback(async () => {
       setLoading(true);
       try {
         const response = await fetch(url);
         if (!response.ok) throw new Error('Fetch failed');
         const json = await response.json();
         setData(json);
         setError(null);
       } catch (err) {
         setError(err as Error);
       } finally {
         setLoading(false);
       }
     }, [url]);
     
     useEffect(() => {
       refetch();
     }, [refetch]);
     
     return { data, loading, error, refetch };
   }
   
   function useDebounce<T>(value: T, delay: number): T {
     const [debouncedValue, setDebouncedValue] = useState(value);
     
     useEffect(() => {
       const timer = setTimeout(() => setDebouncedValue(value), delay);
       return () => clearTimeout(timer);
     }, [value, delay]);
     
     return debouncedValue;
   }
   
   function useLocalStorage<T>(key: string, initialValue: T) {
     const [storedValue, setStoredValue] = useState<T>(() => {
       try {
         const item = window.localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
       } catch {
         return initialValue;
       }
     });
     
     const setValue = (value: T | ((val: T) => T)) => {
       const valueToStore = value instanceof Function ? value(storedValue) : value;
       setStoredValue(valueToStore);
       window.localStorage.setItem(key, JSON.stringify(valueToStore));
     };
     
     return [storedValue, setValue] as const;
   }
   ```

3. **Context and Provider**
   ```tsx
   import { createContext, useContext, useReducer, ReactNode } from 'react';
   
   interface State {
     user: User | null;
     theme: 'light' | 'dark';
   }
   
   type Action =
     | { type: 'SET_USER'; payload: User }
     | { type: 'LOGOUT' }
     | { type: 'TOGGLE_THEME' };
   
   const initialState: State = {
     user: null,
     theme: 'light',
   };
   
   function reducer(state: State, action: Action): State {
     switch (action.type) {
       case 'SET_USER':
         return { ...state, user: action.payload };
       case 'LOGOUT':
         return { ...state, user: null };
       case 'TOGGLE_THEME':
         return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
       default:
         return state;
     }
   }
   
   const AppContext = createContext<{
     state: State;
     dispatch: React.Dispatch<Action>;
   } | null>(null);
   
   export function AppProvider({ children }: { children: ReactNode }) {
     const [state, dispatch] = useReducer(reducer, initialState);
     
     return (
       <AppContext.Provider value={{ state, dispatch }}>
         {children}
       </AppContext.Provider>
     );
   }
   
   export function useAppContext() {
     const context = useContext(AppContext);
     if (!context) {
       throw new Error('useAppContext must be used within AppProvider');
     }
     return context;
   }
   ```

### Next.js App Router

1. **Server Components**
   ```tsx
   import { Suspense } from 'react';
   
   async function getUser(id: string) {
     const response = await fetch(`https://api.example.com/users/${id}`, {
       cache: 'no-store',
     });
     return response.json();
   }
   
   export default async function UserPage({
     params,
   }: {
     params: { id: string };
   }) {
     const user = await getUser(params.id);
     
     return (
       <div>
         <h1>{user.name}</h1>
         <Suspense fallback={<div>Loading posts...</div>}>
           <UserPosts userId={user.id} />
         </Suspense>
       </div>
     );
   }
   
   async function UserPosts({ userId }: { userId: string }) {
     const posts = await fetch(
       `https://api.example.com/users/${userId}/posts`
     ).then((res) => res.json());
     
     return (
       <ul>
         {posts.map((post: Post) => (
           <li key={post.id}>{post.title}</li>
         ))}
       </ul>
     );
   }
   ```

2. **Server Actions**
   ```tsx
   'use server';
   
   import { revalidatePath } from 'next/cache';
   import { redirect } from 'next/navigation';
   
   export async function createUser(formData: FormData) {
     const name = formData.get('name') as string;
     const email = formData.get('email') as string;
     
     const response = await fetch('https://api.example.com/users', {
       method: 'POST',
       body: JSON.stringify({ name, email }),
     });
     
     if (!response.ok) {
       throw new Error('Failed to create user');
     }
     
     revalidatePath('/users');
     redirect('/users');
   }
   
   export async function updateUser(id: string, data: Partial<User>) {
     await fetch(`https://api.example.com/users/${id}`, {
       method: 'PATCH',
       body: JSON.stringify(data),
     });
     
     revalidatePath(`/users/${id}`);
   }
   ```

3. **Layout and Loading**
   ```tsx
   export default function DashboardLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="flex">
         <nav className="w-64">
           <Sidebar />
         </nav>
         <main className="flex-1">{children}</main>
       </div>
     );
   }
   ```

### Performance Optimization

1. **React.memo and useMemo**
   ```tsx
   import { memo, useMemo } from 'react';
   
   interface ExpensiveListProps {
     items: Item[];
     filter: string;
   }
   
   const ExpensiveList = memo(function ExpensiveList({
     items,
     filter,
   }: ExpensiveListProps) {
     const filteredItems = useMemo(() => {
       return items.filter((item) => item.name.includes(filter));
     }, [items, filter]);
     
     const sortedItems = useMemo(() => {
       return [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
     }, [filteredItems]);
     
     return (
       <ul>
         {sortedItems.map((item) => (
           <li key={item.id}>{item.name}</li>
         ))}
       </ul>
     );
   });
   ```

2. **useCallback**
   ```tsx
   import { useCallback } from 'react';
   
   function ParentComponent() {
     const [count, setCount] = useState(0);
     
     const handleClick = useCallback(() => {
       setCount((c) => c + 1);
     }, []);
     
     const handleFetch = useCallback(async (id: string) => {
       const response = await fetch(`/api/items/${id}`);
       return response.json();
     }, []);
     
     return (
       <div>
         <p>Count: {count}</p>
         <ChildComponent onClick={handleClick} onFetch={handleFetch} />
       </div>
     );
   }
   ```

3. **Code Splitting**
   ```tsx
   import { lazy, Suspense } from 'react';
   
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   
   function App() {
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <HeavyComponent />
       </Suspense>
     );
   }
   ```

### Form Handling

1. **React Hook Form**
   ```tsx
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { z } from 'zod';
   
   const schema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
   });
   
   type FormData = z.infer<typeof schema>;
   
   function LoginForm() {
     const {
       register,
       handleSubmit,
       formState: { errors, isSubmitting },
     } = useForm<FormData>({
       resolver: zodResolver(schema),
     });
     
     const onSubmit = async (data: FormData) => {
       try {
         await fetch('/api/login', {
           method: 'POST',
           body: JSON.stringify(data),
         });
       } catch (error) {
         console.error(error);
       }
     };
     
     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         <div>
           <input {...register('email')} type="email" />
           {errors.email && <span>{errors.email.message}</span>}
         </div>
         <div>
           <input {...register('password')} type="password" />
           {errors.password && <span>{errors.password.message}</span>}
         </div>
         <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? 'Loading...' : 'Submit'}
         </button>
       </form>
     );
   }
   ```

### Testing

1. **Jest and React Testing Library**
   ```tsx
   import { render, screen, fireEvent, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { UserProfile } from './UserProfile';
   
   describe('UserProfile', () => {
     it('renders user information', async () => {
       render(<UserProfile id="1" />);
       
       expect(screen.getByText('Loading...')).toBeInTheDocument();
       
       await waitFor(() => {
         expect(screen.getByText('John Doe')).toBeInTheDocument();
       });
     });
     
     it('handles update callback', async () => {
       const onUpdate = jest.fn();
       render(<UserProfile id="1" onUpdate={onUpdate} />);
       
       await waitFor(() => {
         expect(screen.getByText('John Doe')).toBeInTheDocument();
       });
       
       await userEvent.click(screen.getByRole('button', { name: /update/i }));
       
       expect(onUpdate).toHaveBeenCalled();
     });
   });
   ```

## Output Contract
- React components
- Custom hooks
- Context providers
- Next.js pages and layouts
- Test files
- Performance optimizations

## Constraints
- Use TypeScript
- Follow React best practices
- Implement proper error handling
- Use semantic HTML
- Ensure accessibility

## Examples

### Example 1: Data Fetching Hook
```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );
  
  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}
```

### Example 2: Optimistic Update
```tsx
import { useState } from 'react';

function useOptimisticUpdate<T>(initialData: T) {
  const [data, setData] = useState(initialData);
  const [isPending, setIsPending] = useState(false);
  
  const update = async (newData: T, updateFn: () => Promise<void>) => {
    const previousData = data;
    setData(newData);
    setIsPending(true);
    
    try {
      await updateFn();
    } catch (error) {
      setData(previousData);
      throw error;
    } finally {
      setIsPending(false);
    }
  };
  
  return { data, isPending, update };
}
```
