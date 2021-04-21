class APIFeatures {
    constructor(query, queryStr){
        this.query = query; 
        this.queryStr = queryStr;
   
    }

   // http://localhost:4000/api/v1/products?keyword=one&category=Laptops

    search(){
        const keyword =this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        //console.log(keyword)

        this.query = this.query.find({...keyword})

        return this;
    }

    filter() {

        const queryCopy = {...this.queryStr}

        //console.log(queryCopy)

        //Removing fields from query
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el])

        //console.log(queryCopy)

        let queryStr = JSON.stringify(queryCopy)
        console.log(queryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match =>`$${match}`)

        //console.log(queryStr)

        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }

    pagnation(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage -1);

        this.query = this.query.limit(resPerPage).skip(skip)

        return this;
    }
}

module.exports = APIFeatures