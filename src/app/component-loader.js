export function createComponentLoader() {
  const scripts = new Map();
  const styles = new Map();

  function loadScript(src) {
    if (scripts.has(src)) return scripts.get(src);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    scripts.set(src, promise);
    return promise;
  }

  function loadStyle(href) {
    if (styles.has(href) || document.querySelector(`link[data-pocket-style="${href}"]`)) {
      return styles.get(href) || Promise.resolve();
    }
    const promise = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.pocketStyle = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    });
    styles.set(href, promise);
    return promise;
  }

  async function loadHtml(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return response.text();
  }

  return { loadScript, loadStyle, loadHtml };
}
