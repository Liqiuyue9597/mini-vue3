/*
 * @Author: your name
 * @Date: 2021-10-15 13:52:32
 * @LastEditTime: 2021-10-15 14:00:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /working/mini-vue3/package/runtime-core/src/component.ts
 */
// Record<K, T>：将T的类型应用到K上
// Data类型：将string转为unknown
export type Data = Record<string, unknown>

export type Component<
  Props = any,
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions
  > =
  | ConcreteComponent<Props, RawBindings, D, C, M>
  | ComponentPublicInstanceConstructor<Props>