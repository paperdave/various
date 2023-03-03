import { resolveMetadata } from './merge';
import { renderMetadata } from './render';
import { Metadata } from './types';

export * from './types';
export * from './merge'
export * from './render'

export function resolveAndRenderMetadata(...metadata: [Metadata, ...Metadata[]]) {
  return renderMetadata(resolveMetadata(...metadata));
}
