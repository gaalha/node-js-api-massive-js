# PersonAPI
Basic API with NodeJS: sessions, JSON Web Token (JWT), routes & pagination.

Used database: [link](https://github.com/edgarMejia/node-js-api-massive-js/blob/master/db/db_query.sql)

## Endpoints

### Authentication

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Login | POST | `BASE_URL`/api/auth/login |
| Logout | GET | `BASE_URL`/api/auth/logout **(session required)** |

### User

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Save | POST | `BASE_URL`/api/user/save **(session required)** |

### Save user form

- `txtIdUser` --> Only required when you're editing
- `txtUsername`
- `txtPassword`

### Person

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Get one | GET | `BASE_URL`/api/person/`:id` **(session required)** |
| Get all | GET | `BASE_URL`/api/person **(session required)** |
| Save | POST | `BASE_URL`/api/person/save **(session required)** |
| Delete one | DELETE | `BASE_URL`/api/person/delete/`:id` **(session required)** |

### Save person form 

- `txtPersonId` --> Only required when you're editing
- `txtName`
- `txtAge`
- `txtGender`

## License
**The MIT License (MIT)**

Copyright © 2018 Edgar Mejía
