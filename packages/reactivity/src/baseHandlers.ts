import { extend, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";


let readonlyObj = {
  set: (target, key) => {
    console.warn(`设置${key}失败`);
  }
};

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get (target, key, receiver) {
    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 收集依赖
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