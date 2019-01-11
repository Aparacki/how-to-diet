import {UI} from '@shared/config'
import {observer} from 'mobx-react'
import * as React from 'react'

@observer
class DocumentThankYou extends React.Component {
  render() {
    return (
      <div className="View">
        <h1 className="u-mb text-centered">
          Thank you for signing the document!
        </h1>
        <style jsx>{`
          .View {
            margin: 0 auto;
            margin-right: auto;
            max-width: 480px;
            padding: ${UI.spacing} 0;
            height: calc(100vh - 60px);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }
}

export default DocumentThankYou
