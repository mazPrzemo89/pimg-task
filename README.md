# ProgImage

ProgImage is a Node.js/TypeScript application that provides endpoints for uploading images to AWS S3 and downloading images with optional format and size modifications.

---

### Installation

Clone the repository:

``` git clone <repository-url>```

Navigate to the project directory:

``` cd ProgImage ```

Install dependencies:

``` npm install```

---

### Configuration
Before running the application, you need to configure the AWS credentials to enable uploading and downloading images from S3. Make sure you have an AWS account and the necessary access keys.

Rename the .env-example to .env file in the project's root directory and set the following environment variables:

```
AWS_ACCESS_KEY_ID=<Your AWS access key ID>
AWS_SECRET_ACCESS_KEY=<Your AWS secret access key>
AWS_S3_BUCKET_NAME=<Your bucket name>
AWS_REGION=<Your AWS region>
```

---

### Starting the application

To start the application run:

``` npm start ```

it will run in development mode.

### Building

This script will compile the TS code and write it to root/dist directory.

``` npm run build ```


### Testing

This script will use jest library to run all the unit tests found in root/test directory.

``` npm run test ```

### Linting

This script will use eslint library make sure the code is compliant with the rules set in .eslintrc.json file.

---

## Endpoints
The ProgImage application exposes the following endpoints:

### Upload Image to AWS S3

POST /uploadS3

Uploads an image file to AWS S3.

Request Body: Form-data with the following field: upload - The image file to upload.

Response: JSON object containing "imageId" of the uploaded image.

### Download Image from AWS S3

POST /download/:id

Retrieves an image from AWS S3 with optional format and size modifications.

URL Parameters:
id: The unique of the image to download.

Query Parameters:

format (optional): The desired image format one of: jpeg, webp, gif, png ,tiff.

width (optional): The desired image width in pixels.

height (optional): The desired image height in pixels.

Response: The requested image file.