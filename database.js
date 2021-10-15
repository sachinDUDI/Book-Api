let books = [
  {
    ISBN: "x",
    tittle: "GettingStart",
    pubDate: "2014-09-14",
    language : "hindi",
    numPage: 250,
    authors: [1],
    publication:[1],
    category:["tech", "programming"],
  },
  {
    ISBN: "12y",
    tittle: "HarryPotter",
    pubDate: "2000-09-14",
    language : "en",
    numPage: 250,
    authors: [2],
    publication:[2],
    category:["fiction", "mystery"],
  },
  {
    ISBN: "12z",
    tittle: "RichDad",
    pubDate: "1997-09-14",
    language : "en",
    numPage: 250,
    authors: [3],
    publication:[3],
    category:["Finance", "Educ."],
  }
];
const author = [
 {
  id:1,
  name:"Sunita Sharma",
  books:["Python"],
 },
 {
  id:2,
  name:"J K Rowling",
  books:["HarryPotter"],
 },
 {
  id:3,
  name:"Robert Kiyosaki",
  books:["RichDad","SecondChance"],
},
];
const publication = [
  {
    id:1,
    name:"ARIHANT",
    books:["getting started"],
    
  },
  {
    id:2,
    name:"FRAMEWORK",
    books:["GOT","HarryPotter"],
   
  },
  {
    id:3,
    name:"PLATA",
    books:["RichDad","RatRace"]
   
  }
];

module.exports = {books ,author , publication};