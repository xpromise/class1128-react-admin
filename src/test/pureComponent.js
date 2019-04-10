// 实现了Object.is()
function is(x, y) {
  //  x !== x && y !== y  -->  NaN
  // x !== 0 || 1 / x === 1 / y  -->  0 -0
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
    ;
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  // 判断两个值是否相等
  if (is(objA, objB)) {
    // 如果相等，就不更新
    return true;
  }
  // 如果值不相等并且是基本数据类型和函数
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    // 就更新
    return false;
  }
  // 说明值不相等，并且值是对象类型 {} []
  // 提取对象上所有的属性，转化为数组
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  // 判断属性长度是否一致
  if (keysA.length !== keysB.length) {
    // 需要更新
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    // !hasOwnProperty$1.call(objB, keysA[i]) 判断对象A的属性，是否是对象B的直接属性
    // !is(objA[keysA[i]], objB[keysA[i]]) 判断属性的值是否相等
    if (!hasOwnProperty$1.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      // 如果不是属性或者不相等，就更新
      return false;
    }
  }

  return true;
}
/*
  性能优化：
    1. 减少React组件重新渲染的次数
      - 自定义  shouldComponentUpdate
      - 使用 PureComponent 组件  --> 浅比较
    2. 缺点：
      如果属性中属性发生变化，他不会更新

      immutable-js  定义数据 特点：唯一
 */