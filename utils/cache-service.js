import NodeCache from 'node-cache';

const cache = new NodeCache({stdTTL: 60});
export const setCache = (key, value, ttl = 60) => {
  const plainValue = JSON.parse(JSON.stringify(value));
  cache.set(key, plainValue, ttl);
};

export const getCache = (key) => {
  return cache.get(key);
};
