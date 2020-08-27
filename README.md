# node-js-api-massive-js
Basic API with NodeJS: sessions, JSON Web Token (JWT), routes & pagination.

Used database: [link](https://github.com/edgarMejia/node-js-api-massive-js/blob/master/db/db_query.sql)

## Authentication

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Login | POST | `BASE_URL`/api/auth/login |
| Logout | GET | `BASE_URL`/api/auth/logout **(session required)** |

### Login form

- `txtUsername` required
- `txtPassword` required

### Login response examples

**Success JSON response:**
```json
{
    "success": true,
    "message": "Access data",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsImlkIjoxLCJpYXQiOjE1OTg1MTEwODgsImV4cCI6MTU5ODU5NzQ4OH0.C7NQ0V0aZgTSobdMhhXIddpSswlIncJtkgYVhod-tG0"
}
```

**Invalid user or password JSON response:**
```json
{
    "success": false,
    "message": "Invalid user or password",
    "token": null
}
```

## User

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Save | POST | `BASE_URL`/api/user/save **(NO session required)** |
| Get one **WIP** | GET | `BASE_URL`/api/user/:id **(session required)** |
| Get all **WIP** | GET | `BASE_URL`/api/user **(session required)** |
| Delete one **WIP** | DELETE | `BASE_URL`/api/user/delete/:id **(session required)** |

### Save user form

- `id` --> Only required when you're editing
- `user_name`
- `email`
- `password`

### Save user response example

```json
{
    "success": true,
    "message": "User saved success"
}
```

## Client
Note that all this methods are **session required** so you have to add a header in all your requests

### Headers
Note that you have to add a space between `JWT` and your auth token like the example below.

| **key** | **value** |
| ------ | ------ |
| Authorization | `JWT your_sexy_token` |

### Endpoints

| **Name** | **Type** | **URL** |
| ------ | ------ | ------ |
| Get one | GET | `BASE_URL`/api/client/`:id` **(session required)** |
| Get all | GET | `BASE_URL`/api/client **(session required)** |
| Save | POST | `BASE_URL`/api/client/save **(session required)** |
| Delete one | DELETE | `BASE_URL`/api/client/delete/`:id` **(session required)** |

### Save client form
Use x-www-form-urlencoded body

- `id` --> Only required when you're editing
- `txtFirstName `
- `txtLastName`
- `txtAge`
- `txtGender`

### Full request example with Angular 10:

```typescript
// See project in action: https://github.com/edgarMejia/Angular-CRUD/blob/master/src/app/services/client.service.ts

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Response {
    success: boolean;
    message: string;
    data?: any;
}

save(): Observable<Response> {
    let tokenGetWithLogin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsImlkIjoxLCJpYXQiOjE1OTg1MTEwODgsImV4cCI6MTU5ODU5NzQ4OH0.C7NQ0V0aZgTSobdMhhXIddpSswlIncJtkgYVhod-tG0'
    let sexyHeader = new HttpHeaders({
      'Authorization': 'JWT ' + tokenGetWithLogin
    });

    return this.http.post<Response>(
        'http://localhost:3000/api/client/save',
        {
            txtFirstName: 'Edgar',
            txtLastName: 'Mejía',
            txtAge: 25,
            txtGender: 'Male',
            id: null
        },
        {
            headers: sexyHeader
        }
    );
}
```

### Save client response example

```json
{
    "success": true,
    "message": "Save success"
}
```

### Update client response example

```json
{
    "success": true,
    "message": "Update success"
}
```

### Get all clients response example

```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "first_name": "Prueba2",
            "last_name": "Prueba3",
            "age": 25,
            "gender": "Female",
            "created_at": "2020-08-27T07:32:20.173Z",
            "updated_at": "2020-08-27T07:32:36.382Z",
            "deleted_at": null
        },
        {
            "id": 1,
            "first_name": "Prueba",
            "last_name": "Prueba2",
            "age": 23,
            "gender": "Male",
            "created_at": "2020-08-27T07:18:39.710Z",
            "updated_at": null,
            "deleted_at": null
        }
    ],
    "total": "2",
    "pageSize": 10,
    "page": 1
}
```

### Get one client response example

```json
{
    "success": true,
    "data": {
        "id": 1,
        "first_name": "Prueba",
        "last_name": "Prueba2",
        "age": 23,
        "gender": "Male",
        "created_at": "2020-08-27T07:18:39.710Z",
        "updated_at": null,
        "deleted_at": null
    }
}
```

### Delete one client response example

```json
{
    "success": true,
    "message": "Success delete client"
}
```

### Bad auth token response for all client endpoints

```
401 Unauthorized
```

## License
**The MIT License (MIT)**

Copyright © 2018 Edgar Mejía
