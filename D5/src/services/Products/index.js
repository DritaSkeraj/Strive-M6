const express = require("express");
const router = express.Router();
const ProductsModel = require("./schema");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");

router.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const _id = await newProduct.save();
    res.status(201).send({ id: _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ProductsModel.countDocuments(query.criteria);
    const products = await ProductsModel.find(
      query.criteria,
      query.options.fields
    )
      .populate("reviews") 
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit);

    res.status(200).send({ links: query.links("/products", total), products });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
    try {
      const product = await ProductsModel.findById(req.params.id).populate(
        "reviews"
      ); 
      res.status(200).send({ product });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const product = await ProductsModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      if (product) res.status(200).send({ product });
      else {
        const error = new Error(`product with id ${req.params.id} not found`);
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const product = await ProductsModel.findByIdAndDelete(req.params.id);
      if (product) {
        res.status(200).send({ product });
      } else {
        const error = new Error(`User ${req.params.id} not found`);
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

module.exports = router;
