# Identity Service

Manages user identity

## Stream Categories

|         |                    |
| ------- | ------------------ |
| entity  | `identity`         |
| command | `identity:command` |


## Commands

### Register
   
Instruction to register a user that originates from users at large. When successful, a Registered event will be written. When unsuccessful, a RegistrationFailed event will be written.

Data:

* `userid` - The id for registering the user
* `email` - The user's email address
* `passwordHash` - A hash of the user's password, hashed with bcrypt

Example:

    {
        "id": "aea45ea1-bdcd-4cce-b610-931a66e67765",
        "type": "Register",
        "metadata": {
            "traceId": "3299292-2378-1341-3312-3234-414aacaef",
            "userId": "e90647af-8103-4fe9-ae1f-4766103cca54"
        },
        "data": {
            "userId": "e90647af-8103-4fe9-ae1f-4766103cca54",
            "email": "user@example.com",
            "passwordHash": "$2b$10$IrxFcWAxwRQGcNbK5Zr03.aLvgFGSUSdeUGw86ONXoz3Nm.PUlycS",
        }
    }

### SendEmail
Instruction to send a registration email. When successful, a RegistrationEmailSent event will be written. When unsuccessful,  

## Events

### Registered

Signals that a user at large has registered for the site.


Data:

* `userId` - The id for the registered user
* `email` - The user's email address
* `passwordHash` - A hash of the user's password, hashed using `bcrypt`

Example:

```
{
  "type": "Registered",
  "metadata": {
    "traceId": "3299292-2378-1341-3312-3234-414aacaef",
    "userId": "e90647af-8103-4fe9-ae1f-4766103cca54"
  },
  "data": {
    "userId": "e90647af-8103-4fe9-ae1f-4766103cca54",
    "email": "user@example.com",
    "passwordHash": "$2b$10$IrxFcWAxwRQGcNbK5Zr03.aLvgFGSUSdeUGw86ONXoz3Nm.PUlycS",
  }
}
```

### RegistrationEmailSent

It is not this service that sends the emails.  That is delegated to the `send-email` service.  But, we want all state pertaining to the registration process in this service's streams.

So, when `send-email` has finished sending the registration email, we write this event into our own stream so that we capture that bit of state in our streams.

Data:

* `userId` - The id of the user receiving the email
* `emailId` - The id of the email that was sent

Example:

```
{
  "id": "2ea97206-10a4-46ac-aa4a-ba48e0cdd450",
  "type": "RegistrationEmailSent",
  "metadata": {
    "originStreamName": "identity-c7957e7e-6053-4705-96aa-7f5aed810e55",
    "traceId": "3299292-2378-1341-3312-3234-414aacaef",
    "userId": "e90647af-8103-4fe9-ae1f-4766103cca54"
  },
  "data": {
    "userId": "e0c6e804-ae9e-4c9c-bd55-b0c049a03993",
    "emailId": "e31ecf6f-8eb2-4b75-aafb-dd715d4b2f3d",
    "to": "dest@gmail.com",
    "from": "ctex@gmail.com",
    "text": "Welcome to ctex",
    "html": "<h1>Welcome to ctex</h1>"
  }
}
```

### RegistrationRejected

Signals that a user's attempt to register ran afoul of our rules around registration.

Data:

* `userId` - The id for the registering user
* `email` - The user's email address
* `passwordHash` - A hash of the user's password, hashed using `bcrypt`
* `reason` - The reason why the registration failed.

Example:

```
{
  "type": "RegistrationRejected",
  "data": {
    "userId": "e90647af-8103-4fe9-ae1f-4766103cca54",
    "email": "not an email",
    "passwordHash": "$2b$10$IrxFcWAxwRQGcNbK5Zr03.aLvgFGSUSdeUGw86ONXoz3Nm.PUlycS",
    "reason": "email was not valid"
  }
}
```