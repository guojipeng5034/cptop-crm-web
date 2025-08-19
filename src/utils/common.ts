import { isNumber, isString, isNull } from '@/utils/is'

const message = useMessage() // 消息弹窗

export const handleCopy = async (e) => {
  if (isNull(e)) {
    message.warning('请选择复制内容')
    return
  }
  const copyStr = isString(e) || isNumber(e) || isNull(e) ? e : e.target.innerText
  try {
    await navigator.clipboard.writeText(copyStr)
    message.success('复制成功')
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = copyStr
    textarea.style.position = 'fixed' // 避免滚动到底部
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const successful = document.execCommand('copy')
      if (successful) {
        message.success('复制成功')
      } else {
        throw new Error('复制命令失败')
      }
    } catch (err) {
      console.error('回退复制方法失败', err)
      message.warning('复制失败，请手动复制')
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

export const desensitizePhone = (phone) => {
  if (!phone) {
    return null
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const desensitizeMail = (mail) => {
  if (!mail) {
    return null
  }
  const emailArray = mail.split('@')
  const desensitizedLocalPart = emailArray[0].replace(/^(.{3}).*(.{2})$/, '$1****$2')
  return desensitizedLocalPart + '@' + emailArray[1]
}

/* 字段转换为 JSON 对象 */
export const mapToJson = (
  mapping: { [siteId: string]: string },
  sourceData: { [fieldName: string]: number[] }
) => {
  const result: { [key: string]: string } = {}
  Object.entries(mapping).forEach(([siteId, fieldName]) => {
    if (sourceData[fieldName] && Array.isArray(sourceData[fieldName])) {
      const values = sourceData[fieldName].join(',')
      if (values) {
        result[siteId] = values
      }
    }
  })
  return result
}

/* JSON 对象转换为字段 */
export const jsonToFields = (jsonData, mapping) => {
  if (!jsonData) return
  const result = {}
  Object.entries(jsonData).forEach(([key, value]) => {
    const fieldName = mapping[key]
    if (fieldName) {
      result[fieldName] = value.split(',')
    }
  })
  return result
}

export const parseIfString = (value) => typeof value === 'string' ? JSON.parse(value) : value || []

/* 空值占位符 */
export const placeholder = (value: any, placeholder: string = '-'): string | number => {
  // 判断 value 是否为 null、undefined、空字符串
  if (!value) {
    return placeholder
  }
  return value
}

/* 延迟函数 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/* 压缩 */
export const compressImage = (file: File, quality = 0.8, maxWidth = 1000): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (event) {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = function () {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = height * (maxWidth / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        ctx?.drawImage(img, 0, 0, width, height)

        // 使用 toBlob 方法将压缩后的图像转为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          'image/jpeg',
          quality // 压缩质量
        )
      }
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}
