const pluralize = (i, str) => i > 1 ? str + 's' : str

// Gives a human-readable string representing the amount
// of time between the date d and now, for example:
// '4 seconds ago'
// '24 minutes ago'
// '1 year go'
// If d was 1 day ago, it will return 'Yesterday'
export const formatModifiedDate = d => {
  const date = new Date(d)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.round(diff / 1000)
  if (seconds < 10) return `Just now`
  if (seconds < 60) return `${seconds} ${pluralize(seconds, 'second')} ago`

  const minutes = Math.round(diff / (1000 * 60))
  if (minutes < 60) return `${minutes} ${pluralize(minutes, 'minute')} ago`

  const hours = Math.round(diff / (1000 * 3600))
  if (hours < 24) return `${hours} ${pluralize(hours, 'hour')} ago`

  const days = Math.round(diff / (1000 * 3600 * 24))
  if (days === 1) return `Yesterday`
  if (days < 31) return `${days} ${pluralize(days, 'day')} ago`

  const months = Math.round(diff / (1000 * 3600 * 24 * 30))
  if (months <= 12) return `${months} ${pluralize(months, 'months')} ago`

  const years = Math.round(diff / (1000 * 3600 * 24 * 30 * 12))
  return `${years} ${pluralize(years, 'years')} ago`
}

