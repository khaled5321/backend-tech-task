require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

        const sameCategory= await Article.find(
            {
                categories:{$in:currentArticle.categories},
                "_id":{$ne:currentArticle.id, $nin:currentUser.articles},
                author:{$ne:currentArticle.author}
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
                console.log('here1')
            }
            else if(sameCategory.length){
                if(sameAuthor.length) {
                    sameCategory.push(sameAuthor[0])
                    res.status(200).json(sameCategory)
                }
                else{
                    res.status(200).json(sameCategory)
                }
                console.log('here2')
            }
            else{
                res.status(200).json(sameAuthor)
                console.log('here3')
            }

        }
    }catch(error){
        res.status(404).json({"error":error.message})
    }
});


app.listen(3000, () => console.log(`Api running on port 3000!`))