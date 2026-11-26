// 自定义音色角色档案：只保存在浏览器 IndexedDB，不经过网络。
export interface VoiceProfile {
  id: string
  name: string
  /** piper-plus zs-v1 使用 192 维 CAM++ 声纹向量。 */
  embedding: Float32Array
  createdAt: number
  /** 参考音频时长（秒），仅用于界面提示。 */
  duration: number
}

const DB_NAME = 'devtoys-web-tts'
const STORE_NAME = 'voice-profiles'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前浏览器不支持本地角色存储，请使用现代浏览器'))
      return
    }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('本地角色库打开失败，请检查浏览器存储权限'))
  })
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDatabase().then(database => new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const request = run(transaction.objectStore(STORE_NAME))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('本地角色库读写失败，请重试'))
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(new Error('本地角色库事务失败，请重试'))
  }))
}

/** 按创建时间倒序返回本地角色。 */
export async function listVoiceProfiles(): Promise<VoiceProfile[]> {
  const profiles = await withStore<VoiceProfile[]>('readonly', store => store.getAll() as IDBRequest<VoiceProfile[]>)
  return profiles.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveVoiceProfile(profile: VoiceProfile): Promise<void> {
  await withStore<IDBValidKey>('readwrite', store => store.put(profile))
}

export async function deleteVoiceProfile(id: string): Promise<void> {
  await withStore<undefined>('readwrite', store => store.delete(id) as IDBRequest<undefined>)
}

export function createVoiceId(): string {
  const random = globalThis.crypto?.getRandomValues?.(new Uint8Array(8))
  const suffix = random ? Array.from(random, byte => byte.toString(16).padStart(2, '0')).join('') : Date.now().toString(16)
  return `voice-${suffix}`
}
