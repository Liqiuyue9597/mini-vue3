export function effect(fn, options:any = {}) {
  // 
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect(fn, options);
  }
  return effect;
}

let uid = 0;
let activeEffect; // 存储当前的effect
const effectStack = [];
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect(fn, options) {
    // 保证effect没有被加入过stack中，防止频繁的执行effect比如effect(() => stat++)
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn(); // 函数（是用户写的）可能出现错误，所以要try-finally保证自己的程序不会中断
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  // 制作一个effect标识用于区分effect
  effect.id = uid++;
  // 用于标识这个是个响应式effect
  effect._isEffect = true;
  // 保留对应的原函数
  effect.raw = fn;
  effect.options = options;

  return effect;
}

const targetMap = new Map();
export function track(target, type, key) {
  // activeEffect; // 当前正在运行的effect
  if (activeEffect === undefined) return;
  console.log(target, key, activeEffect)
  // let depsMap = targetMap.get(target);
  // if (!depsMap) {
  //   targetMap.set(target, (depsMap = new Map()));
  // }
}

