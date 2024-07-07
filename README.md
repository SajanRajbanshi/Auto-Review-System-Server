# Auto Review System Backend

## Introduction
Auto Review System is an web based application where user can track their social content profermance.
This one is the backend for that application.
## Prerequisite
- Your should have Node.js installed in your system.
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
