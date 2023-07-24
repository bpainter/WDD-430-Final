# Blog Application

This is a simple blog application built with Node.js, Express, and MongoDB on the backend, and Angular on the frontend. Users can create, update, and delete blog posts. Each post includes a title, content, and an image. Users can also create and edit their profiles, which include a username, bio, and profile picture.

## Features

- User Authentication: Sign up, log in, and access control.
- CRUD Operations: Create, read, update, and delete blog posts.
- Image Upload: Users can upload images for their blog posts and profile picture.
- Profile Management: Users can create and edit their profiles.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB
- Angular CLI

### Installation

1. Clone the repository: `git clone https://github.com/yourusername/blog-app.git`
2. Install Node.js dependencies: `npm install`
3. Navigate to the `front-end` directory and install Angular dependencies: `npm install`
4. Create your MongoDB database update the MongoDB URL in `backend/db/db.js`
4. Start the backend server: `npm run start:server`
6. Start the frontend server: `ng serve`
7. Open your browser and navigate to `http://localhost:4200`.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [Angular](https://angular.io/) - Frontend framework
- [SCSS](https://sass-lang.com/) - CSS preprocessor

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
