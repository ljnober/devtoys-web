// GZip 压缩/解压：使用浏览器原生 CompressionStream / DecompressionStream，零网络请求。
// TypeScript 4.8 的 DOM 声明尚未包含这两个构造器，这里用最小本地接口包裹。

type StreamCtor = new (format: 'gzip') => {
  readable: ReadableStream<Uint8Array>
  writable: WritableStream<Uint8Array>
}

/** 从全局对象安全获取流式压缩 API，缺失时返回 null 由调用方给出中文提示。 */
function getStreamCtor(name: 'CompressionStream' | 'DecompressionStream'): StreamCtor | null {
  const api = (globalThis as unknown as Record<string, StreamCtor | undefined>)[name]
  return api ?? null
}

/** 把文本压缩为 gzip 字节。 */
export async function gzipCompress(value: string): Promise<Uint8Array> {
  const Ctor = getStreamCtor('CompressionStream')
  if (!Ctor) {
    throw new Error('当前浏览器不支持 CompressionStream，请使用新版 Chrome / Edge / Firefox')
  }
  const stream = new Blob([value]).stream().pipeThrough(new Ctor('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** 把 gzip 字节解压回文本。 */
export async function gzipDecompress(bytes: Uint8Array): Promise<string> {
  const Ctor = getStreamCtor('DecompressionStream')
  if (!Ctor) {
    throw new Error('当前浏览器不支持 DecompressionStream，请使用新版 Chrome / Edge / Firefox')
  }
  const source = new Blob([bytes as BlobPart]).stream()
  const stream = source.pipeThrough(new Ctor('gzip'))
  return await new Response(stream).text()
}

/** 字节数组转 Base64，便于在文本框中展示和复制。 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

/** Base64 转字节数组，用于把用户粘贴的压缩结果还原。 */
export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value.trim().replace(/\s/g, ''))
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}
