# Mobile Development

## Description
Expert in cross-platform mobile development using React Native and Flutter including native modules, navigation, state management, and app deployment.

## Usage Scenario
Use this skill when:
- Building mobile applications
- React Native development
- Flutter development
- Cross-platform considerations
- Native module integration
- App store deployment

## Instructions

### React Native

1. **Project Setup**
   ```bash
   npx react-native@latest init MyApp --template typescript
   cd MyApp
   npx react-native start
   npx react-native run-ios
   npx react-native run-android
   ```

2. **Core Components**
   ```tsx
   import React from 'react';
   import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     FlatList,
     Image,
     ActivityIndicator,
   } from 'react-native';
   import { SafeAreaView } from 'react-native-safe-area-context';
   
   interface User {
     id: string;
     name: string;
     avatar: string;
   }
   
   interface UserListProps {
     users: User[];
     loading: boolean;
     onUserPress: (user: User) => void;
   }
   
   export function UserList({ users, loading, onUserPress }: UserListProps) {
     if (loading) {
       return (
         <View style={styles.center}>
           <ActivityIndicator size="large" color="#0000ff" />
         </View>
       );
     }
     
     const renderItem = ({ item }: { item: User }) => (
       <TouchableOpacity
         style={styles.item}
         onPress={() => onUserPress(item)}
       >
         <Image source={{ uri: item.avatar }} style={styles.avatar} />
         <Text style={styles.name}>{item.name}</Text>
       </TouchableOpacity>
     );
     
     return (
       <SafeAreaView style={styles.container}>
         <FlatList
           data={users}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
           contentContainerStyle={styles.list}
         />
       </SafeAreaView>
     );
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#fff',
     },
     center: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
     list: {
       padding: 16,
     },
     item: {
       flexDirection: 'row',
       alignItems: 'center',
       padding: 12,
       backgroundColor: '#f5f5f5',
       borderRadius: 8,
       marginBottom: 8,
     },
     avatar: {
       width: 48,
       height: 48,
       borderRadius: 24,
       marginRight: 12,
     },
     name: {
       fontSize: 16,
       fontWeight: '500',
     },
   });
   ```

3. **Navigation**
   ```tsx
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';
   import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
   
   const Stack = createNativeStackNavigator();
   const Tab = createBottomTabNavigator();
   
   function HomeTabs() {
     return (
       <Tab.Navigator>
         <Tab.Screen 
           name="Feed" 
           component={FeedScreen}
           options={{ tabBarIcon: ({ color }) => <Icon name="home" color={color} /> }}
         />
         <Tab.Screen 
           name="Profile" 
           component={ProfileScreen}
           options={{ tabBarIcon: ({ color }) => <Icon name="user" color={color} /> }}
         />
       </Tab.Navigator>
     );
   }
   
   export function AppNavigator() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen 
             name="Home" 
             component={HomeTabs}
             options={{ headerShown: false }}
           />
           <Stack.Screen 
             name="Details" 
             component={DetailsScreen}
             options={{ title: 'Details' }}
           />
         </Stack.Navigator>
       </NavigationContainer>
     );
   }
   
   function DetailsScreen({ route, navigation }) {
     const { id } = route.params;
     
     return (
       <View>
         <Text>Details for {id}</Text>
         <Button 
           title="Go back" 
           onPress={() => navigation.goBack()} 
         />
       </View>
     );
   }
   ```

4. **State Management with Redux**
   ```tsx
   import { createSlice, configureStore } from '@reduxjs/toolkit';
   import { Provider, useDispatch, useSelector } from 'react-redux';
   
   interface UserState {
     user: User | null;
     loading: boolean;
     error: string | null;
   }
   
   const userSlice = createSlice({
     name: 'user',
     initialState: { user: null, loading: false, error: null } as UserState,
     reducers: {
       loginStart: (state) => {
         state.loading = true;
         state.error = null;
       },
       loginSuccess: (state, action) => {
         state.loading = false;
         state.user = action.payload;
       },
       loginFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
       },
       logout: (state) => {
         state.user = null;
       },
     },
   });
   
   export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
   
   const store = configureStore({
     reducer: {
       user: userSlice.reducer,
     },
   });
   
   export function useUser() {
     const dispatch = useDispatch();
     const { user, loading, error } = useSelector((state: RootState) => state.user);
     
     const login = async (email: string, password: string) => {
       dispatch(loginStart());
       try {
         const response = await fetch('/api/login', {
           method: 'POST',
           body: JSON.stringify({ email, password }),
         });
         const data = await response.json();
         dispatch(loginSuccess(data.user));
       } catch (e) {
         dispatch(loginFailure(e.message));
       }
     };
     
     return { user, loading, error, login };
   }
   ```

