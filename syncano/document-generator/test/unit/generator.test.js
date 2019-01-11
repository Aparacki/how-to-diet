import {run} from '@syncano/test'

describe('Generate html from moustache markup and specified data', () => {
  it('Should generate template', async () => {

    const args = {
      template: '**{{name}}**',
      data: {name: "Jhon Doe"},
    }

    const result = await run('generator', {args})
    console.log(result)
    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'text/html')
    expect(result).toHaveProperty('data', '<p><strong>Jhon Doe</strong></p>\n')
  })

  it('Should throw error', async () => {

    const args = {
      template: null,
      data: {name: 'Jhon Doe'},
    }

    const result = await run('generator', {args})
    expect(result).toHaveProperty('code', 400)
  })
})

