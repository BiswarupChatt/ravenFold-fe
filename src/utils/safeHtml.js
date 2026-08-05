const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'DIV',
  'EM',
  'H1',
  'H2',
  'H3',
  'I',
  'LI',
  'OL',
  'P',
  'SPAN',
  'STRONG',
  'U',
  'UL',
])

const ALIGNMENT_CLASSES = new Set([
  'align-left',
  'align-center',
  'align-right',
  'align-justify',
])

const safeUrl = (url = '') => {
  const href = String(url || '').trim()

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
    return href
  }

  return ''
}

const normalizeClassName = (className = '') => (
  String(className)
    .split(/\s+/)
    .filter((item) => ALIGNMENT_CLASSES.has(item))
    .join(' ')
)

const sanitizeNode = (node, documentRef) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return documentRef.createTextNode(node.textContent || '')
  }

  if (node.nodeType !== Node.ELEMENT_NODE || !ALLOWED_TAGS.has(node.tagName)) {
    const fragment = documentRef.createDocumentFragment()

    Array.from(node.childNodes || []).forEach((child) => {
      fragment.appendChild(sanitizeNode(child, documentRef))
    })

    return fragment
  }

  const output = documentRef.createElement(node.tagName.toLowerCase())

  if (node.tagName === 'A') {
    const href = safeUrl(node.getAttribute('href'))

    if (href) {
      output.setAttribute('href', href)

      if (/^https?:\/\//i.test(href)) {
        output.setAttribute('target', '_blank')
        output.setAttribute('rel', 'noopener noreferrer')
      }
    }
  }

  const className = normalizeClassName(node.getAttribute('class'))

  if (className) {
    output.setAttribute('class', className)
  }

  Array.from(node.childNodes).forEach((child) => {
    output.appendChild(sanitizeNode(child, documentRef))
  })

  return output
}

export const sanitizeHtmlForRender = (html = '') => {
  const parser = new DOMParser()
  const parsedDocument = parser.parseFromString(String(html || ''), 'text/html')
  const outputDocument = document.implementation.createHTMLDocument('')
  const container = outputDocument.createElement('div')

  Array.from(parsedDocument.body.childNodes).forEach((node) => {
    container.appendChild(sanitizeNode(node, outputDocument))
  })

  return container.innerHTML
}

export const extractPlainTextFromHtml = (html = '') => {
  const parser = new DOMParser()
  const parsedDocument = parser.parseFromString(String(html || ''), 'text/html')

  return (parsedDocument.body.textContent || '').replace(/\s+/g, ' ').trim()
}