5. **Native Modules**
   ```typescript
   import { NativeModules, NativeEventEmitter } from 'react-native';
   
   const { MyNativeModule } = NativeModules;
   
   export const NativeAPI = {
     async getDeviceId(): Promise<string> {
       return MyNativeModule.getDeviceId();
     },
     
     async saveToKeychain(key: string, value: string): Promise<void> {
       return MyNativeModule.saveToKeychain(key, value);
     },
     
     addEventListener(event: string, callback: (data: any) => void) {
       const emitter = new NativeEventEmitter(MyNativeModule);
       return emitter.addListener(event, callback);
     },
   };
   ```

### Flutter

1. **Project Setup**
   ```bash
   flutter create my_app
   cd my_app
   flutter run
   flutter build ios
   flutter build apk
   ```

2. **Core Widgets**
   ```dart
   import 'package:flutter/material.dart';
   
   class UserList extends StatelessWidget {
     final List<User> users;
     final bool loading;
     final Function(User) onUserPress;
   
     const UserList({
       Key? key,
       required this.users,
       required this.loading,
       required this.onUserPress,
     }) : super(key: key);
   
     @override
     Widget build(BuildContext context) {
       if (loading) {
         return const Center(child: CircularProgressIndicator());
       }
   
       return ListView.builder(
         itemCount: users.length,
         itemBuilder: (context, index) {
           final user = users[index];
           return ListTile(
             leading: CircleAvatar(
               backgroundImage: NetworkImage(user.avatar),
             ),
             title: Text(user.name),
             onTap: () => onUserPress(user),
           );
         },
       );
     }
   }
   
   class UserDetailScreen extends StatefulWidget {
     final String userId;
   
     const UserDetailScreen({Key? key, required this.userId}) : super(key: key);
   
     @override
     State<UserDetailScreen> createState() => _UserDetailScreenState();
   }
   
   class _UserDetailScreenState extends State<UserDetailScreen> {
     User? _user;
     bool _loading = true;
   
     @override
     void initState() {
       super.initState();
       _loadUser();
     }
   
     Future<void> _loadUser() async {
       final response = await fetchUser(widget.userId);
       setState(() {
         _user = response;
         _loading = false;
       });
     }
   
     @override
     Widget build(BuildContext context) {
       if (_loading) {
         return const Scaffold(
           body: Center(child: CircularProgressIndicator()),
         );
       }
   
       return Scaffold(
         appBar: AppBar(title: Text(_user?.name ?? 'User')),
         body: Padding(
           padding: const EdgeInsets.all(16.0),
           child: Column(
             crossAxisAlignment: CrossAxisAlignment.start,
             children: [
               Text('Email: ${_user?.email}'),
               const SizedBox(height: 8),
               Text('Phone: ${_user?.phone}'),
             ],
           ),
         ),
       );
     }
   }
   ```

3. **Navigation**
   ```dart
   import 'package:go_router/go_router.dart';
   
   final router = GoRouter(
     routes: [
       GoRoute(
         path: '/',
         builder: (context, state) => const HomeScreen(),
       ),
       GoRoute(
         path: '/users',
         builder: (context, state) => const UserListScreen(),
       ),
       GoRoute(
         path: '/users/:id',
         builder: (context, state) {
           final id = state.pathParameters['id']!;
           return UserDetailScreen(userId: id);
         },
       ),
     ],
   );
   
   class MyApp extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return MaterialApp.router(
         routerConfig: router,
       );
     }
   }
   
   context.go('/users/123');
   context.push('/users/123');
   context.pop();
   ```

