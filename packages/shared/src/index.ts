/*
 * @Author: your name
 * @Date: 2021-10-13 21:11:41
 * @LastEditTime: 2021-10-27 13:32:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /working/mini-vue3/package/shared/src/index.ts
 */



// Object.assign深拷贝：用于将所有可枚举属性的值从一个或多个源对象分配到目标对象
export const extend = Object.assign
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isArray = Array.isArray
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const objectToString = Object.prototype.toString
export const toTypeString = (val: unknown): string => objectToString.call(val)
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: Object, key: string | symbol): key is keyof typeof val => hasOwnProperty.call(val, key)
// Object.is与===的区别在于前者可以将NaN判断为相等，后者是不相等的
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)
