import mongoose from 'mongoose';
import csv from "csv-parser"
import {Readable} from "stream"

import Product from "../models/Products.js"

export const createProduct = async(req, res) =>
{
    try
    {
        const{name, description, price, category, quantity, published} = req.body
        if(!name || !description || !price || !category || !quantity)
        {
            return res.status(400).json({message:"All fileds are required to create a product"})
        }
        const product = await Product.create({
            name: name, 
            description: description,
            price: price, 
            category: category,
            quantity: quantity, 
            published: published

        })
        res.status(201).json({message:'Product created Successfully', product})
    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to create the product", error: error.message})

    }
}

export const getAllProducts = async(req, res) =>
{
    try
    {
        const {category, minPrice, maxPrice, sort, page =1, limit = 10} = req.query
        const query = {}
        if(req.user.role ==="user")
        {
            query.published = true
        }

        if(category)
        {
            query.category = {$regex: category, $options: "i"}
        }
        if(minPrice || maxPrice)
        {
            query.price = {}
            if(minPrice)
            {
                query.price.$gte= Number(minPrice)
            }
            if(maxPrice)
            {
                query.price.$lte= Number(maxPrice)
            }
        }

        const sortOptions = {}
        if(sort === "price_asc")
        {
            sortOptions.price = 1
        }
        else if(sort === "price_desc")
        {
            sortOptions.price = -1
        }
        else if(sort === "newest")
        {
            sortOptions.createdAt = -1;
        }

        const currentPage = Math.max(1, Number(page))
        const currentLimit = Math.max(1, Number(limit))

        const skip = (currentPage - 1) * currentLimit

         const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query).sort(sortOptions).skip(skip).limit(currentLimit)

        const totalPages = Math.ceil(totalProducts / currentLimit)

        res.status(200).json({
            products, 
            page: currentPage,
            limit: currentLimit,
            totalProducts,
            totalPages
        })

    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to get the products", error: error.message})

    }
}

export const getProductById = async(req, res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(400).json({message:'Product Id is invalid'})
        }
        if(req.user.role === "user")
        {
            return res.status(400).json({message:"You are not authorized to access this product"})
        }
        const product = await Product.findById(req.params.id)
        if(!product)
        {
            return res.status(404).json({message:"Product not found"})
        }
        res.json(product)


    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to get the product by id ", error: error.message})

    }
}


export const updateProduct  = async(req, res) =>
{
    try

    {
        const{name, description, price, category, quantity, published} = req.body
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(400).json({message:'Product Id is invalid'})
        }
        if(req.user.role === "user")
         {
            return res.status(404).json({message:'You are not authorized to access this product'})
         }
        const product = await Product.findByIdAndUpdate(req.params.id,req.body,
            {
                new: true,
                runValidators: true
            }
         )
         if(!product)
         {
            return res.status(404).json({message:"Product not found"})
         }
         if(name !== undefined)
         {
            product.name = name
         }
         if(description !== undefined)
         {
            product.description = description
         }
         if(price !== undefined)
         {
            product.price = price
         }
         if(category !== undefined)
         {
            product.category = category

         }
         if(quantity !== undefined)
         {
            product.quantity = quantity
         }
         if(published !== undefined)
         {
            product.published = published
         }

         res.json({message:"Product updated successfully", product})
    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to update the product", error: error.message})
    }
}


export const deletedProduct = async(req, res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(400).json({message:'Product Id is invalid'})
        }
        const product = await Product.findByIdAndDelete(req.params.id)
        if(req.user.role === "user")
        {
            return res.status(404).json({message:'You are not authorized to acces this product'})
        }
        if(!product) {
            return res.status(404).json({message:"Product not found"})
        }
        res.json({message:"Product deleted successfully", product})
    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to delete the product", error: error.message})
    }
}


export const publishProduct = async(req, res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(400).json({message:'Product Id is invalid'})
        }
        
        if(req.user.role === "user")
        {
            return res.status(404).json({message:'you are not authorized this product to publish'})
        }
        const product = await Product.findById(req.params.id)
        
        if(!product)
        {
            return res.status(404).json({message:'Product not found'})
        }
        product.published = true
        await product.save()
        res.json({Message:'Product is successfully published', product})

    }
    catch(error)
    {
        return res.status(500).json({message:'Unable to publish the product', error:error.message})

    }
}


