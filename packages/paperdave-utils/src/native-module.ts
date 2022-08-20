async function getNativeModule<X>(id: string): Promise<X> {
  try {
    return (await import(id)) as X;
  } catch (error) {
    return null!;
  }
}

export const fs = await getNativeModule<typeof import('fs')>('fs');
export const path = await getNativeModule<typeof import('path')>('path');
export const nodeCrypto = await getNativeModule<typeof import('crypto')>('crypto');
