var express = require('express');
router = express.Router();

var ObjectId = require("mongodb").ObjectId
const dbo = require('../database/mongo');

router.get('/', (req, res) => {
    res.send('Shopping list API');
});

router.get('/items', async (req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect
        .collection(process.env.ATLAS_DATABASE_COLLECTION_NAME)
        .find({})
        .toArray(function (err, result) {
            if (err) {
                res.json({error: err})
            } else {
                res.json(result);
            }
        })
})

router.delete('/items', (req, res) => {
    const dbConnect = dbo.getDb();
    ids = req.body.ids.map(id => (new ObjectId(id)))
    dbConnect
        .collection(process.env.ATLAS_DATABASE_COLLECTION_NAME)
        .deleteMany({ _id: { $in: ids } }, (err, object) => {
            if (err) {
                res.json({error: err})
            } else {
                res.json({ deletedIdsCount: object.deletedCount })
            }
        })
})

router.get('/item/:id', (req, res) => {
    const dbConnect = dbo.getDb();
    dbConnect
        .collection(process.env.ATLAS_DATABASE_COLLECTION_NAME)
        .findOne({ _id: new ObjectId(req.params.id) },
            function (err, result) {
                if (err) {
                    res.json({error: err})
                } else {
                    res.json({ item: result });
                }
            })
})

router.post('/item', (req, res) => {
    const dbConnect = dbo.getDb();
    try {
        dbConnect
            .collection(process.env.ATLAS_DATABASE_COLLECTION_NAME)
            .insert({
                item: req.body.item,
                done: false,
                category: req.body.category,
                vendor: req.body.vendor
            }, (err, insertedElement) => {
                if (err) {
                res.json({error: err}) } 
                else
                res.json({ itemAdded: Object.values(insertedElement.insertedIds)[0] })
            })
    }
    catch(err){
        res.json({ error: err })
    }
})

router.put('/item', (req, res) => {
    const dbConnect = dbo.getDb();
    try {
        let setObject = {};
        if (req.body.done !== null && req.body.done !== 'undefined') setObject.done = req.body.done;
        if (req.body.item) setObject.item = req.body.item;
        if (req.body.category) setObject.category = req.body.category;
        if (req.body.vendor) setObject.vendor = req.body.vendor;
        console.log(setObject);
        dbConnect
            .collection(process.env.ATLAS_DATABASE_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(req.body._id) },
                { $set: setObject },
                (err, updatedElement) => {
                    if (err) {
                        res.json({ error: err })
                    }
                    res.json({ itemUpdated: req.body._id })
                })
    }
    catch(err){
        res.json({ error: err })
    }
})

module.exports = router;