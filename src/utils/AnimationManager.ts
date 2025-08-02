interface QueuedAnimation {
  id: string;
  element: HTMLElement;
  animation: () => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  retries: number;
  maxRetries: number;
  timeout?: number;
}

export class AnimationManager {
  private animations: Map<string, QueuedAnimation> = new Map();
  private running: Set<string> = new Set();
  private completed: Set<string> = new Set();
  private failed: Set<string> = new Set();
  private isProcessing = false;
  private performanceMonitor = new PerformanceMonitor();

  addAnimation(animation: Omit<QueuedAnimation, 'retries'>) {
    const queuedAnimation: QueuedAnimation = {
      ...animation,
      retries: 0,
      timeout: animation.timeout || 5000
    };
    
    this.animations.set(animation.id, queuedAnimation);
  }

  async executeAll(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Sort by priority
      const sortedAnimations = Array.from(this.animations.values()).sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Execute high priority animations first
      const highPriority = sortedAnimations.filter(a => a.priority === 'high');
      await this.executeAnimationBatch(highPriority);

      // Then medium priority
      const mediumPriority = sortedAnimations.filter(a => a.priority === 'medium');
      await this.executeAnimationBatch(mediumPriority);

      // Finally low priority
      const lowPriority = sortedAnimations.filter(a => a.priority === 'low');
      await this.executeAnimationBatch(lowPriority);

    } finally {
      this.isProcessing = false;
    }
  }

  private async executeAnimationBatch(animations: QueuedAnimation[]): Promise<void> {
    const promises = animations.map(animation => this.executeAnimation(animation));
    await Promise.allSettled(promises);
  }

  private async executeAnimation(animation: QueuedAnimation): Promise<void> {
    if (this.completed.has(animation.id) || this.failed.has(animation.id)) {
      return;
    }

    this.running.add(animation.id);

    try {
      // Check if element is still in DOM
      if (!document.contains(animation.element)) {
        throw new Error(`Element for animation ${animation.id} not found in DOM`);
      }

      // Execute with timeout
      await this.executeWithTimeout(animation);
      
      this.completed.add(animation.id);
      this.performanceMonitor.recordSuccess(animation.id);
      
    } catch (error) {
      console.warn(`Animation ${animation.id} failed (attempt ${animation.retries + 1}):`, error);
      
      if (animation.retries < animation.maxRetries) {
        animation.retries++;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, animation.retries) * 100));
        return this.executeAnimation(animation);
      } else {
        this.failed.add(animation.id);
        this.performanceMonitor.recordFailure(animation.id, error as Error);
      }
    } finally {
      this.running.delete(animation.id);
    }
  }

  private executeWithTimeout(animation: QueuedAnimation): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Animation ${animation.id} timed out after ${animation.timeout}ms`));
      }, animation.timeout);

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

  getStatus() {
    return {
      total: this.animations.size,
      running: this.running.size,
      completed: this.completed.size,
      failed: this.failed.size,
      performance: this.performanceMonitor.getStats()
    };
  }

  isAnimationRunning(id: string): boolean {
    return this.running.has(id);
  }

  isAnimationCompleted(id: string): boolean {
    return this.completed.has(id);
  }

  hasAnimationFailed(id: string): boolean {
    return this.failed.has(id);
  }

  restart() {
    this.running.clear();
    this.completed.clear();
    this.failed.clear();
    this.isProcessing = false;
    
    // Reset retry counts
    this.animations.forEach(animation => {
      animation.retries = 0;
    });
  }

  cleanup() {
    this.animations.clear();
    this.running.clear();
    this.completed.clear();
    this.failed.clear();
    this.isProcessing = false;
  }
}

class PerformanceMonitor {
  private successCount = 0;
  private failureCount = 0;
  private failures: Array<{ id: string; error: Error; timestamp: number }> = [];
  private startTime = Date.now();

  recordSuccess(id: string) {
    this.successCount++;
  }

  recordFailure(id: string, error: Error) {
    this.failureCount++;
    this.failures.push({
      id,
      error,
      timestamp: Date.now()
    });

    // Keep only recent failures (last 10)
    if (this.failures.length > 10) {
      this.failures.shift();
    }
  }

  getStats() {
    const totalTime = Date.now() - this.startTime;
    const total = this.successCount + this.failureCount;
    
    return {
      successRate: total > 0 ? (this.successCount / total) * 100 : 0,
      totalAnimations: total,
      successCount: this.successCount,
      failureCount: this.failureCount,
      recentFailures: this.failures.slice(-5),
      averageTime: totalTime / Math.max(total, 1)
    };
  }
}