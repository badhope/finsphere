# Frontend Vue

## Description
Expert in Vue.js and Nuxt.js development including Composition API, Pinia state management, composables, and best practices.

## Usage Scenario
Use this skill when:
- Building Vue applications
- Using Composition API
- State management with Pinia
- Nuxt.js SSR and routing
- Vue component design
- Testing Vue components

## Instructions

### Core Concepts

1. **Composition API**
   ```vue
   <script setup lang="ts">
   import { ref, computed, watch, onMounted } from 'vue';
   
   interface Props {
     userId: string;
   }
   
   const props = defineProps<Props>();
   const emit = defineEmits<{
     update: [user: User];
   }>();
   
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   const user = ref<User | null>(null);
   const loading = ref(true);
   const error = ref<Error | null>(null);
   
   const displayName = computed(() => {
     return user.value?.name ?? 'Unknown';
   });
   
   async function fetchUser() {
     loading.value = true;
     try {
       const response = await fetch(`/api/users/${props.userId}`);
       if (!response.ok) throw new Error('Failed to fetch');
       user.value = await response.json();
     } catch (err) {
       error.value = err as Error;
     } finally {
       loading.value = false;
     }
   }
   
   watch(() => props.userId, fetchUser, { immediate: true });
   
   onMounted(() => {
     console.log('Component mounted');
   });
   </script>
   
   <template>
     <div v-if="loading">Loading...</div>
     <div v-else-if="error">Error: {{ error.message }}</div>
     <div v-else-if="user" class="user-profile">
       <h1>{{ user.name }}</h1>
       <p>{{ user.email }}</p>
       <button @click="emit('update', user)">Update</button>
     </div>
   </template>
   
   <style scoped>
   .user-profile {
     padding: 1rem;
   }
   </style>
   ```

2. **Composables**
   ```typescript
   import { ref, watch, type Ref } from 'vue';
   
   export function useFetch<T>(url: Ref<string> | string) {
     const data = ref<T | null>(null) as Ref<T | null>;
     const loading = ref(true);
     const error = ref<Error | null>(null);
     
     async function fetchData() {
       loading.value = true;
       error.value = null;
       try {
         const response = await fetch(typeof url === 'string' ? url : url.value);
         if (!response.ok) throw new Error('Fetch failed');
         data.value = await response.json();
       } catch (err) {
         error.value = err as Error;
       } finally {
         loading.value = false;
       }
     }
     
     if (typeof url === 'string') {
       fetchData();
     } else {
       watch(url, fetchData, { immediate: true });
     }
     
     return { data, loading, error, refetch: fetchData };
   }
   
   export function useDebounce<T>(value: Ref<T>, delay: number) {
     const debouncedValue = ref(value.value) as Ref<T>;
     
     watch(value, (newValue) => {
       const timer = setTimeout(() => {
         debouncedValue.value = newValue;
       }, delay);
       
       return () => clearTimeout(timer);
     });
     
     return debouncedValue;
   }
   
   export function useLocalStorage<T>(key: string, initialValue: T) {
     const storedValue = ref<T>(initialValue) as Ref<T>;
     
     try {
       const item = localStorage.getItem(key);
       if (item) {
         storedValue.value = JSON.parse(item);
       }
     } catch {
       console.error('Failed to read from localStorage');
     }
     
     watch(storedValue, (newValue) => {
       localStorage.setItem(key, JSON.stringify(newValue));
     });
     
     return storedValue;
   }
   ```

3. **Pinia Store**
   ```typescript
   import { defineStore } from 'pinia';
   import { ref, computed } from 'vue';
   
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   export const useUserStore = defineStore('user', () => {
     const user = ref<User | null>(null);
     const token = ref<string | null>(null);
     
     const isAuthenticated = computed(() => !!token.value);
     const userName = computed(() => user.value?.name ?? 'Guest');
     
     async function login(email: string, password: string) {
       const response = await fetch('/api/login', {
         method: 'POST',
         body: JSON.stringify({ email, password }),
       });
       
       if (!response.ok) throw new Error('Login failed');
       
       const data = await response.json();
       user.value = data.user;
       token.value = data.token;
     }
     
     function logout() {
       user.value = null;
       token.value = null;
     }
     
     async function fetchUser() {
       if (!token.value) return;
       
       const response = await fetch('/api/me', {
         headers: {
           Authorization: `Bearer ${token.value}`,
         },
       });
       
       if (response.ok) {
         user.value = await response.json();
       }
     }
     
     return {
       user,
       token,
       isAuthenticated,
       userName,
       login,
       logout,
       fetchUser,
     };
   });
   ```

### Nuxt.js

1. **Pages and Routing**
   ```vue
   <script setup lang="ts">
   const route = useRoute();
   const router = useRouter();
   
   const { data: user, pending } = await useFetch(`/api/users/${route.params.id}`);
   
   function goBack() {
     router.push('/users');
   }
   </script>
   
   <template>
     <div>
       <button @click="goBack">Back</button>
       <div v-if="pending">Loading...</div>
       <div v-else>
         <h1>{{ user?.name }}</h1>
       </div>
     </div>
   </template>
   ```

