export default function debounce(func: any, delay: number) {
  // @ts-ignore
  let inDebounce;
  return function() {
    // @ts-ignore
    const context = this;
    const args = arguments;
    // @ts-ignore
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}
