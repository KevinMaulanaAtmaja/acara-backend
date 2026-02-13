import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "0.0.1",
        title: "API Documentation",
        description: "API documentation for the MERN Acara project",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local server",
        },
        {
            url: "https://backend-acara-kvn.vercel.app/api",
            description: "Deploy server",
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "kevin",
                password: "kevin123",
            },
        },
    },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
