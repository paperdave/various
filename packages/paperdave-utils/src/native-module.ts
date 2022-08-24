function getNativeModule<X>(id: string): X {
  try {
    return require(id) as X;
  } catch (error) {
    return null!;
  }
}

export const fs = getNativeModule<typeof import('fs')>('fs');
export const path = getNativeModule<typeof import('path')>('path');
export const nodeCrypto = getNativeModule<typeof import('crypto')>('crypto');
