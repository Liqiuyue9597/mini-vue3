/*
 * @Author: your name
 * @Date: 2021-10-13 10:56:01
 * @LastEditTime: 2021-10-17 19:16:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mini-vue3/package/runtime-dom/src/index.ts
 */
import {
  CreateAppFunction,
} from '@vue/runtime-core';

import {
  createRenderer,
  Renderer,
} from '@vue/runtime-dom';

import { 
  isFunction,
  isString,
  extend,
} from '@vue/shared';



const rendererOptions = extend({ patchProp }, nodeOps);

let renderer: Renderer<Element | ShadowRoot> | HydrationRenderer
// 延时创建渲染器，当用户只依赖响应式包的时候，可以通过tree-shaking移除核心渲染逻辑相关的代码
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}

export const createApp = ((...args) => {
  // ensureRenderer创建渲染器对象：包含平台渲染核心逻辑的JavaScript对象
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  // 重写app的mount方法
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return


    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML
      // 2.x compat check
      if (__COMPAT__ && __DEV__) {
        for (let i = 0; i < container.attributes.length; i++) {
          const attr = container.attributes[i]
          if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
            compatUtils.warnDeprecation(
              DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
              null
            )
            break
          }
        }
      }
    }

    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }
  return app
}) as CreateAppFunction<Element>

function normalizeContainer (
  container: Element | ShadowRoot | string
): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container);
    if (__DEV__ && !res) {
      warn(
        `Failed to mount app: mount target selector "${container}" returned null.`
      )
    }
    return res
  }
}