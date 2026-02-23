import { setupUserMock } from './user';
import { setupDashboardMock } from './dashboard';

export function setupMock() {
  setupUserMock();
  setupDashboardMock();
  console.log('[Mock] 数据模拟服务已启动');
}
