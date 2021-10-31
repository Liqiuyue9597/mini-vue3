import { isArray, isIntegerKey } from "@vue/shared/src";
import { TriggerOpTypes } from "./operations";

export function effect(fn, options: any = {}) {
  // 函数柯里化
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

const targetMap = new WeakMap();
export function track(target, type, key) {
  // activeEffect; // 当前正在运行的effect
  if (activeEffect === undefined) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

export function trigger(target, type, key?, newValue?, oldValue?) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  // 将所有要执行的effect存到一个新集合最终一起执行
  const effects = new Set();
  let deps = [];
  if (isArray(target) && key === 'length') {
    // 如果对应的长度有依赖收集就需要更新
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    // 除数组以外
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }

    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          
        } else if (isIntegerKey(target)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length'));
        }
        break
      default:
        break
    }
  }


  effects.forEach((effect: any) => effect());

}