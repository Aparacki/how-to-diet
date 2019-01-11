# Syncano sockets summary

## API

General purpose socket containing main logic of the application. It covers document handling, invitations and signing workflows.

### Endpoints

**document/upload**:

Allows logged in users to upload a document. Currently there is no extension checking so file of all types can be uploaded. After successful file upload new `document` entity is created in database together with initial `document_version`. The final step of this endpoint is call to `pdf2image` socket with request to generate preview images for the initial `document_version`

**document/get**:

Returns `document` by given `documentId`. Requires authentication.

**document/list**:

Returns list of `documents` for currently logged in user. Requires authentication.

**document/preview**:

Returns array of objects representing preview pages for latest version of the `document` by `documentId` or by invitation `key`. Returned urls are converted from direct paths to in-app url to ensure more control during displaying document previews. This way direct paths to the images (AWS storage) are hidden behind an endpoint. Additionally endpoint returns `document_version` status indicating current state of the previews generation: 
`processing` or `done`.

**document/preview-page**:

Returns preview image by given document `versionId` and `pageNumber`

**document/sign**:

Allows user to put a array of `signatures` on the `document`. Each signature requires to have `signatureId`, `documentId`, `pageNumber` on which signature will be placed, `positionX` and `positionY` indicating where signature will be placed, and the size of the signature represented by `width` and `height` parameters. When processing, endpoint calculates signature position based on given coordinates (top-left) and transform those coordinates to values required for PDF manipulation (bottom-left). Each signature is stored as a separate `document_signature` entry, together with IP address and USER_AGENT info. At the final step new `document_version` is created and a call to `pdf2image` socket is made to generate previews for newly created `document_version`. Endpoint requires authentication or invitation `key`. PDF manipulation is done using [HummusJS](https://github.com/galkahana/HummusJS).

**document/invite**:

Allows user to invite others to sign a document. Sends emails of defined template using `mailgun` socket. Requires authentication.

**document/unsigned-invitation-list**:

Returns list of not yet used invitations for given `documentId`. Allows to identify signatories that still needs to sign a document. Requires authentication.

**document/signature-list**:

Returns a list of signatures used to sign the document. Requires authentication.

**document/info**:

Returns an info about document by `documentId` or invitation `key`. Info includes document `id` and `name`, how many people were `invited` to sign the document, how many already `signed` and whether document was already `signedByMe` (based on currently logged in user or invitation key).

**document/get-latest-file**:

Returns PDF file of latest `document_version` for given `documentId`.

**invitation/list**:

Returns a list of documents to which currently logged in user was invited to sign. Requires authentication.

**signature/upload**:

Allows user to upload new signature image. Currently there is no extension checking so file of all types can be uploaded. Requires authentication.

**signature/list**:

Returns a list of signatures for currently logged in user. Requires authentication.

**signature/remove**:

Allows user to remove signature from the list.


**user/profile**:

Returns currently logged in user profile information. Requires authentication.

**user/update-profile**:

Allows user to update profile information such as `firstName` and `lastName`. Requires authentication.

## PDF2IMAGE

Socket responsible for converting PDF files into png images representing pages of given PDF. 

### Endpoints

**convert**:

Converts each page of given document (by `versionId`) into png image and stores this image as `document_preview` entity in the database. This endpoint uses [ImageMagick](https://www.imagemagick.org/), [GraphicsMagick](http://www.graphicsmagick.org/) and [GhostScript](https://www.ghostscript.com/) binaries to transform PDF files into png images. 

## DOCUMENT-GENERATOR

Socket based on [Syncano socket document generator](https://github.com/eyedea-io/syncano-socket-document-generator)

### Endpoints

**generate**:

Transforms given template to final html by replacing placeholders. Used to generate invitation emails.

## USER-INVITATION

Socket based on [Syncano socket user invitation](https://github.com/eyedea-io/syncano-socket-user-invitation)

## USER-AUTH

Socket installed from Registry

## MAILGUN

Socket installed from Registry