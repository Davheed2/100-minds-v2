import swaggerJsdoc from 'swagger-jsdoc';
import { ENVIRONMENT } from './common/config';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: '100MINDS V2 Documentation',
			version: '2.0.0',
			description: 'API documentation for 100minds backend application',
		},
		servers: [
			{
				url:
					ENVIRONMENT.APP.ENV === 'production'
						? 'https://one00-minds-v2.onrender.com/api/v1'
						: `http://localhost:${ENVIRONMENT.APP.PORT || 3000}/api/v1`,
				description: ENVIRONMENT.APP.ENV === 'production' ? 'Production server' : 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
				anotherBearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'accessToken',
				},
			},
		},
	},
	apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
