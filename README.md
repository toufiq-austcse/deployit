
# DeployIt

A simple Render (https://render.com/) type service where users can deploy their web-services

## Dependencies
- PostgreSQL : As data storage
- RabbitMQ : To process task async
- Docker : To build and run the deployment images

## Screenshots
Some screenshots of the application.
![Index Page](https://i.imgur.com/WQYpktP.png)
*Index page*
## Run Locally

In progress...


## API Reference

#### SignUp

```http
POST /api/v1/auth/signup
```

```
{
  "email": "string",
  "name": "string",
  "password": "string"
}
```
Response `201`
```
{
  "status": 201,
  "message": null,
  "errors": [
  ],
  "data": {
    "token": {
      "access_token": "string"
    },
    "user_info": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

#### Login

```http
POST /api/v1/auth/login
```

```
{
  "email": "string",
  "password": "string"
}
```

Response `200`
```
{
  "status": 200,
  "message": null,
  "errors": [],
  "data": {
    "token": {
      "access_token": "string"
    },
    "user_info": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

#### Me
```http
GET /api/v1/auth/me
```
Header
```
{
    Authorization: {access_token}
}
```
Response `200`
```
{
  "status": 200,
  "message": null,
  "errors": [],
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### List Deployment Types
```http
GET /api/v1/deployments/type
```
Header
```
{
    Authorization: {access_token}
}
```
Response `200`
```
{
  "status": 200,
  "message": "",
  "errors": [],
  "data": [
    {
      "id": 0,
      "name": "string",
      "status": "string"
    }
  ]
}
```

#### Create Deployment
```http
POST /api/v1/deployments
```
Header
```
{
    Authorization: {access_token}
}
```
Req Body
```
{
  "deployment_type_id": 0,
  "name": "string",
  "repository_link": "string",
  "branch_name": "string",
  "root_dir": "string",
  "environment_variables": {}
}
```
Response 201
```
{
  "status": 201,
  "message": "",
  "errors": [],
  "data": {
    "id": "string",
    "deployment_type": {
      "id": "string",
      "name": "string"
    },
    "name": "string",
    "sub_domain_name": "string",
    "status": "string",
    "last_deployed_at": "string",
    "repository_link": "string",
    "branch_name": "string",
    "root_dir": "string",
    "environment_variables": {}
  }
}
```

#### GET Single Deployment
```http
GET /api/v1/deployments/{id}
```
Header
```
{
    Authorization: {access_token}
}
```
Response 200
```
{
  "status": 200,
  "message": "string",
  "errors": [],
  "data": {
    "id": "string",
    "deployment_type": {
      "id": "string",
      "name": "string"
    },
    "name": "string",
    "sub_domain_name": "string",
    "status": "string",
    "last_deployed_at": "string",
    "repository_link": "string",
    "branch_name": "string",
    "root_dir": "string",
    "environment_variables": {}
  }
}
```

#### List Deployments
```http
GET /api/v1/deployments/{id}?page={page}&limit={limit}
```
Header
```
{
    Authorization: {access_token}
}
```
Response 200
```
{
  "status": 200,
  "message": "string",
  "data": {
    "deployments": [
      {
        "id": "string",
        "deployment_type": {
          "id": "string",
          "name": "string"
        },
        "name": "string",
        "sub_domain_name": "string",
        "service_url": "string",
        "status": "string",
        "last_deployed_at": "string",
        "repository_url": "string",
        "repository_full_name": "string",
        "branch_name": "string",
        "root_dir": "string",
        "environment_variables": {}
      }
    ],
    "pagination_meta": {
      "itemCount": 0,
      "totalItems": 0,
      "itemsPerPage": 0,
      "totalPages": 0,
      "currentPage": 0
    }
  },
  "errors": []
}
```

#### Update Environment Variables
```http
GET /api/v1/deployments/{id}/environment-variables
```
Header
```
{
    Authorization: {access_token}
}
```
BODY
```
{
  "environment_variables": {}
}
```
Response 201
```
{
  "status": 201,
  "message": "string",
  "errors": [],
  "data": {}
}
```

#### Validate Github Repository
```http
GET /api/v1/repositories/validate?repository_url={repository_url}
```
Header
```
{
    Authorization: {access_token}
}
```
Response 200
```
{
  "status": 200,
  "message": "string",
  "data": {
    "repo_full_name": "string"
  },
  "errors": []
}
```