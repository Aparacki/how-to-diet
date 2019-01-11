import {Textarea} from '@shared/components'
import {Store} from '@website/types'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {RightButton} from './styled-description'

interface Props {
  store: Store
}

@inject('store')
@observer
class Description extends React.Component<Props> {
  @observable documentId: number
  private form = this.props.store.formStore.add('description', {
    description: {
      autoFocus: true,
      type: 'text',
    },
  })

  componentDidMount() {
    const document = this.props.store.documentStore.document
    this.documentId = document.id
    this.form.handleChange('description', document.description)
  }

  componentWillUnmount() {
    this.form.clear()
  }

  formSubmit = async () => {
    try {
      await this.props.store.documentStore.setDescription(this.documentId, this.form.value('description'))
      this.props.store.modal.close()
    } catch (err) {
      this.form.errors.replace({
        message: err.response.data.message,
      })
    }
  }

  render() {

    return (
      <React.Fragment>
        <Textarea
          rows={6}
          value={this.form.value('description')}
          {...this.form.field('description')}
        />
        <div className="Buttons">
          <RightButton onClick={this.props.store.modal.close}>Cancel</RightButton>
          <RightButton type="primary" onClick={this.formSubmit}>Update</RightButton>
        </div>
        <style jsx> {`
          .Buttons {
            margin-top:20px;
            text-align: right;
          }
        `}</style>
      </React.Fragment>
    )
  }
}

export {Description}
