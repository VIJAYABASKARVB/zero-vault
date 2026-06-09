function getPasswordStrength(password) {
  let score = 0

  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 20

  let label, color, width
  if (score <= 33) {
    label = 'Weak'
    color = 'bg-red-500'
    width = 'w-1/3'
  } else if (score <= 66) {
    label = 'Medium'
    color = 'bg-yellow-500'
    width = 'w-2/3'
  } else {
    label = 'Strong'
    color = 'bg-[#008B1E]'
    width = 'w-full'
  }

  return { score, label, color, width }
}

export default getPasswordStrength