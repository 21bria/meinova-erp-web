export function pascalCase(str) {
  return str
    .split(/[-_\s]/g)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

export function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

export function camelCase(str) {
  const value = pascalCase(str)
  return value.charAt(0).toLowerCase() + value.slice(1)
}

export function snakeCase(str) {
  return kebabCase(str).replace(/-/g, "_")
}