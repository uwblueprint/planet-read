// Inspiration from  https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
function debounce(func: (...args: any[]) => any, wait: number) {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout != null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

export { debounce as default };
