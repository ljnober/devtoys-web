// IP 地址纯函数：IPv4 子网位运算与 IPv6 展开/压缩，零依赖、不触碰 DOM 与网络。

/** IPv4 子网计算结果。 */
export interface Ipv4SubnetInfo {
  input: string
  address: string
  mask: string
  wildcardMask: string
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  prefix: number
  totalAddresses: number
  usableHosts: number
  isPrivate: boolean
}

/** 将 32 位无符号整数格式化为点分十进制。 */
export function formatIpv4(value: number): string {
  const normalized = value >>> 0
  return [
    (normalized >>> 24) & 0xff,
    (normalized >>> 16) & 0xff,
    (normalized >>> 8) & 0xff,
    normalized & 0xff
  ].join('.')
}

/** 解析点分十进制 IPv4，非法时返回 null。 */
export function parseIpv4(value: string): number | null {
  const parts = value.trim().split('.')
  if (parts.length !== 4) {
    return null
  }
  let result = 0
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return null
    }
    const byte = Number(part)
    if (byte > 255) {
      return null
    }
    result = ((result << 8) | byte) >>> 0
  }
  return result
}

/**
 * 计算 CIDR 子网信息。
 * @param input 如 `192.168.1.10/24` 或 `192.168.1.10/255.255.255.0`
 * @throws 输入非法时抛出中文错误
 */
