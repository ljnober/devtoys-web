// 语音模型目录：单一配置源，供模型选择组件与推理运行时共用。
// 新增模型只需在此追加一项，不要把地址散落在组件或 Worker 里。
export interface TtsModelDefinition {
  id: string
  name: string
  description: string
  repoId: string
  onnxFile: string
  revision?: string
  supportsCloning: boolean
  credit?: string
  sizeLabel: string
}

const ZS_V1_REVISION = '3620ed788667cb76f08bd6cf2db8152c1f4c8bd1'

export const ttsModels: TtsModelDefinition[] = [
  {
    id: 'zs-v1',
    name: '零样本克隆 zs-v1',
    description: '支持上传音频生成角色，中英日等 6 语言',
    repoId: 'ayousanz/piper-plus-base',
    onnxFile: 'releases/zs-v1/base.onnx',
    revision: ZS_V1_REVISION,
    supportsCloning: true,
    sizeLabel: '40.8 MB'
  },
  {
    id: 'tsukuyomi',
    name: '月读酱 6 语言',
    description: '固定女声，适合日语与中文朗读，不支持克隆',
    repoId: 'ayousanz/piper-plus-tsukuyomi-chan',
    onnxFile: 'tsukuyomi-chan-6lang-fp16.onnx',
    supportsCloning: false,
    credit: 'Piper Plus:つくよみちゃん',
    sizeLabel: '39.7 MB'
  },
  {
    id: 'css10',
    name: 'CSS10 6 语言',
    description: '固定音色，偏清晰平稳，不支持克隆',
    repoId: 'ayousanz/piper-plus-css10-ja-6lang',
    onnxFile: 'css10-ja-6lang-fp16.onnx',
    supportsCloning: false,
    sizeLabel: '39.7 MB'
  }
]

export function getTtsModel(id: string): TtsModelDefinition | undefined {
  return ttsModels.find(model => model.id === id)
}
