# QA-Concourse-Backend

To Deploy:

-Open a command window in root Git directory and run:

```
npm install
```

-Create a file in root Git directory named .env and save it with the following contents:

```
REACT_APP_AWS_IP=<YOUR_IP_HERE>
REACT_APP_DATABASE_IP=<YOUR_DATABASE_IP_HERE>
PREMADE_ADMIN={"role":"admin","email":"adamadmin@qa.com","password":"adam","fname":"Main","lname":"Admin","status":"Active"}
PREMADE_SETTINGS={"pay_bank_holidays": "false", "default_bursary": "30"}
SYSTEM_EMAIL=<YOUR_EMAIL_ADDRESS_HERE>
SYSTEM_PASSWORD=<YOUR_EMAIL_PASSWORD_HERE>
```
The IP addresses can be localhost for a local deployment. Please use a Gmail account for the email

-Run:

```
node server.js
```
