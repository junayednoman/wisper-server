import { createHash } from "crypto";

const getNumericAgoraUid = (userId: string) => {
  const hash = createHash("sha256").update(userId).digest();
  const uid = hash.readUInt32BE(0) % 2147483647;
  return uid === 0 ? 1 : uid;
};

export default getNumericAgoraUid;
