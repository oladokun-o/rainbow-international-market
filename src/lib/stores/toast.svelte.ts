export interface ToastAction {
  label: string;
  href: string;
}

export interface ToastMessage {
  id: number;
  tone: 'success' | 'error' | 'info';
  message: string;
  subtext?: string;
  action?: ToastAction;
}

interface PushOptions {
  /** Auto-dismiss delay in ms (default 3.2s hold). */
  durationMs?: number;
  subtext?: string;
  action?: ToastAction;
}

let nextId = 0;

class ToastStore {
  items = $state<ToastMessage[]>([]);

  /** Queues a toast; auto-dismisses after `options.durationMs` (default 3.2s hold). */
  push(message: string, tone: ToastMessage['tone'] = 'info', options: PushOptions = {}) {
    const { durationMs = 3200, subtext, action } = options;
    const id = nextId++;
    this.items = [...this.items, { id, tone, message, subtext, action }];
    setTimeout(() => this.dismiss(id), durationMs);
    return id;
  }

  dismiss(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

export const toastStore = new ToastStore();
