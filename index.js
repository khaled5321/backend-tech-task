require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");

const User = require('./models/user');
const Article = require('./models/article');
const Category= require('./models/category')

const mongoURI = process.env.DATABASE_URI

mongoose.connect(mongoURI);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors());
app.use(express.json());


app.get('/suggestedArticles/:userID/:articleID', async (req, res) => {
    try{
        const currentArticle = await Article.findById(req.params.articleID)  
        const currentUser= await User.findById(req.params.userID)

        //get articles with same category
        const sameCategory= await Article.find(
            {
                categories:{$in:currentArticle.categories},
                "_id":{$ne:currentArticle.id, $nin:currentUser.articles},
            }
        ).populate(['author','categories'])

        // get articles with same author except current article and articles in user.articles array
        const sameAuthor= await Article.find(
            {
                author:currentArticle.author,
                "_id":{$ne:currentArticle.id, $nin:currentUser.articles}
            }
        ).populate(['author','categories'])
            

        if(!sameCategory.length && !sameAuthor.length){
            res.status(204).json({"info":"No Articles Found!"})
        }
        else {
            // get articles with same category and author
            const sameCategoryAndAuthor= await Article.find(
                {
                    categories:{$in:currentArticle.categories},
                    author:currentArticle.author,
                    "_id":{$ne:currentArticle.id, $nin:currentUser.articles}
                }
            ).populate(['author','categories'])

            if(sameCategoryAndAuthor.length){
                res.status(200).json(sameCategoryAndAuthor)
            }
            else if(sameCategory.length){
                if(sameAuthor.length) {
                    sameCategory.push(sameAuthor[0])
                    res.status(200).json(sameCategory)
                }
                else{
                    res.status(200).json(sameCategory)
                }
            }
            else{
                res.status(200).json(sameAuthor)
            }

        }
    }catch(error){
        res.status(404).json({"error":error.message})
    }
});


// docs spesification

/**
 * @openapi
 * /suggestedArticles/{userID}/{articleID}:
 *   get:
 *     description: Takes the current userID and current ArticleID and returns a list of suggested articles
 *     tags:
 *       - Routes
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The current UserID
 *       - in: path
 *         name: articleID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the article the user currently reading
 *     responses:
 *       200:
 *         description: OK
 *       204:
 *         description: No Articles Found!
 *       404:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   author:
 *                     type: object 
 *                     items: 
 *                       type: object
 *                   squar_cover:
 *                     type: string
 *                   rectangle_cover:
 *                     type: string
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: object
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: object
 *                   readsCount:
 *                     type: number
 *                   shareCount:
 *                     type: number
 */



app.listen(3000, () => {
    console.log(`Api running on port 3000!`)
    V1SwaggerDocs(app, 3000);
})