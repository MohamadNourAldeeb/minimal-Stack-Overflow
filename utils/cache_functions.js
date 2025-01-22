import NodeCache from 'node-cache';
const nodeCache = new NodeCache();
export { nodeCache };
export let addToCache = (id, payload) => {
  nodeCache.set(id, payload);
};
export let deleteFromCache = (items) => {
  nodeCache.del([...items]);
};

export let getFromCache = (id) => nodeCache.get(id);
