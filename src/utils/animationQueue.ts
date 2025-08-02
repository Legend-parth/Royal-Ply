interface QueuedAnimation {
  id: string;
  element: HTMLElement;
  animation: () => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
}

class AnimationQueue {
  private queue: QueuedAnimation[] = [];
  private running: Map<string, boolean> = new Map();
  private completed: Set<string> = new Set();
  private failed: Set<string> = new Set();
  private isProcessing = false;

  add(animation: Omit<QueuedAnimation, 'retryCount'>) {
    const queuedAnimation: QueuedAnimation = {
      ...animation,
      retryCount: 0
    };
    
    this.queue.push(queuedAnimation);
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    if (!this.isProcessing) {
      this.process();
    }
  }

  private async process() {
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const animation = this.queue.shift();
      if (!animation) continue;
      
      if (this.completed.has(animation.id) || this.failed.has(animation.id)) {
        continue;
      }
      
      try {
        this.running.set(animation.id, true);
        await this.executeWithTimeout(animation);
        this.completed.add(animation.id);
        this.running.set(animation.id, false);
      } catch (error) {
        console.warn(`Animation ${animation.id} failed:`, error);
        
        if (animation.retryCount < animation.maxRetries) {
          animation.retryCount++;
          this.queue.unshift(animation); // Retry at front of queue
        } else {
          this.failed.add(animation.id);
          this.running.set(animation.id, false);
        }
      }
      
      // Small delay between animations to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    }
    
    this.isProcessing = false;
  }

  private executeWithTimeout(animation: QueuedAnimation): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Animation ${animation.id} timed out`));
      }, 5000); // 5 second timeout
      
      animation.animation()
        .then(() => {
          clearTimeout(timeout);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  isRunning(id: string): boolean {
    return this.running.get(id) || false;
  }

  isCompleted(id: string): boolean {
    return this.completed.has(id);
  }

  hasFailed(id: string): boolean {
    return this.failed.has(id);
  }

  getStatus() {
    return {
      queued: this.queue.length,
      running: Array.from(this.running.entries()).filter(([_, running]) => running).length,
      completed: this.completed.size,
      failed: this.failed.size
    };
  }

  clear() {
    this.queue = [];
    this.running.clear();
    this.completed.clear();
    this.failed.clear();
    this.isProcessing = false;
  }
}

export const animationQueue: AnimationQueue = new AnimationQueue();
