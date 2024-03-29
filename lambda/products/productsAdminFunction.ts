import { APIGatewayProxyEvent, APIGatewayProxyEventBase, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk" 
import { Product } from "./layers/productsLayer/nodejs/productRepository";

const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()
const productRepository = new ProductRepository(ddbClient, productsDdb)

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId

    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    const method = event.httpMethod

    if (event.resource === '/products') {
        console.log('POST /products')

        const product = JSON.parse(event.body!) as Product
        const productCreated = await productRepository.create(product)
        return {
            statusCode: 201,
            body: JSON.stringify(productCreated)
        }
    } else if (event.resource === "/products/{id}") {
        const productId = event.pathParameters!.id as string
        if (method === "PUT") {
            console.log(`PUT /products/${productId}`)
            return {
                statusCode: 200,
                body: `PUT /products/${productId}`
            }
        } else if (method === "DELETE") {
            console.log(`DELETE /products/${productId}`)
            return {
                statusCode: 200,
                body: `DELETE /products/${productId}`
            }
        }
    }

    return {
        statusCode: 400,
        body: "Bad request"
    }
}