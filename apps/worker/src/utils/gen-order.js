"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReadableOrderNumber = generateReadableOrderNumber;
const index_1 = require("@repo/redis/src/index");
async function generateReadableOrderNumber() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const redisKey = `order_seq:${datePart}`;
    const sequence = await index_1.redis.incr(redisKey);
    if (sequence === 1) {
        await index_1.redis.expire(redisKey, 86400); //24小時後自動刪除
    }
    const seqPart = sequence.toString().padStart(5, "0");
    // ex：2026042600001
    return `OR${datePart}${seqPart}`;
}
//# sourceMappingURL=gen-order.js.map