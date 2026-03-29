---
icon: akar-icons:file
date: 2025-08-21
order: 6
category:
  - Utils
---

# UUID

基于时间创建不会重复的`Id<number>` 以毫秒为基准

```typescript
interface IdGenerator<T> {
  generate(): T;
}

class SequenceIdGenerator implements IdGenerator<number> {
  // （十六进制）0x176b986fc00 =（十进制）1609430400000 = 2021-1-1 0:0:0
  private static BASE_TIMESTAMP = 0x176b986fc00;
  // （十六进制）0x40000000 =（二进制）1000000000000000000000000000000
  // （十六进制）0xef80 =（二进制）1110111110000000
  // & 0xef80 = host共16位,后7位置为0
  private host = (Math.random() * 0x40000000) & 0xef80;
  private sequence = 0;
  private lastTime = 0;

  /**
   * 轮询获取下一毫秒
   * @private
   */
  private getNextTime(): number {
    let mill = Date.now();
    while (mill <= this.lastTime) {
      mill = Date.now();
    }
    return mill;
  }

  generate(): number {
    let currentTime = Date.now();

    if (this.lastTime === currentTime) {
      // （十六进制）0x7f =（十进制）127 =（二进制）1111111
      // 自增序列(& 0x7f) 相当于自增最大范围128(0~127), 意味着同一时间戳下最多只能生成128个id
      // (this.sequence++ & 0x7f) = 保留后七位
      this.sequence = ((this.sequence + 1) & 0x7f) + this.host;
      if (this.sequence === this.host) {
        // 同一毫秒序列用完
        // 获取下一毫秒
        currentTime = this.getNextTime();
      }
    } else {
      // 不同毫秒序列归零
      this.sequence = this.host;
    }
    // 时间存档
    this.lastTime = currentTime;
    // （十六进制）0x1fffffffff =（二进制）1111111111111111111111111111111111111 = （十进制）137438953471
    // a & 0x1fffffffff 即保留a的后37个bit的值，使a的前3个bit置0
    // 任何小于0x1fffffffff的数 与 上 0x1fffffffff等于它本身
    const timestamp =
      BigInt(currentTime - SequenceIdGenerator.BASE_TIMESTAMP) &
      BigInt(0x1fffffffff);

    // sequence有16位, 所以timestamp左移16位
    return Number(timestamp << BigInt(16)) + this.sequence;
  }
}

export const idGen: IdGenerator<number> = new SequenceIdGenerator();
```
