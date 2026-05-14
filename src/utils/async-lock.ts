/**
 * 异步锁 - 防止并发访问共享资源
 * 使用队列机制避免 Promise 链无限累积
 */
export class AsyncLock {
  private queue: Array<{
    resolve: (release: () => void) => void;
    reject: (error: Error) => void;
  }> = [];
  private isLocked = false;
  private maxQueueSize: number;

  constructor(maxQueueSize = 100) {
    this.maxQueueSize = maxQueueSize;
  }

  async acquire<T>(fn: () => Promise<T>): Promise<T> {
    const release = await this.lock();
    try {
      return await fn();
    } finally {
      release();
    }
  }

  private async lock(): Promise<() => void> {
    // 队列大小限制，防止内存泄漏
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('AsyncLock queue overflow: too many concurrent requests');
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.isLocked || this.queue.length === 0) {
      return;
    }

    this.isLocked = true;
    const next = this.queue.shift()!;
    
    const release = () => {
      this.isLocked = false;
      this.processQueue();
    };

    next.resolve(release);
  }
}
