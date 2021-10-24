import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from "./baseHandlers"

// weakMap的特点
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();

export function reactive (target) {
  return createReactive(target, false, mutableHandlers);
}
export function shallowReactive (target) {
  return createReactive(target, false, shallowReactiveHandlers);
}
export function readonly (target) {
  return createReactive(target, true, readonlyHandlers);
}
export function shallowReadonly (target) {
  return createReactive(target, true, shallowReadonlyHandlers);
}


export function createReactive(target, isReadonly, baseHandler) {
  if(!isObject(target)) return;


  // 如果某个对象已经被代理过，就不用再次代理（问题） -> 缓存代理对象
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existingProxy =  proxyMap.get(target);
  if (existingProxy) return existingProxy;

  const proxy = new Proxy(target, baseHandler);
  proxyMap.set(target, proxy);
  return proxy;
}