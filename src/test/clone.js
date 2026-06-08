function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}

// 浅拷贝

// const shallowCopy = {...originalObj}
// Object.assign(shallowCopy, originalObj)

function debounce(func, delay) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function throttle(func, delay) {
  let timer = null;

  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}

const tree = [
  {
    id: 1,
    name: "a",
    children: [
      {
        id: 2,
        name: "b",
      },
      {
        id: 3,
        name: "c",
      },
    ],
  },
];

const tree1 = [
  {
    id: 1,
    name: "a",
    children: [
      {
        id: 2,
        visible: true,
        name: "b",
      },
      {
        id: 3,
        visible: true,
        name: "c",
      },
    ],
  },
  {
    id: 2,
    visible: true,
    name: "b",
  },
  {
    id: 3,
    visible: true,
    name: "c",
  },
];
