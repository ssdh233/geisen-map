// TODO unit test (test point: this)
export default function debounce(func: Function, delay: number) {
  let inDebounce: number; // timeoutID
  return function() {
    const args = arguments;
    clearTimeout(inDebounce);
    // @ts-ignore
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
}
