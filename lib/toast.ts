/**
 * Toast notification service
 * Use this to show notifications throughout the app
 */

export interface ToastOptions {
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
}

class ToastService {
  show(message: string, options: ToastOptions = {}) {
    const { duration = 3000, type = "info" } = options;

    const event = new CustomEvent("custom-toast", {
      detail: { message, type, duration },
    });

    window.dispatchEvent(event);
  }

  success(message: string, duration?: number) {
    this.show(message, { type: "success", duration });
  }

  error(message: string, duration?: number) {
    this.show(message, { type: "error", duration });
  }

  info(message: string, duration?: number) {
    this.show(message, { type: "info", duration });
  }

  warning(message: string, duration?: number) {
    this.show(message, { type: "warning", duration });
  }
}

export const toast = new ToastService();
