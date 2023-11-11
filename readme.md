# Lubabalo's saas shoes API

Hello everyone, welcome to Lubabalo's SAAS shoes API. I developed these SAAS APIs to allow systems to add shoes to an existing system, to remove shoes, and allow customers to make purchases. I also added filtering functionality to give systems the ability to filter shoes based on brand, size, and color.

### Badge
[![Node.js CI](https://github.com/tommyshado/shoes-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/tommyshado/shoes-api/actions/workflows/node.js.yml)

## The Shoes API

## API endpoints

* `GET /api/shoes` - Gets all shoes
* `GET /api/shoes/brand/:brandname` - Filters by brand
* `GET /api/shoes/color/:color` - Filters by color
* `GET /api/shoes/size/:size` - Filters by size
* `GET /api/shoes/brand/:brandname/size/:size` - Filters by brand and size
* `GET /api/shoes/size/:size/color/:color` - Filters by size and color
* `GET /api/shoes/brand/:brandname/color/:color` - Filters by brand and color
* `GET /api/shoes/brand/:brandname/size/:size/color/:color` - Filters by brand, size and color
* `POST /api/shoes` - Adds new shoes
* `POST /api/shoes/shoeId/:shoeId/add` - Updates stock level

## Get all the shoes

```bash
  https://api-for-shoes.onrender.com/api/shoes
```

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/tommyshado/Lubabalo-s-system-api.git

2. Navigate into the project's folder

   ```bash
   cd Lubabalo-s-system-api

3. Install dependencies

   ```bash
   npm install

4. Run the server

   ```bash
   npm start

## Technologies

* Langauge: Javascript
* Framework: Express.js
* Runtime: Node
* Database: PostgreSQL
* Testing: MochaJS and ChaiJs
* Development Methodology: TDD (Test Driven Development)

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
