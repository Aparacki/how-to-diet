export function getFormattedDate(stringDate: string) {
  const date = new Date(stringDate)
  const month = date.getMonth() + 1

  // tslint:disable-next-line
  return `${date.getDate()}.${month < 10 ? `0${month}` : month}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
}
