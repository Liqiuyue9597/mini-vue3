/*
 * @Author: your name
 * @Date: 2021-10-16 18:40:49
 * @LastEditTime: 2021-10-16 18:40:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /working/mini-vue3/package/runtime-core/src/vnode.ts
 */

import { Data } from "./component";

export const createVNode = (
  __DEV__ ? createVNodeWithArgsTransform : _createVNode
) as typeof _createVNode

function _createVNode (
  type: VNodeType | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
): VNode {
  
}