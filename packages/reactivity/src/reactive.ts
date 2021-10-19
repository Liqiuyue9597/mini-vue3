import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from "./baseHandlers"

// weakMap的有点
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();

export function reactive (target, false) {
  return createReactive(target, false);
}
export function shallowReactive (target, false) {

}
export function readonly (target, true) {

}
export function shallowReadonly (target, true) {

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