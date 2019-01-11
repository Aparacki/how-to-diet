# Syncano user Socket

Main Socket features:

* **user/register** - register user 
* **user/get** - get user profile
* **user/update-profile** - update user profile
* **user/forgot-password** - send email with recovery token
* **user/change-password** - change password for user 

Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instaneName>)

// Search for a user
const params = {
  username,
  password,
  firstName,
  lastName
}
const suggestions = await s.post('user/register', params)
```
