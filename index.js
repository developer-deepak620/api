const express = require("express");
let { MongoClient } = require("mongodb");
let client = new MongoClient("mongodb+srv://deepakkumar456992:123%40deepak@cluster0.gexspmq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
let app = express();
const cors = require("cors");
app.use(cors());

app.get("/",async(req,res)=>{

    await client.connect();
    let db = client.db("deepak_db");
    let coll = db.collection("products");

    let resp = await coll.find({}).toArray();

    res.json(resp);
});


app.get("/categories",async(req,res)=>{

    await client.connect();
    let db = client.db("deepak_db");
    let coll = db.collection("category");

    let resp = await coll.aggregate([
        {
            $project:{
                cat_name:1,cat_alias:1,_id:0,id:1
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"id",
                foreignField:"cat_id",
                pipeline:[
                    {
                        $project:{
                            _id:0,cat_id:0
                        }
                    }
                    
                ],
                as:"prd"
            }
        }
    ]).toArray();

    res.json(resp);
});






app.get("/customers",async(req,res)=>{

    await client.connect();
    let db = client.db("sqldemo1");
    let coll = db.collection("customers");
    let resp = await coll.aggregate([
        {
            $project:{
                customerNumber:1, customerName:1,country:1,_id:0
            }
        },
        {
            $lookup:{
                from:"payments",
                localField:"customerNumber",
                foreignField:"customerNumber",
                as:"payments",
                pipeline:[
                    {
                        $project:{
                            _id:0,customerNumber:0
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"orders",
                localField:"customerNumber",
                foreignField:"customerNumber",
                as:"orders",
                pipeline:[
                    {
                        $project:{
                            _id:0,customerNumber:0,requiredDate:0,shippedDate:0,comments:0
                        }
                    },{
                        $lookup:{
                            from:"orderdetails",
                            localField:"orderNumber",
                            foreignField:"orderNumber",
                            pipeline:[
                                {
                                    $project:{
                                        _id:0,productCode:1,quantityOrdered:1
                                    }
                                },{
                                    $lookup:{
                                        from:"products",
                                        localField:"productCode",
                                        foreignField:"productCode",
                                        as:"productDetails",
                                        pipeline:[
                                            {
                                                $project:{
                                                    _id:0,productName:1,productDescription:1
                                                }
                                            }
                                        ]
                                    }
                                }
                            ],
                            as:"OrderDetails"
                        }
                    }
                ]
            }
        }
    ]).toArray();

    res.json(resp);
});




app.get("/customers/:id",async(req,res)=>{

    let id = parseInt(req.params.id);

    await client.connect();
    let db = client.db("sqldemo1");
    let coll = db.collection("customers");
    let resp = await coll.aggregate([
        {
            $match:{
                "customerNumber":id
            }
        },
        {
            $project:{
                customerNumber:1, customerName:1,country:1,_id:0
            }
        },
        {
            $lookup:{
                from:"payments",
                localField:"customerNumber",
                foreignField:"customerNumber",
                as:"payments",
                pipeline:[
                    {
                        $project:{
                            _id:0,customerNumber:0
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"orders",
                localField:"customerNumber",
                foreignField:"customerNumber",
                as:"orders",
                pipeline:[
                    {
                        $project:{
                            _id:0,customerNumber:0,requiredDate:0,shippedDate:0,comments:0
                        }
                    },{
                        $lookup:{
                            from:"orderdetails",
                            localField:"orderNumber",
                            foreignField:"orderNumber",
                            pipeline:[
                                {
                                    $project:{
                                        _id:0,productCode:1,quantityOrdered:1
                                    }
                                },{
                                    $lookup:{
                                        from:"products",
                                        localField:"productCode",
                                        foreignField:"productCode",
                                        as:"productDetails",
                                        pipeline:[
                                            {
                                                $project:{
                                                    _id:0,productName:1,productDescription:1
                                                }
                                            }
                                        ]
                                    }
                                }
                            ],
                            as:"OrderDetails"
                        }
                    }
                ]
            }
        }
    ]).toArray();

    res.json(resp[0]);
});



app.listen(9000,()=>console.log("server started at port 9000"));
