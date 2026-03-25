# State Management

## Description
Expert in state management solutions including Redux, Zustand, Pinia, and Recoil for predictable state handling in complex applications.

## Usage Scenario
Use this skill when:
- Setting up state management
- Choosing between solutions
- Implementing Redux/Zustand/Pinia
- Handling async state
- State persistence
- DevTools integration

## Instructions

### Redux Toolkit

1. **Store Setup**
   ```typescript
   import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
   import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
   
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   interface UserState {
     user: User | null;
     loading: boolean;
     error: string | null;
   }
   
   const initialState: UserState = {
     user: null,
     loading: false,
     error: null,
   };
   
   const userSlice = createSlice({
     name: 'user',
     initialState,
     reducers: {
       loginStart: (state) => {
         state.loading = true;
         state.error = null;
       },
       loginSuccess: (state, action: PayloadAction<User>) => {
         state.loading = false;
         state.user = action.payload;
       },
       loginFailure: (state, action: PayloadAction<string>) => {
         state.loading = false;
         state.error = action.payload;
       },
       logout: (state) => {
         state.user = null;
       },
     },
   });
   
   export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
   
   export const store = configureStore({
     reducer: {
       user: userSlice.reducer,
     },
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware({
         serializableCheck: false,
       }),
   });
   
   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   
   export const useAppDispatch = () => useDispatch<AppDispatch>();
   export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
   ```

2. **Async Thunks**
   ```typescript
   import { createAsyncThunk } from '@reduxjs/toolkit';
   
   export const loginUser = createAsyncThunk(
     'user/login',
     async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
       try {
         const response = await fetch('/api/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password }),
         });
         
         if (!response.ok) {
           throw new Error('Login failed');
         }
         
         return await response.json();
       } catch (error) {
         return rejectWithValue(error.message);
       }
     }
   );
   
   const userSlice = createSlice({
     name: 'user',
     initialState,
     reducers: {},
     extraReducers: (builder) => {
       builder
         .addCase(loginUser.pending, (state) => {
           state.loading = true;
           state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
           state.loading = false;
           state.user = action.payload;
         })
         .addCase(loginUser.rejected, (state, action) => {
           state.loading = false;
           state.error = action.payload as string;
         });
     },
   });
   ```

3. **Usage in Components**
   ```typescript
   import { useAppDispatch, useAppSelector } from './store';
   import { loginUser } from './userSlice';
   
   function LoginForm() {
     const dispatch = useAppDispatch();
     const { loading, error } = useAppSelector((state) => state.user);
     
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       dispatch(loginUser({ email: 'user@example.com', password: 'password' }));
     };
     
     return (
       <form onSubmit={handleSubmit}>
         <button type="submit" disabled={loading}>
           {loading ? 'Logging in...' : 'Login'}
         </button>
         {error && <p>{error}</p>}
       </form>
     );
   }
   ```

### Zustand

1. **Basic Store**
   ```typescript
   import { create } from 'zustand';
   import { devtools, persist } from 'zustand/middleware';
   
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   interface UserState {
     user: User | null;
     loading: boolean;
     error: string | null;
     login: (email: string, password: string) => Promise<void>;
     logout: () => void;
   }
   
   export const useUserStore = create<UserState>()(
     devtools(
       persist(
         (set) => ({
           user: null,
           loading: false,
           error: null,
           
           login: async (email, password) => {
             set({ loading: true, error: null });
             try {
               const response = await fetch('/api/login', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email, password }),
               });
               
               if (!response.ok) throw new Error('Login failed');
               
               const user = await response.json();
               set({ user, loading: false });
             } catch (error) {
               set({ error: error.message, loading: false });
             }
           },
           
           logout: () => set({ user: null }),
         }),
         { name: 'user-storage' }
       )
     )
   );
   
   function LoginForm() {
     const { login, loading, error } = useUserStore();
     
     return (
       <button onClick={() => login('email', 'password')} disabled={loading}>
         {loading ? 'Loading...' : 'Login'}
       </button>
     );
   }
   ```

2. **Slices Pattern**
   ```typescript
   import { create, StateCreator } from 'zustand';
   
   interface UserSlice {
     user: User | null;
     setUser: (user: User) => void;
     clearUser: () => void;
   }
   
   interface CartSlice {
     items: CartItem[];
     addItem: (item: CartItem) => void;
     removeItem: (id: string) => void;
   }
   
   const createUserSlice: StateCreator<UserSlice> = (set) => ({
     user: null,
     setUser: (user) => set({ user }),
     clearUser: () => set({ user: null }),
   });
   
   const createCartSlice: StateCreator<CartSlice> = (set) => ({
     items: [],
     addItem: (item) => set((state) => ({ items: [...state.items, item] })),
     removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
   });
   
   export const useStore = create<UserSlice & CartSlice>()((...a) => ({
     ...createUserSlice(...a),
     ...createCartSlice(...a),
   }));
   ```

