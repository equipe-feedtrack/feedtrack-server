import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swaggerDef';

const specs = swaggerJsdoc(swaggerDefinition);

export { swaggerUi, specs };
