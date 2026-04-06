# COMP 3133 Assignment 2

## Student Information

* Name: Viktor Grygoriev
* Student ID: 101472499
* Course: COMP 3133 - Full Stack Development II

## Project Title

Employee Management System using Angular and GraphQL

## Project Description

This project is a full stack employee management system developed for COMP 3133 Assignment 2.

The frontend is built with Angular and Bootstrap.
The backend is built with Node.js, Express, Apollo Server, GraphQL, and MongoDB Atlas.

The application allows users to sign up, log in, manage employee records, upload profile pictures, search employees by department or position, and perform full CRUD operations.

## Main Features

* User Signup with validation
* User Login with validation
* User Logout
* Session token stored in localStorage
* Display all employees in a table
* Add new employee
* View employee details
* Update employee information
* Delete employee
* Search employee by department or position
* Upload employee profile picture
* Validation and error handling
* Responsive UI using Bootstrap
* Angular Routing
* Angular Forms
* Angular Service
* Angular Pipe
* Angular Directive
* GraphQL API integration

## Technologies Used

### Frontend

* Angular
* TypeScript
* Bootstrap
* Axios

### Backend

* Node.js
* Express
* Apollo Server
* GraphQL
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs

## Project Structure

This project uses a single repository containing both frontend and backend.

* src/app/pages → UI pages
* src/app/services → Angular services
* src/app/pipes → custom pipe
* src/app/directives → custom directive
* backend → GraphQL backend server

## Deployment Links

* Frontend: https://101472499-comp3133-assignment2.vercel.app/login
* Backend: https://one01472499-comp3133-assignment2.onrender.com/graphql

## GitHub Repository

https://github.com/LynxGVA/101472499_comp3133_assignment2

## Application Screens

* Login
* Signup
* Employee List
* Add Employee
* View Employee Details
* Update Employee
* Search Results

## Validation and Error Handling

The application includes validation and error handling for:

* required fields
* invalid email format
* password validation
* backend GraphQL errors
* employee form validation messages
* image upload size handling

## How to Run Locally

### Frontend

npm install
ng serve

### Backend

cd backend
npm install
npm start

## Backend Environment Variables

Create a `.env` file inside the backend folder and add:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## Notes

* The frontend connects to the deployed backend GraphQL API
* MongoDB Atlas is used as the cloud database
* Render is used for backend deployment
* Vercel is used for frontend deployment

## Submission Contents

* GitHub repository link
* deployed frontend link
* deployed backend link
* screenshots PDF
* ZIP file without node_modules

## Author

Viktor Grygoriev
