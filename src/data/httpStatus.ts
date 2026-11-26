// HTTP 状态码静态字典：1xx ~ 5xx，纯前端查询，零网络请求。

/** 单条状态码记录。 */
export interface HttpStatusEntry {
  code: number
  name: string
  description: string
  category: string
}

/** 完整状态码表，按 code 升序排列。 */
export const httpStatuses: readonly HttpStatusEntry[] = [
  { code: 100, name: 'Continue', description: '客户端可以继续发送请求，服务器仅收到请求头', category: '1xx 信息' },
  { code: 101, name: 'Switching Protocols', description: '服务器同意切换协议，常用于 WebSocket 握手', category: '1xx 信息' },
  { code: 102, name: 'Processing', description: '服务器已收到请求但尚未完成处理（WebDAV）', category: '1xx 信息' },
  { code: 103, name: 'Early Hints', description: '服务器提前返回响应提示，帮助浏览器预加载资源', category: '1xx 信息' },

  { code: 200, name: 'OK', description: '请求成功，响应中包含请求的资源', category: '2xx 成功' },
  { code: 201, name: 'Created', description: '请求成功并已创建新资源', category: '2xx 成功' },
  { code: 202, name: 'Accepted', description: '服务器已接受请求，但尚未完成处理', category: '2xx 成功' },
  { code: 203, name: 'Non-Authoritative Information', description: '返回的是代理服务器的副本信息', category: '2xx 成功' },
  { code: 204, name: 'No Content', description: '请求成功，但响应中没有内容', category: '2xx 成功' },
  { code: 205, name: 'Reset Content', description: '请求成功，客户端应重置当前表单或视图', category: '2xx 成功' },
  { code: 206, name: 'Partial Content', description: '服务器返回部分内容，常用于断点续传', category: '2xx 成功' },
  { code: 207, name: 'Multi-Status', description: '响应中包含多个独立操作的状态（WebDAV）', category: '2xx 成功' },
  { code: 208, name: 'Already Reported', description: '成员的状态已在前面的响应中报告过', category: '2xx 成功' },
  { code: 226, name: 'IM Used', description: '服务器已完成请求并应用了实例操作', category: '2xx 成功' },

  { code: 300, name: 'Multiple Choices', description: '资源有多个可选位置，需要客户端自行选择', category: '3xx 重定向' },
  { code: 301, name: 'Moved Permanently', description: '资源已永久移动到新位置，后续请求应使用新地址', category: '3xx 重定向' },
  { code: 302, name: 'Found', description: '资源临时位于其他位置，客户端应继续访问原地址', category: '3xx 重定向' },
  { code: 303, name: 'See Other', description: '应使用 GET 方法访问另一个地址获取响应', category: '3xx 重定向' },
  { code: 304, name: 'Not Modified', description: '资源未发生变化，客户端可使用本地缓存', category: '3xx 重定向' },
  { code: 305, name: 'Use Proxy', description: '必须通过代理访问请求的资源', category: '3xx 重定向' },
  { code: 307, name: 'Temporary Redirect', description: '临时重定向，且后续请求保持原有 HTTP 方法', category: '3xx 重定向' },
  { code: 308, name: 'Permanent Redirect', description: '永久重定向，且后续请求保持原有 HTTP 方法', category: '3xx 重定向' },

  { code: 400, name: 'Bad Request', description: '请求语法有误，服务器无法理解', category: '4xx 客户端错误' },
  { code: 401, name: 'Unauthorized', description: '请求未通过身份认证，需要提供有效凭证', category: '4xx 客户端错误' },
  { code: 402, name: 'Payment Required', description: '需要付款才能访问，目前较少使用', category: '4xx 客户端错误' },
  { code: 403, name: 'Forbidden', description: '服务器理解请求但拒绝授权访问', category: '4xx 客户端错误' },
  { code: 404, name: 'Not Found', description: '请求的资源不存在，服务器无法找到对应内容', category: '4xx 客户端错误' },
  { code: 405, name: 'Method Not Allowed', description: '请求方法不被该资源允许', category: '4xx 客户端错误' },
  { code: 406, name: 'Not Acceptable', description: '服务器无法提供客户端可接受的内容格式', category: '4xx 客户端错误' },
  { code: 407, name: 'Proxy Authentication Required', description: '需要先通过代理服务器的身份认证', category: '4xx 客户端错误' },
  { code: 408, name: 'Request Timeout', description: '客户端发送请求超时', category: '4xx 客户端错误' },
  { code: 409, name: 'Conflict', description: '请求与资源当前状态冲突', category: '4xx 客户端错误' },
  { code: 410, name: 'Gone', description: '请求的资源已被永久删除', category: '4xx 客户端错误' },
  { code: 411, name: 'Length Required', description: '服务器要求请求携带 Content-Length', category: '4xx 客户端错误' },
  { code: 412, name: 'Precondition Failed', description: '请求头中的前置条件未满足', category: '4xx 客户端错误' },
  { code: 413, name: 'Payload Too Large', description: '请求体过大，服务器拒绝处理', category: '4xx 客户端错误' },
  { code: 414, name: 'URI Too Long', description: '请求 URI 过长，服务器拒绝解析', category: '4xx 客户端错误' },
  { code: 415, name: 'Unsupported Media Type', description: '服务器不支持请求内容的媒体类型', category: '4xx 客户端错误' },
  { code: 416, name: 'Range Not Satisfiable', description: '请求的范围无法满足', category: '4xx 客户端错误' },
  { code: 417, name: 'Expectation Failed', description: '服务器无法满足 Expect 请求头的要求', category: '4xx 客户端错误' },
  { code: 418, name: "I'm a teapot", description: '服务器是茶壶，拒绝冲泡咖啡（彩蛋状态码）', category: '4xx 客户端错误' },
  { code: 421, name: 'Misdirected Request', description: '请求指向了无法响应的服务器', category: '4xx 客户端错误' },
  { code: 422, name: 'Unprocessable Entity', description: '请求格式正确但语义有误，无法通过校验', category: '4xx 客户端错误' },
  { code: 423, name: 'Locked', description: '目标资源已被锁定', category: '4xx 客户端错误' },
  { code: 424, name: 'Failed Dependency', description: '请求失败，因为所依赖的操作失败', category: '4xx 客户端错误' },
  { code: 425, name: 'Too Early', description: '服务器拒绝处理可能重放的请求', category: '4xx 客户端错误' },
  { code: 426, name: 'Upgrade Required', description: '客户端需要升级协议后才能继续', category: '4xx 客户端错误' },
  { code: 428, name: 'Precondition Required', description: '服务器要求请求携带条件请求头', category: '4xx 客户端错误' },
  { code: 429, name: 'Too Many Requests', description: '客户端在给定时间内发送请求过多', category: '4xx 客户端错误' },
  { code: 431, name: 'Request Header Fields Too Large', description: '请求头字段过大，服务器拒绝处理', category: '4xx 客户端错误' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: '因法律原因该资源不可用', category: '4xx 客户端错误' },

  { code: 500, name: 'Internal Server Error', description: '服务器内部错误，无法完成请求', category: '5xx 服务端错误' },
  { code: 501, name: 'Not Implemented', description: '服务器不支持请求所需的功能', category: '5xx 服务端错误' },
  { code: 502, name: 'Bad Gateway', description: '网关或代理服务器收到上游无效响应', category: '5xx 服务端错误' },
  { code: 503, name: 'Service Unavailable', description: '服务暂时不可用，通常因过载或维护', category: '5xx 服务端错误' },
  { code: 504, name: 'Gateway Timeout', description: '网关或代理等待上游响应超时', category: '5xx 服务端错误' },
  { code: 505, name: 'HTTP Version Not Supported', description: '服务器不支持请求使用的 HTTP 版本', category: '5xx 服务端错误' },
  { code: 506, name: 'Variant Also Negotiates', description: '服务器存在变体协商配置错误', category: '5xx 服务端错误' },
  { code: 507, name: 'Insufficient Storage', description: '服务器存储空间不足', category: '5xx 服务端错误' },
  { code: 508, name: 'Loop Detected', description: '服务器在处理请求时检测到无限循环', category: '5xx 服务端错误' },
  { code: 510, name: 'Not Extended', description: '服务器需要更多扩展才能完成请求', category: '5xx 服务端错误' },
  { code: 511, name: 'Network Authentication Required', description: '需要先完成网络认证才能访问', category: '5xx 服务端错误' }
]

/** 分类筛选标签，'全部' 表示不筛选。 */
export const HTTP_STATUS_CATEGORIES: readonly string[] = [
  '全部', '1xx 信息', '2xx 成功', '3xx 重定向', '4xx 客户端错误', '5xx 服务端错误'
]
