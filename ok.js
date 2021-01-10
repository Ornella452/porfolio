router.get('/', async (req, res) => {

    try {

        const panier = await Item.find({}).populate('Product_id').populate('Cart_id');
        const Product = await Products.find().lean().exec()

        const PrixItem = panier.map((elem) => {

            return elem.Product_id.priceProdTTC * elem.Quantity

        })
        const final = PrixItem.reduce((a, b) => a + b);

        const total_ttc = final.toFixed(2);
        //res.json({ "total_ttc": total_ttc })

        res.render('Cart', {
            Product,
            total_ttc
        })
    
    } catch (err) {
        res.status(500).send(err)

    }

})
