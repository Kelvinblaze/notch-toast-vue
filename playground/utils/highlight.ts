const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function shell(code: string) {
  return code
    .split('\n')
    .map((line) => {
      const [body, ...rest] = line.split(/(\s#\s.*)$/)
      const comment = rest[0] ? `<span class="tk-c">${esc(rest[0])}</span>` : ''
      const html = body
        .split(/(\s+)/)
        .map((tok, i, all) => {
          if (!tok.trim()) return tok
          const first = all.findIndex((t) => t.trim()) === i
          if (first) return `<span class="tk-cmd">${esc(tok)}</span>`
          if (tok.startsWith('--') || tok.startsWith('-')) return `<span class="tk-flag">${esc(tok)}</span>`
          return `<span class="tk-arg">${esc(tok)}</span>`
        })
        .join('')
      return html + comment
    })
    .join('\n')
}

const CODE_RE =
  /(\/\/.*)|("[^"\n]*"|'[^'\n]*')|(&lt;\/?[A-Za-z][\w.-]*)|(\b[\w-]+)(?==)|(\b[a-zA-Z_]\w*)(?=:)|(\b\d[\d_.]*\b|\btrue\b|\bfalse\b)|(\b(?:import|from|export|const|await|async|new|type|default)\b)/g

function code(src: string) {
  return esc(src).replace(CODE_RE, (m, c, s, tag, attr, key, num, kw) => {
    if (c) return `<span class="tk-c">${c}</span>`
    if (s) return `<span class="tk-arg">${s}</span>`
    if (tag) return `<span class="tk-tag">${tag}</span>`
    if (attr || key) return `<span class="tk-key">${attr || key}</span>`
    if (num) return `<span class="tk-num">${num}</span>`
    if (kw) return `<span class="tk-kw">${kw}</span>`
    return m
  })
}

export function highlight(src: string, lang: 'sh' | 'ts' | 'vue' = 'ts') {
  return lang === 'sh' ? shell(src) : code(src)
}
