import { defineStore } from 'pinia';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { login as loginApi, register as registerApi } from '@/api/user';
import router from '@/router';
import { message } from 'ant-design-vue';

// 定义用户信息类型
interface UserInfo {
  id: number;
  username: string;
  role: string;
  name: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: null as UserInfo | null,
  }),
  actions: {
    // 登录
    async login(username: string, password: string) {
      const res = await loginApi({ username, password });
      this.token = res.token;
      this.userInfo = res.userInfo;
      setToken(res.token);
      message.success('登录成功');
      router.push('/');
    },
    // 注册
    async register(userInfo: any) {
      await registerApi(userInfo);
      message.success('注册成功，请登录');
      router.push('/login');
    },
    // 登出
    logout() {
      this.token = '';
      this.userInfo = null;
      removeToken();
      router.push('/login');
      message.info('已退出登录');
    }
  }
});