2. **Server Routes**
   ```typescript
   export default defineEventHandler(async (event) => {
     const method = getMethod(event);
     const id = getRouterParam(event, 'id');
     
     if (method === 'GET') {
       const user = await getUserById(id);
       return user;
     }
     
     if (method === 'PUT') {
       const body = await readBody(event);
       const updated = await updateUser(id, body);
       return updated;
     }
     
     throw createError({
       statusCode: 405,
       message: 'Method not allowed',
     });
   });
   ```

3. **Layouts**
   ```vue
   <template>
     <div class="layout">
       <header>
         <nav>
           <NuxtLink to="/">Home</NuxtLink>
           <NuxtLink to="/about">About</NuxtLink>
         </nav>
       </header>
       <main>
         <slot />
       </main>
       <footer>
         <p>&copy; 2024 My App</p>
       </footer>
     </div>
   </template>
   ```

### Component Patterns

1. **Props and Emits**
   ```vue
   <script setup lang="ts">
   interface Props {
     title: string;
     items: Array<{ id: string; name: string }>;
     maxItems?: number;
   }
   
   const props = withDefaults(defineProps<Props>(), {
     maxItems: 10,
   });
   
   const emit = defineEmits<{
     select: [item: { id: string; name: string }];
     delete: [id: string];
   }>();
   
   const visibleItems = computed(() => props.items.slice(0, props.maxItems));
   
   function handleSelect(item: { id: string; name: string }) {
     emit('select', item);
   }
   </script>
   
   <template>
     <div class="list">
       <h2>{{ title }}</h2>
       <ul>
         <li
           v-for="item in visibleItems"
           :key="item.id"
           @click="handleSelect(item)"
         >
           {{ item.name }}
           <button @click.stop="emit('delete', item.id)">Delete</button>
         </li>
       </ul>
     </div>
   </template>
   ```

2. **Slots**
   ```vue
   <script setup lang="ts">
   interface Props {
     loading?: boolean;
   }
   
   defineProps<Props>();
   </script>
   
   <template>
     <div class="card">
       <div class="card-header">
         <slot name="header" />
       </div>
       <div class="card-body">
         <div v-if="loading">Loading...</div>
         <slot v-else />
       </div>
       <div class="card-footer">
         <slot name="footer" />
       </div>
     </div>
   </template>
   ```

3. **v-model**
   ```vue
   <script setup lang="ts">
   const model = defineModel<string>({ default: '' });
   
   const props = defineProps<{
     label?: string;
     type?: string;
   }>();
   </script>
   
   <template>
     <div class="input-wrapper">
       <label v-if="label">{{ label }}</label>
       <input
         :type="type ?? 'text'"
         :value="model"
         @input="model = ($event.target as HTMLInputElement).value"
       />
     </div>
   </template>
   ```

### Directives

1. **Custom Directives**
   ```typescript
   export const vFocus = {
     mounted(el: HTMLElement) {
       el.focus();
     },
   };
   
   export const vClickOutside = {
     mounted(el: HTMLElement, binding: any) {
       el._clickOutside = (event: Event) => {
         if (!(el === event.target || el.contains(event.target as Node))) {
           binding.value();
         }
       };
       document.addEventListener('click', el._clickOutside);
     },
     unmounted(el: HTMLElement) {
       document.removeEventListener('click', el._clickOutside);
     },
   };
   ```

### Testing

1. **Vitest**
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { mount } from '@vue/test-utils';
   import UserProfile from './UserProfile.vue';
   
   describe('UserProfile', () => {
     it('renders user information', async () => {
       const wrapper = mount(UserProfile, {
         props: {
           userId: '1',
         },
         global: {
           mocks: {
             $fetch: vi.fn().mockResolvedValue({
               id: '1',
               name: 'John Doe',
               email: 'john@example.com',
             }),
           },
         },
       });
       
       expect(wrapper.text()).toContain('Loading...');
       
       await wrapper.vm.$nextTick();
       
       expect(wrapper.text()).toContain('John Doe');
     });
     
     it('emits update event', async () => {
       const wrapper = mount(UserProfile, {
         props: { userId: '1' },
       });
       
       await wrapper.find('button').trigger('click');
       
       expect(wrapper.emitted('update')).toBeTruthy();
     });
   });
   ```

## Output Contract
- Vue components (SFC)
- Composables
- Pinia stores
- Nuxt pages and layouts
- Custom directives
- Test files

## Constraints
- Use TypeScript
- Use Composition API with script setup
- Follow Vue style guide
- Implement proper error handling
- Ensure accessibility

## Examples

### Example 1: Form Component
```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(values),
  });
});
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input v-model="email" v-bind="emailAttrs" type="email" />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>
    <div>
      <input v-model="password" v-bind="passwordAttrs" type="password" />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>
```

### Example 2: Infinite Scroll
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

const items = ref<Item[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);

const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  
  loading.value = true;
  const newItems = await fetchItems(page.value);
  
  if (newItems.length === 0) {
    hasMore.value = false;
  } else {
    items.value.push(...newItems);
    page.value++;
  }
  
  loading.value = false;
};

const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(sentinel, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    loadMore();
  }
});
</script>

<template>
  <div>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    <div ref="sentinel" />
    <div v-if="loading">Loading more...</div>
    <div v-if="!hasMore">No more items</div>
  </div>
</template>
```
