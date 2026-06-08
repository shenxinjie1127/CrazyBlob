const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  #state = PENDING;
  #result = void 0;
  #handler = [];
  constructor(executor) {
    const resolve = (value) => {
      this.#changeState(FULFILLED, value);
    };

    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  #isPromise(value) {
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function")
    ) {
      return typeof value.then === "function";
    }
    return false;
  }
  #changeState(state, result) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = result;
    this.#run();
  }

  #runMicroTask(func) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
      process.nextTick(func);
    } else if (typeof MutationObserver === "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("");
      ob.observe(textNode, { characterData: true });
      textNode.textContent = "1";
      ob.disconnect();
    } else {
      setTimeout(func, 0);
    }
  }

  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
        const settled = this.#state === FULFILLED ? resolve : reject;
        settled(this.#result);
        return;
      }
      try {
        const data = callback(this.#result);
        if (this.#isPromise(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  #run() {
    if (this.#state === PENDING) return;
    while (this.#handler.length) {
      const handler = this.#handler.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(handler.onFulfilled, handler.resolve, handler.reject);
      } else {
        this.#runOne(handler.onRejected, handler.resolve, handler.reject);
      }
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handler.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}



function myNew (constructor, ...args) {
    const obj = {}
    Object.setPrototypeOf(obj, constructor.prototype);
    const result = constructor.apply(obj, args);
    return result !== null && typeof result === 'object' ? result : obj;
}