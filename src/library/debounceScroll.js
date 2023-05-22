export default function debounce(func, wait, immediate, event) {
  let timeout;
  return (event) => {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}