3. **Selectors**
   ```typescript
   import { create } from 'zustand';
   import { shallow } from 'zustand/shallow';
   
   const useStore = create((set) => ({
     items: [],
     filter: 'all',
     addItem: (item) => set((state) => ({ items: [...state.items, item] })),
     setFilter: (filter) => set({ filter }),
   }));
   
   const filteredItems = (state) => {
     if (state.filter === 'all') return state.items;
     return state.items.filter((item) => item.status === state.filter);
   };
   
   function ItemList() {
     const items = useStore(filteredItems);
     const filter = useStore((state) => state.filter);
     
     return <div>{items.map((item) => <Item key={item.id} {...item} />)}</div>;
   }
   ```

### Pinia (Vue)

1. **Setup Store**
   ```typescript
   import { defineStore } from 'pinia';
   import { ref, computed } from 'vue';
   
   export const useUserStore = defineStore('user', () => {
     const user = ref<User | null>(null);
     const loading = ref(false);
     const error = ref<string | null>(null);
     
     const isAuthenticated = computed(() => !!user.value);
     const userName = computed(() => user.value?.name ?? 'Guest');
     
     async function login(email: string, password: string) {
       loading.value = true;
       error.value = null;
       
       try {
         const response = await fetch('/api/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password }),
         });
         
         if (!response.ok) throw new Error('Login failed');
         
         user.value = await response.json();
       } catch (e) {
         error.value = e.message;
       } finally {
         loading.value = false;
       }
     }
     
     function logout() {
       user.value = null;
     }
     
     return { user, loading, error, isAuthenticated, userName, login, logout };
   });
   ```

2. **Usage in Components**
   ```vue
   <script setup lang="ts">
   import { useUserStore } from './stores/user';
   
   const userStore = useUserStore();
   
   const { user, loading, error } = storeToRefs(userStore);
   const { login, logout } = userStore;
   </script>
   
   <template>
     <div v-if="userStore.isAuthenticated">
       <p>Welcome, {{ userStore.userName }}</p>
       <button @click="logout">Logout</button>
     </div>
     <div v-else>
       <button @click="login('email', 'password')" :disabled="loading">
         {{ loading ? 'Loading...' : 'Login' }}
       </button>
       <p v-if="error">{{ error }}</p>
     </div>
   </template>
   ```

### Recoil (React)

1. **Atoms and Selectors**
   ```typescript
   import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
   
   export const userState = atom<User | null>({
     key: 'userState',
     default: null,
   });
   
   export const loadingState = atom<boolean>({
     key: 'loadingState',
     default: false,
   });
   
   export const isAuthenticatedSelector = selector({
     key: 'isAuthenticated',
     get: ({ get }) => !!get(userState),
   });
   
   export const userNameSelector = selector({
     key: 'userName',
     get: ({ get }) => get(userState)?.name ?? 'Guest',
   });
   
   function useLogin() {
     const setUser = useSetRecoilState(userState);
     const setLoading = useSetRecoilState(loadingState);
     
     return async (email: string, password: string) => {
       setLoading(true);
       try {
         const response = await fetch('/api/login', {
           method: 'POST',
           body: JSON.stringify({ email, password }),
         });
         const user = await response.json();
         setUser(user);
       } finally {
         setLoading(false);
       }
     };
   }
   ```

### Comparison

| Feature | Redux | Zustand | Pinia | Recoil |
|---------|-------|---------|-------|--------|
| Boilerplate | High | Low | Low | Medium |
| DevTools | Excellent | Good | Good | Good |
| TypeScript | Good | Excellent | Excellent | Good |
| Learning Curve | Steep | Easy | Easy | Medium |
| Bundle Size | Large | Tiny | Small | Medium |

## Output Contract
- Store configurations
- Actions and reducers
- Selectors
- Middleware setup
- TypeScript types

## Constraints
- Keep state minimal
- Normalize complex data
- Handle async properly
- Use selectors for derived state
- Implement persistence when needed

## Examples

### Example 1: Normalized State
```typescript
interface EntityState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

const usersSlice = createSlice({
  name: 'users',
  initialState: { byId: {}, allIds: [] } as EntityState<User>,
  reducers: {
    addUser: (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
    },
  },
});
```

### Example 2: Persist Middleware
```typescript
const persistMiddleware = (config) => (set, get, api) => {
  const persisted = localStorage.getItem('store');
  const state = persisted ? JSON.parse(persisted) : config;
  
  return {
    ...state,
    ...config,
    set: (args) => {
      set(args);
      localStorage.setItem('store', JSON.stringify(get()));
    },
  };
};
```