export const unPublishProduct = async(req, res)=>
    {
        try{
            if(!mongoose.isValidObjectId(req.params.id))
            {
                return res.status(400).json({message:'Product Id is invalid'})
            }
            const product = await Product.findById(req.params.id)
            if(req.user.role === "user")
            {
                return res.status(404).json({mesage:'you are not authorized to access this product to unpublish'})
            }
            if(!product)
            {
                return res.status(404).json({message:'Product not found'})
            }
            product.published = false
            await product.save()

            res.json({message:'Product is unPublished', product})


        }
        catch(error)
        {
            res.status(500).json({messag:'unable to UnPublished the product'})

        }
} 

export const importProducts = async(req, res) =>
{
    try
    {
        if(!req.file)
        {
            return res.status(400).json({message:'Csv File is required'})
        }

        const products = []

        const stream = Readable.from(req.file.buffer);

        await new Promise((resolve, reject)=>
        {
            stream.pipe(csv()).on("data", (row) =>
            {
                products.push(row)
            })
            .on("end", resolve).on("error", reject)
        })

        if(products.length === 0)
        {
            return res.status(400).json({
                message:"Csv File is empty"
            })
        }

        const validProducts = []
        const errors = []

        for(let i = 0; i < products.length; i++)
        {
            const row = products[i];

            const rowNumber = i + 2;

            const name = row.name?.trim();
            const description = row.description?.trim();
            const price = Number(row.price);
            const category = row.category?.trim();
            const quantity = Number(row.quantity);
            const publishedValue = row.published?.trim().toLowerCase();

            if(!name)
            {
                errors.push(`Row ${rowNumber}: name is required`)
            }

            if(!description)
            {
                errors.push(`Row ${rowNumber}: description is required`)
            }

            if( row.price === undefined || row.price === "" || !Number.isFinite(price) || price <= 0
            )
            {
                errors.push(`Row ${rowNumber}: price must be a positive number`)
            }

            if(!category)
            {
                errors.push(`Row ${rowNumber}: category is required`)
            }

            if(row.quantity === undefined || row.quantity === "" || !Number.isInteger(quantity) || quantity < 1)
            {
                errors.push(`Row ${rowNumber}: quantity must be a positive number`)
            }

            if(publishedValue !== "true" && publishedValue !== "false")
            {
                errors.push(`Row ${rowNumber}: published must be true or false`)
            }

            if( name && description && category && Number.isFinite(price) && price > 0 && Number.isInteger(quantity) && quantity >= 1 &&(
                    publishedValue === "true" || publishedValue === "false"
                )
            )
            {
                validProducts.push({
                    name,
                    description,
                    price,
                    category,
                    quantity,
                    published: publishedValue === "true"
                })
            }
        }

        if(errors.length > 0)
        {
            return res.status(400).json({
                message:'Csv Validation Failed',
                errors
            })
        }

        const insertedProducts = await Product.insertMany(validProducts)

        res.status(201).json({
            message: "Products imported successfully",
            count: insertedProducts.length,
            products: insertedProducts
        });
    }
    catch(error)
    {
        return res.status(500).json({
            message:'Unable to import products',
            error: error.message
        })
    }
}

export const exportProducts = async(req, res) =>
{
    try
    {
        const products = await Product.find()
            .select("name description price category quantity published")
            .lean()

        const headers = [
            "name",
            "description",
            "price",
            "category",
            "quantity",
            "published"
        ]

        const escapeCSV = (value) =>
        {
            if(value === null || value === undefined)
            {
                return ""
            }

            const stringValue = String(value);

            if(
                stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")
            )
            {
                return `${stringValue.replace(/"/g, '""')}`
            }

            return stringValue;
        }

        const csvRows = []

        csvRows.push(headers.join(","))

        for(const product of products)
        {
            const row = headers.map((header) =>
            {
                return escapeCSV(product[header]);
            });

            csvRows.push(row.join(","))
        }

        const csvData = csvRows.join("\n")

        res.setHeader("Content-Type", "text/csv")
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=products.csv"
        )

        res.status(200).send(csvData)
    }
    catch(error)
    {
        return res.status(500).json({message:"Unable to export products", error: error.message})
    }
}


