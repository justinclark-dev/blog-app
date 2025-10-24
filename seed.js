const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

//TODO: create helper module to avoid duplication of this function
const createURL = (name) => {

    //TODO: handle only words (i.e. a word must constist of a-z characters)
    let newName = '';
    name.split(" ").forEach(word => {
        newName += word + '-';
    });

    return newName.slice(0, -1);
};

const createBlogs = async () => {

    //TODO: are these random nums even necessary with the lorem package?
    let nameLength = Math.floor(Math.random() * (7 - 3)) + 3;
    let onOff = Math.floor(Math.random() * 2);
    let contentLength = Math.floor(Math.random() * (9 - 5)) + 5;

    (onOff === 1) ? onOff = true : onOff = false;
    const name = lorem.generateWords(nameLength);
    const nameURL = createURL(name);
    const author = lorem.generateWords(2);
    const isActive = onOff;
    const datePublished = Date.now();
    const category = lorem.generateWords(1);
    const description = lorem.generateSentences(1);
    const content = lorem.generateParagraphs(contentLength);

    await Blog.create({ 
        name, 
        nameURL, 
        author, 
        isActive, 
        datePublished, 
        category, 
        description, 
        content 
    });

};

const disconnect = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        await mongoose.connection.close();
    }
}

const seedBlogDB = async () => {

    // Danger, Will Robinson!
    // drop and re-seed...
    // await mongoose.connection.dropDatabase();
    
    for (let i = 0; i < 20; i++) {
        await createBlogs();
    }

    await disconnect();
};

seedBlogDB();