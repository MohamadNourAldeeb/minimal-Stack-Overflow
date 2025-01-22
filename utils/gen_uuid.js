import * as crypto from 'crypto';

export let generateUuid = () => {
  //   const timestamp = Date.now();

  //   const randomBytes = crypto.randomUUID({});

  //   const timestampHex = timestamp.toString(8).padStart(4, '0');

  //   const combinedString =
  //     randomBytes.toString() + timestampHex.substring(timestampHex.length - 4);
  let uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  return uniqueId;
};
