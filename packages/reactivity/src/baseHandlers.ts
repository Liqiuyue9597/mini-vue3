import { extend, hasChanged, hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
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
    // 新增/修改/没改
    const oldValue = target[key];
    const hadKey = isArray(target) && isIntegerKey(key)
      ? Number(key) < target.length
      : hasOwn(target, key)

    if (!hadKey) {
      // 新增
      trigger(target, TriggerOpTypes.ADD, key, value);
    } else if (hasChanged(value, oldValue)) {
      // 修改：但是值不一样
      trigger(target, TriggerOpTypes.SET, key, value, oldValue);

    }


    const result = Reflect.set(target, key, value, receiver);
    // 当数据更新时，通知对应属性的effect重新执行


    return result;
  }
}


export const mutableHandlers = {
  get,
  set
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}
export const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj);