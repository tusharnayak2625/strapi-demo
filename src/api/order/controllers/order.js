"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController('api::order.order');

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const products = ctx.request.body.data.products;
    const response = await super.create(ctx);
    products.forEach(async (product)=> {
      const slug = product.productId;
      try {
        const myproduct = await strapi.entityService.findMany('api::product.product', {
          fields: ['qty','id'],
          filters: {slug: slug}
        })
  
        await strapi.entityService.update("api::product.product", myproduct[0].id, {
          data: {
            qty: myproduct[0].qty - 1
          },
        });
      } catch (error) {
        console.log("error: ",error.message)
      }

    })

    return response;
  },

  async find(ctx) {
    ctx.query = { ...ctx.query, local: "en" };

    const { data, meta } = await super.find(ctx);

    meta.date = Date.now();

    return { data, meta };
  },
}));
