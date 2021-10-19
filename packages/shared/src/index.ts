/*
 * @Author: your name
 * @Date: 2021-10-13 21:11:41
 * @LastEditTime: 2021-10-19 11:47:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /working/mini-vue3/package/shared/src/index.ts
 */



// Object.assign深拷贝：用于将所有可枚举属性的值从一个或多个源对象分配到目标对象
export const extend = Object.assign


export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'