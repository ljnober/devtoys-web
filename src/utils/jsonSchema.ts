// JSON Schema 常用关键字校验（type / required / properties / items / enum / pattern / minimum / maximum）。
// Draft-07 全量关键字（$ref、oneOf、format 等）留 P1；零新增依赖、纯函数。

/** 单条校验问题。 */
export interface SchemaIssue {
  /** 问题所在的数据路径，如 $.user.name */
  path: string
  /** 中文问题描述 */
  message: string
}

/** 校验汇总结果。 */
export interface SchemaValidationResult {
  valid: boolean
  issues: SchemaIssue[]
}

/** 支持的 schema 对象类型。 */
type SchemaObject = Record<string, unknown>

/**
 * 按 Schema 校验 JSON 数据。
 * @param data 待校验的 JSON 值
 * @param schema JSON Schema（对象或布尔值）
 */
export function validateJsonSchema(data: unknown, schema: unknown): SchemaValidationResult {
  const issues: SchemaIssue[] = []
  validateNode(data, schema, '$', issues)
  return { valid: issues.length === 0, issues }
}

/** 递归校验单个节点。 */
function validateNode(value: unknown, schema: unknown, path: string, issues: SchemaIssue[]): void {
  if (schema === true || schema === undefined) {
    return
  }
  if (schema === false) {
    issues.push({ path, message: '该位置不允许任何值' })
    return
  }
  if (!isRecord(schema)) {
    issues.push({ path, message: 'Schema 必须是对象或布尔值' })
    return
  }
  if (issues.length >= 500) {
    return
  }

  checkType(value, schema.type, path, issues)
  checkEnum(value, schema, path, issues)
  checkString(value, schema, path, issues)
  checkNumber(value, schema, path, issues)
  checkArray(value, schema, path, issues)
  checkObject(value, schema, path, issues)
}

/** type 关键字：支持单个类型与类型数组。 */
function checkType(value: unknown, type: unknown, path: string, issues: SchemaIssue[]): void {
  if (type === undefined) {
    return
  }
  const expected = Array.isArray(type) ? type : [type]
  if (expected.some(item => typeof item === 'string' && matchesType(value, item))) {
    return
  }
  issues.push({
    path,
    message: `类型不匹配：期望 ${expected.map(String).join(' 或 ')}，实际为 ${actualType(value)}`
  })
}

/** 判断单个值是否匹配 JSON Schema 类型名。 */
function matchesType(value: unknown, type: string): boolean {
  switch (type) {
    case 'null': return value === null
    case 'array': return Array.isArray(value)
    case 'object': return isRecord(value)
    case 'integer': return typeof value === 'number' && Number.isInteger(value)
    case 'number': return typeof value === 'number' && Number.isFinite(value)
    case 'string': return typeof value === 'string'
    case 'boolean': return typeof value === 'boolean'
    default: return false
  }
}

/** 中文类型名，便于阅读错误信息。 */
function actualType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number'
  return typeof value
}

/** enum / const 关键字。 */
function checkEnum(value: unknown, schema: SchemaObject, path: string, issues: SchemaIssue[]): void {
  if (Array.isArray(schema.enum)) {
    const allowed = schema.enum.some(item => Object.is(item, value))
    if (!allowed) {
      issues.push({ path, message: '值不在 enum 允许的范围内' })
    }
  }
  if (Object.prototype.hasOwnProperty.call(schema, 'const') && !Object.is(schema.const, value)) {
    issues.push({ path, message: `值必须等于 ${JSON.stringify(schema.const)}` })
  }
}

/** pattern / minLength / maxLength 关键字。 */
function checkString(value: unknown, schema: SchemaObject, path: string, issues: SchemaIssue[]): void {
  if (typeof value !== 'string') {
    return
  }
  if (typeof schema.pattern === 'string') {
    try {
      if (!new RegExp(schema.pattern).test(value)) {
        issues.push({ path, message: `字符串不匹配正则表达式 ${schema.pattern}` })
      }
    } catch {
      issues.push({ path, message: `Schema 中的 pattern 不是合法正则：${schema.pattern}` })
    }
  }
  if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
    issues.push({ path, message: `字符串长度不能小于 ${schema.minLength}` })
  }
  if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
    issues.push({ path, message: `字符串长度不能大于 ${schema.maxLength}` })
  }
}

/** minimum / maximum / exclusiveMinimum / exclusiveMaximum 关键字。 */
function checkNumber(value: unknown, schema: SchemaObject, path: string, issues: SchemaIssue[]): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return
  }
  if (typeof schema.minimum === 'number' && value < schema.minimum) {
    issues.push({ path, message: `数值不能小于 ${schema.minimum}` })
  }
  if (typeof schema.maximum === 'number' && value > schema.maximum) {
    issues.push({ path, message: `数值不能大于 ${schema.maximum}` })
  }
  if (typeof schema.exclusiveMinimum === 'number' && value <= schema.exclusiveMinimum) {
    issues.push({ path, message: `数值必须大于 ${schema.exclusiveMinimum}` })
  }
  if (typeof schema.exclusiveMaximum === 'number' && value >= schema.exclusiveMaximum) {
    issues.push({ path, message: `数值必须小于 ${schema.exclusiveMaximum}` })
  }
}

/** items / minItems / maxItems 关键字。 */
function checkArray(value: unknown, schema: SchemaObject, path: string, issues: SchemaIssue[]): void {
  if (!Array.isArray(value)) {
    return
  }
  if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
    issues.push({ path, message: `数组元素数不能小于 ${schema.minItems}` })
  }
  if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
    issues.push({ path, message: `数组元素数不能大于 ${schema.maxItems}` })
  }
  if (schema.items !== undefined && typeof schema.items === 'object' && schema.items !== null) {
    value.forEach((item, index) => validateNode(item, schema.items, `${path}[${index}]`, issues))
  }
}

/** required / properties / additionalProperties:false 关键字。 */
function checkObject(value: unknown, schema: SchemaObject, path: string, issues: SchemaIssue[]): void {
  if (!isRecord(value)) {
    return
  }
  if (Array.isArray(schema.required)) {
    schema.required.forEach(key => {
      if (typeof key === 'string' && !Object.prototype.hasOwnProperty.call(value, key)) {
        issues.push({ path, message: `缺少必填字段 ${key}` })
      }
    })
  }
  const properties = schema.properties
  if (isRecord(properties)) {
    Object.keys(properties).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        validateNode(value[key], properties[key], appendPath(path, key), issues)
      }
    })
  }
  if (schema.additionalProperties === false && isRecord(properties)) {
    Object.keys(value).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        issues.push({ path: appendPath(path, key), message: `不允许的额外字段 ${key}` })
      }
    })
  }
}

/** 拼接属性路径。 */
function appendPath(path: string, key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${path}.${key}` : `${path}['${key}']`
}

/** 判断是否为普通对象。 */
function isRecord(value: unknown): value is SchemaObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
