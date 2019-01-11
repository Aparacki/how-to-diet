import {run} from '@syncano/test'

describe('Generate html from moustache markup and specified data', () => {
  it('Should generate template', async () => {

    const args = {
      template: '<p>{{name}}</p>',
      data: {name: "Jhon Doe"},
    }

    const result = await run('generate', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'text/html')
    expect(result).toHaveProperty('data', '<p>Jhon Doe</p>')
  })

  it('Should throw error', async () => {

    const args = {
      template: null,
      data: {name: 'Jhon Doe'},
    }

    const result = await run('generate', {args})
    expect(result).toHaveProperty('code', 400)
  })
})

