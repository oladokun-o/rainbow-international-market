export interface ToastMessage {
  id: number;
  tone: 'success' | 'error' | 'info';
  message: string;
}

let nextId = 0;

class ToastStore {
  items = $state<ToastMessage[]>([]);

  /** Queues a toast; auto-dismisses after `durationMs` (default 3.2s hold). */
  push(message: string, tone: ToastMessage['tone'] = 'info', durationMs = 3200) {
    const id = nextId++;
    this.items = [...this.items, { id, tone, message }];
    setTimeout(() => this.dismiss(id), durationMs);
    return id;
  }

  dismiss(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

export const toastStore = new ToastStore();
