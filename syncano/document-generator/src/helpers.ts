import cheerio from 'cheerio'

const helpers = {
  isYesChecked: () => {
    return (variable, render) => {
      return render(variable).toLowerCase() === 'no'
        ? false
        : render(variable).toLowerCase() === 'yes'
          ? 'checked'
          : render(variable) ? 'checked' : false
    }
  },
  isNoChecked: () => {
    return (variable, render) => {
      return render(variable).toLowerCase() === 'yes'
        ? false
        : render(variable).toLowerCase() === 'no'
          ? 'checked'
          : render(variable) ? false : 'checked'
    }
  },
  isChecked: () => {
    return (inputString, render) => {
      const $ = cheerio.load(inputString)
      const data = render($('input').data('set'))
      const inputValue = $('input').val()

      if (data.includes(inputValue)) {
        $('input').attr('checked', 'checked')
      }

      return $.html()
    }
  },
  toLocaleDateString: () => {
    const month = this.getMonth() + 1

    return `${this.getDate()}.${month < 10 ? `0${month}` : month}.${this.getFullYear()}`
  },

  currentDate: new Date().toLocaleDateString(),
}

export default helpers
