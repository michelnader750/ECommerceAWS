#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = { account: '471112737861', region: 'us-east-1' };

const tags = {
  cost: "ECommerce",
  team: "SiecolaCode"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {tags: tags, env: env})
const productsAppStack = new ProductsAppStack(app, "ProductsApp", {tags: tags, env: env})
productsAppStack.addDependency(productsAppLayersStack)

const ecommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags, 
  env: env
})

ecommerceApiStack.addDependency(productsAppStack)