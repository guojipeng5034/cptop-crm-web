import type { App } from 'vue'

import Store from 'remote-sys-base/Store';

export const setupStore = (app: App<Element>) => {
  Store.index.setupStore(app);
}
const store = Store.index.store

 export { store }
