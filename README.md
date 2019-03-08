# Software engineering Assignments - nhom-10

##### Use ip address: 13.229.130.250:6969

## Groups user
#### GET /admin/groups/[status]/[sort_field]/[sort_type]
  Example: http://13.229.130.250:6969/admin/groups/active/name/asc

  Response body:
```
    {
      "created": {
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": "2019-03-01T04:15:15.994Z"
      },
      "modified": {
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": "2019-03-01T08:34:05.434Z"
      },
      "_id": "5c750cb195033604111f2c06",
      "name": "admin",
      "ordering": 1,
      "status": "active",
      "content": "<p>admin</p>\n",
      "group_acp": "yes"
    }
 ```
#### PUT /admin/groups/change-status/[id]
   Example: http://13.229.130.250:6969/admin/groups/change-status/5c750cb195033604111f2c06
   
   Request body:
   
```
  {
    "modified": {
      "time": 1552047202907
      "user_id": "5c750dbd95033604111f2c08"
      "user_name": "phihoan2201"
    },
    "status": "active"
  }
```
#### PUT /admin/groups/change-status
   Example: http://13.229.130.250:6969/admin/groups/change-status
   
   Request body:
   
```
  {
    "modified": {
      "time": 1552047202907
      "user_id": "5c750dbd95033604111f2c08"
      "user_name": "phihoan2201"
    },
    "items": [
      "5c750cb195033604111f2c06",
      "5c78bdd3cfab8c18e3415ebe",
      "5c750d2295033604111f2c07"
    ],
    "status": "active"
  }
```
#### PUT /admin/groups/change-group_acp/[id]
   Example: http://13.229.130.250:6969/admin/groups/change-group_acp/5c750cb195033604111f2c06
   
   Request body:
   
```
  {
    "modified": {
      "time": 1552047202907
      "user_id": "5c750dbd95033604111f2c08"
      "user_name": "phihoan2201"
    },
    "group_acp": "yes"
  }
```
#### PUT /admin/groups/change-group_acp
   Example: http://13.229.130.250:6969/admin/groups/change-group_acp
   
   Request body:
   
```
  {
    "modified": {
      "time": 1552047202907
      "user_id": "5c750dbd95033604111f2c08"
      "user_name": "phihoan2201"
    },
     "items": [
      "5c750cb195033604111f2c06",
      "5c78bdd3cfab8c18e3415ebe",
      "5c750d2295033604111f2c07"
    ],
    "group_acp": "yes"
  }
```
#### PUSH(Add) /admin/groups
   Example: http://13.229.130.250:6969/admin/groups
   
   Request body:
   
```
  { 
    "name": "test add",
    "ordering": 1,
    "status": "active",
    "content": "<p>test add</p>\n",
    "group_acp": "yes",
    "id": "",
    "modified":{ 
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": 1552047847320 
      },
    "created":{ 
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": 1552047847320 
      } 
  }
```
* 200 - OK
* 400 - Bad Request
* 500 - Internal Server Error

#### PUSH(Edit) /admin/groups
   Example: http://13.229.130.250:6969/admin/groups
   
   Request body:
   
```
  { 
    "name": "test edit",
    "ordering": 1,
    "status": "active",
    "content": "<p>test add</p>\n",
    "group_acp": "yes",
    "id": "5c750dbd95033604111f2c08",
    "modified":{ 
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": 1552047847320 
      },
    "created":{ 
        "user_id": "5c750dbd95033604111f2c08",
        "user_name": "phihoan2201",
        "time": 1552047847320 
      } 
  }
```
* 200 - OK
* 400 - Bad Request
* 500 - Internal Server Error
#### DELETE /admin.groups/[id]
  http://13.229.130.250:6969/admin/groups/5c750cb195033604111f2c06
#### DELETE /admin.groups
  http://13.229.130.250:6969/admin/groups
  
  Request body:
```
  {
    "items": [
      "5c750cb195033604111f2c06",
      "5c78bdd3cfab8c18e3415ebe",
      "5c750d2295033604111f2c07"
    ]
  }
```
  
  