export function calculateIpv4Subnet(input: string): Ipv4SubnetInfo {
  const value = input.trim()
  if (!value) {
    throw new Error('请输入 IPv4 地址或 CIDR 网段')
  }

  const pieces = value.split('/')
  if (pieces.length > 2) {
    throw new Error('CIDR 格式无效，请检查斜杠数量')
  }
  const addressValue = parseIpv4(pieces[0])
  if (addressValue === null) {
    throw new Error('IPv4 地址格式无效，示例：192.168.1.10/24')
  }

  let prefix = 32
  if (pieces.length === 2) {
    const suffix = pieces[1].trim()
    if (!suffix) {
      throw new Error('子网前缀不能为空')
    }
    if (suffix.includes('.')) {
      const maskValue = parseIpv4(suffix)
      if (maskValue === null || !isContiguousMask(maskValue)) {
        throw new Error('子网掩码无效，必须是连续的 1 后接连续的 0')
      }
      prefix = countOnes(maskValue)
    } else {
      if (!/^\d{1,2}$/.test(suffix)) {
        throw new Error('子网前缀必须是 0 到 32 之间的整数')
      }
      prefix = Number(suffix)
      if (prefix < 0 || prefix > 32) {
        throw new Error('子网前缀必须在 0 到 32 之间')
      }
    }
  }

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const wildcard = (~mask) >>> 0
  const network = (addressValue & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  const usable = prefix >= 31 ? 0 : Math.max(0, broadcast - network - 1)

  return {
    input: value,
    address: formatIpv4(addressValue),
    mask: formatIpv4(mask),
    wildcardMask: formatIpv4(wildcard),
    network: formatIpv4(network),
    broadcast: formatIpv4(broadcast),
    firstHost: prefix >= 31 ? formatIpv4(network) : formatIpv4((network + 1) >>> 0),
    lastHost: prefix >= 31 ? formatIpv4(broadcast) : formatIpv4((broadcast - 1) >>> 0),
    prefix,
    totalAddresses: 2 ** (32 - prefix),
    usableHosts: usable,
    isPrivate: isPrivateIpv4(addressValue)
  }
}

/** 子网掩码是否为连续 1 + 连续 0。 */
function isContiguousMask(value: number): boolean {
  const inverted = (~value) >>> 0
  return ((inverted + 1) & inverted) === 0
}

/** 统计掩码中 1 的位数。 */
function countOnes(value: number): number {
  let count = 0
  let current = value >>> 0
  while (current !== 0) {
    count += current & 1
    current = current >>> 1
  }
  return count
}

/** 判断是否为 RFC1918 私有地址。 */
function isPrivateIpv4(value: number): boolean {
  const a = (value >>> 24) & 0xff
  const b = (value >>> 16) & 0xff
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

/**
 * 解析 IPv6 地址为 8 个 16 位整数，支持 `::` 压缩与尾部 IPv4 映射。
 * @throws 地址非法时抛出中文错误
 */
export function parseIpv6Groups(input: string): number[] {
  let source = input.trim().replace(/^\[|\]$/g, '')
  if (!source) {
    throw new Error('请输入 IPv6 地址')
  }

  // 去掉可选的端口，如 [2001:db8::1]:443
  const zoneIndex = source.indexOf('%')
  if (zoneIndex >= 0) {
    source = source.slice(0, zoneIndex)
  }

  if (source.includes('.')) {
    const lastColon = source.lastIndexOf(':')
    const ipv4Part = source.slice(lastColon + 1)
    const ipv4Value = parseIpv4(ipv4Part)
    if (ipv4Value === null) {
      throw new Error('IPv6 地址中嵌的 IPv4 部分无效')
    }
    const high = ((ipv4Value >>> 16) & 0xffff).toString(16)
    const low = (ipv4Value & 0xffff).toString(16)
    source = `${source.slice(0, lastColon + 1)}${high}:${low}`
  }

  const doubleColonCount = source.split('::').length - 1
  if (doubleColonCount > 1) {
    throw new Error('IPv6 地址中只能出现一次 ::')
  }

  let left: string[] = []
  let right: string[] = []
  if (source.includes('::')) {
    const halves = source.split('::')
    left = halves[0] ? halves[0].split(':') : []
    right = halves[1] ? halves[1].split(':') : []
    if (left.length + right.length >= 8) {
      throw new Error('IPv6 地址段数超过 8 段')
    }
  } else {
    left = source.split(':')
  }

  const toGroups = (items: string[]): number[] => items.map(item => {
    if (!/^[0-9a-fA-F]{1,4}$/.test(item)) {
      throw new Error(`IPv6 地址段无效：${item || '(空段)'}`)
    }
    return parseInt(item, 16)
  })

  const leftGroups = toGroups(left)
  const rightGroups = toGroups(right)
  const groups = [
    ...leftGroups,
    ...new Array(8 - leftGroups.length - rightGroups.length).fill(0) as number[],
    ...rightGroups
  ]
  if (groups.length !== 8) {
    throw new Error('IPv6 地址必须是 8 段，或使用 :: 压缩')
  }
  return groups
}

/** 左侧补零到指定长度（兼容 ES2016 lib）。 */
function padLeft(value: string, length: number): string {
  return value.length >= length ? value : `${new Array(length - value.length + 1).join('0')}${value}`
}

/** 展开为完整的 8 段小写形式。 */
export function expandIpv6(input: string): string {
  return parseIpv6Groups(input).map(group => padLeft(group.toString(16), 4)).join(':')
}

/** 压缩连续的 0 段为 `::`。 */
export function compressIpv6(input: string): string {
  const groups = parseIpv6Groups(input)
  let bestStart = -1
  let bestLength = 0
  let currentStart = -1
  let currentLength = 0

  groups.forEach((group, index) => {
    if (group === 0) {
      if (currentStart < 0) {
        currentStart = index
      }
      currentLength += 1
      if (currentLength > bestLength) {
        bestLength = currentLength
        bestStart = currentStart
      }
    } else {
      currentStart = -1
      currentLength = 0
    }
  })

  if (bestLength < 2) {
    return groups.map(group => group.toString(16)).join(':')
  }
  const before = groups.slice(0, bestStart).map(group => group.toString(16)).join(':')
  const after = groups.slice(bestStart + bestLength).map(group => group.toString(16)).join(':')
  return `${before}::${after}`
}
