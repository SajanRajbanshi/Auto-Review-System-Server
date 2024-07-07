# Auto Review System Backend

## Introduction
Auto Review System is an web based application where user can track their social content profermance.
This one is the backend for that application.
## Prerequisite
- You should have Node.js installed in your system.
- NPM is required to install dependencies
- GIT has to be installed to run git commands

## How to install?
This backend is not hosted in live server. To use it, you will have to install in your local mechine and run it. Follow the following steps to install in your local.
### Clone the Repository
Go to your terminal and navigate to the folder you want to save the files in. Then,
```
git clone https://github.com/SajanRajbanshi/Auto-Review-System-Server.git
```
### Install packages
This application requires some packages to communicate with different cloud services. To install those packages,
```
npm install
```
### Run
To run the server,
```
node app.js
```
## APIs
Once you have hosted your server. There are total 6 APIs that can be accessed from client side. Here is the break down of each of them and use cases.

### API for checking server status.
This API can be used to see if the server is online.
#### URL ( Method - GET )
```
http://localhost:3000/
```
It returns a json file similer to below,
```
// If the server is active
{ status: "server is actively listening" }
```
```
// If there is any error
{ error: "something is not right" }
```
You may have to see the console for more information about the error.

### API for accessing Top positive/negative comments.
This API can be used to get top positive and negative comments.
#### URL ( Method - GET )
```
http://localhost:3000/api/data/<source>/<sentiment>/<count>
```
The above mentioned **source**, **sentiment** and **count** are place holders for their relevent options. Below are the options corresponding to these place holders.
##### source -> facebook, instagram, thread, twitter, all.
##### sentiment -> positive, negative
##### count -> number of data required
*Note: The URL are case sensitive*
#### Example URL ( Method - GET )
```
http://localhost:3000/api/data/facebook/positive/15
```
The above URL will return a json file with list of 15 top positive comments.
```
[
    {
        "_id": "6688069ee1deab39bdae9d4c",
        "message": "Happy birthday to my best friend! Happy birthday to my best friend! Happy birthday to my best friend! H",
        "sentiment": 0.9884,
        "source": "facebook",
        "date": "2023-12-23T00:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "6688069ee1deab39bdae9d5d",
        "message": "Sunshine and smiles. Sunshine and smiles. Sunshine and smiles. Sunshine and smiles. Sunshine and smiles. ",
        "sentiment": 0.9842,
        "source": "facebook",
        "date": "2023-01-23T00:00:00.000Z",
        "__v": 0
    },
  ...
]
```

### API to access all the processed Data
This API can be used to access all the sentiment processed data.
#### URL ( Method - GET )
```
http://localhost:3000/api/data/all
```
The above API will return a list of objects as below.
```
[
    {
        "_id": "6688069ee1deab39bdae9cc5",
        "message": "This smartphone has exceeded my expectations. The camera quality is superb and the battery lasts all day. Highly recommend!",
        "sentiment": 0.8012,
        "source": "facebook",
        "date": "2022-11-02T00:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "6688069ee1deab39bdae9cc6",
        "message": "Spread kindness, it's contagious. Spread kindness, it's contagious. Spread kindness, it's contagious. S",
        "sentiment": 0.4215,
        "source": "facebook",
        "date": "2021-06-15T00:00:00.000Z",
        "__v": 0
    },
  ...
]
```
*Note: This API doesn't sort the data by any parameter*

### API to access dated data ( Data for Line Graph )
This API can be used to access data that are compiled as per date. Data that can be used for Line Graph on dates. **( Unsorted )**
#### URL ( Method - GET )
```
http://localhost:3000/api/data/daily
```
The above API will return a list of objects. Example,
```
[
    {
        "date": "2024-12-31T00:00:00.000Z",
        "positive": 1,
        "negative": 0
    },
    {
        "date": "2024-12-30T00:00:00.000Z",
        "positive": 1,
        "negative": 2
    },
  ...
]
```

### API to access top content
This API can be used to access the **Top Content** of all time. 
#### URL ( Method - GET )
```
http://localhost:3000/api/data/top-content
```
The above API will return a list of object sorted in descending order on the basis of **ratio**. Example,
```
[
    {
        "_id": "668a57ede65d6038c2d744be",
        "id": 0,
        "caption": "it is the content 0",
        "comments": [
            {
                "_id": "6688069ee1deab39bdaea488",
                "message": "The financial advisor mismanaged my investments, resulting in significant losses. The financial advis",
                "sentiment": -0.2263,
                "source": "thread",
                "date": "2022-08-01T00:00:00.000Z",
                "__v": 0
            },
          ...
        ],
        "positive": 79,
        "negative": 6,
        "source": "thread",
        "ratio": 13.166666666666666,
        "__v": 0
    },
  ...
]
```

### API to Sign in
This API can be used to validate the user. This is an **POST** method.
#### URL ( Method - POST )
```
http://localhost:3000/auth/signin
```
The body of the URL should be constructed as below.
```
// Body of the request
{
    "username":"SajanRajbanshi",
    "password":"papjpmmw"
}
```
The above API returns a boolean value, *true* if user exists and *false* if user doesn't exist.
For example,
```
// If username and password matches
{
    "status": true
}
```
```
// If username or password doesn't match
{
    "status": false
}
```

### API to Sign up
This API can be used to add new user. This is also an **POST** method.
#### URL ( Method - POST )
```
http://localhost:3000/auth/signup
```
The body of the URL should be constructed as below.
```
{
    "email":"sasararasajanpersonal@gmail.com",
    "username":"SajanRajbanshi",
    "password":"papjpmmw"
}
```
The above API returns a boolean value, *true* if registration was successfull and *false* otherwise. Example,
```
// If the registration is success
{
    "status": true
}
```
```
// If the registration fails
// See console for more info
{
    "status": false
}
```






