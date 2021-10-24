import { extend, isObject } from "@vue/shared";
import { track } from "./effect";
import { TrackOpTypes } from "./operations";
import { reactive, readonly } from "./reactive";


let readonlyObj = {
  set: (target, key) => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
  }
};

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 收集依赖
      track(target, TrackOpTypes.GET, key);
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  }
}


const set = createSetter();
const shallowSet = createSetter(true);
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);


    return result;
  }
}


export const mutableHandlers = {
  get
}
export const shallowReactiveHandlers = {
  get: shallowGet
}
export const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj);