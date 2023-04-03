const { customHandlerError } = require("../errors/custom-error");
const asyncWrapper = require("../middlewares/async");
const Product = require("../models/product");
const getAllProduct = asyncWrapper(async (req, res) => {
  const search = "15";
  const { featured, company, name, sort,fields,numericFilters} = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: search, $options: "i" };
  }
  if(numericFilters){
    const operatorsMap = {
        '<':'$lt',
        '<=':'$lte',
        '=':'$eq',
        '>':'$gt',
        '>=':'$gte'
    }
    const regex = /\b(>|<|>=|<=|=)\b/g
    let filters = numericFilters.replace(regex,(match)=> `-${operatorsMap[match]}-`)
    const options = ['price','rating']
    filters = filters.split(',').forEach(item => {
        const [field,operator,value] = item.split('-')
        if(options.includes(field)){
            queryObject[field]={[operator]:Number(value)}
        }
    });
  }
  console.log(queryObject);
  let result = Product.find(queryObject);
  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    console.log(sortList);
    result = result.sort(sortList);
  }else{
    result = result.sort('createdAt')
  }
  //fields
  if(fields){
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1)*limit;
  const products = await result.skip(skip).limit(limit);
  res.status(200).json({ products, count: products.length });
});
const getOne = asyncWrapper(async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID });
  if (!product) {
    return next(
      customHandlerError(`The product with id:${productID} is not existed`, 404)
    );
  }
  res.status(200).json({ product });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      customHandlerError(`The product with id:${productID} is not existed`, 404)
    );
  }
  res.status(200).json({ product });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndDelete({ _id: productID });
  if (!product) {
    return next(
      customHandlerError(`The product with id:${productID} is not existed`, 404)
    );
  }
  res.status(200).json({ product });
});

module.exports = {
  getAllProduct,
  getOne,
  createProduct,
  updateProduct,
  deleteProduct,
};