4. **State Management with Riverpod**
   ```dart
   import 'package:flutter_riverpod/flutter_riverpod.dart';
   
   final userProvider = StateNotifierProvider<UserNotifier, UserState>((ref) {
     return UserNotifier();
   });
   
   class UserState {
     final User? user;
     final bool loading;
     final String? error;
   
     UserState({this.user, this.loading = false, this.error});
   
     UserState copyWith({User? user, bool? loading, String? error}) {
       return UserState(
         user: user ?? this.user,
         loading: loading ?? this.loading,
         error: error ?? this.error,
       );
     }
   }
   
   class UserNotifier extends StateNotifier<UserState> {
     UserNotifier() : super(UserState());
   
     Future<void> login(String email, String password) async {
       state = state.copyWith(loading: true, error: null);
       try {
         final user = await _api.login(email, password);
         state = state.copyWith(user: user, loading: false);
       } catch (e) {
         state = state.copyWith(error: e.toString(), loading: false);
       }
     }
   
     void logout() {
       state = UserState();
     }
   }
   
   class LoginScreen extends ConsumerWidget {
     @override
     Widget build(BuildContext context, WidgetRef ref) {
       final userState = ref.watch(userProvider);
   
       return Column(
         children: [
           if (userState.loading) CircularProgressIndicator(),
           if (userState.error != null) Text(userState.error!),
           ElevatedButton(
             onPressed: () => ref.read(userProvider.notifier).login(
               'email@example.com',
               'password',
             ),
             child: Text('Login'),
           ),
         ],
       );
     }
   }
   ```

5. **Platform Channels**
   ```dart
   import 'package:flutter/services.dart';
   
   class NativeAPI {
     static const _channel = MethodChannel('com.app/native');
   
     static Future<String> getDeviceId() async {
       return await _channel.invokeMethod('getDeviceId');
     }
   
     static Future<void> saveToKeychain(String key, String value) async {
       await _channel.invokeMethod('saveToKeychain', {
         'key': key,
         'value': value,
       });
     }
   
     static void listenToEvents(Function(dynamic) onEvent) {
       _channel.setMethodCallHandler((call) async {
         if (call.method == 'onEvent') {
           onEvent(call.arguments);
         }
       });
     }
   }
   ```

### Deployment

1. **iOS (App Store)**
   ```bash
   cd ios
   pod install
   open MyApp.xcworkspace
   
   # In Xcode:
   # 1. Select your team
   # 2. Configure signing
   # 3. Archive
   # 4. Upload to App Store Connect
   ```

2. **Android (Play Store)**
   ```bash
   cd android
   ./gradlew bundleRelease
   
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   # Upload to Google Play Console
   ```

3. **React Native CodePush**
   ```bash
   appcenter login
   appcenter codepush release-react -a <owner>/<app> -d Production
   ```

## Output Contract
- React Native components
- Flutter widgets
- Navigation configuration
- State management setup
- Native module integration
- Deployment scripts

## Constraints
- Follow platform guidelines
- Handle permissions properly
- Test on both platforms
- Optimize performance
- Handle offline scenarios

## Examples

### Example 1: React Native API Service
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

class APIService {
   private baseURL = 'https://api.example.com';
   
   async get<T>(endpoint: string): Promise<T> {
     const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${this.baseURL}${endpoint}`, {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
     });
     return response.json();
   }
   
   async post<T>(endpoint: string, data: any): Promise<T> {
     const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${this.baseURL}${endpoint}`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });
     return response.json();
   }
}
```

### Example 2: Flutter HTTP Client
```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class APIClient {
   final Dio _dio = Dio(BaseOptions(
     baseUrl: 'https://api.example.com',
   ));
   final _storage = FlutterSecureStorage();
   
   Future<T> get<T>(String path) async {
     final token = await _storage.read(key: 'token');
     final response = await _dio.get(
       path,
       options: Options(headers: {'Authorization': 'Bearer $token'}),
     );
     return response.data as T;
   }
   
   Future<T> post<T>(String path, dynamic data) async {
     final token = await _storage.read(key: 'token');
     final response = await _dio.post(
       path,
       data: data,
       options: Options(headers: {'Authorization': 'Bearer $token'}),
     );
     return response.data as T;
   }
}
```
