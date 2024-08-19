class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  Filter() {
    const queryObj = { ...this.queryString }; // Copying the query string
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Fields to exclude from the query

    // Loop through excludedFields array and delete corresponding properties from queryObj
    excludedFields.forEach(el => delete queryObj[el]); //important

    // Advanced filtering: convert queryObj to string and replace certain words with MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //  \b for matching word boundaries, g to perform global match
    // Find documents in the database matching the modified query and assign it to this.query
    this.query = this.query.find(JSON.parse(queryStr));
    // Return the current object instance to enable chaining methods
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join('');
      //console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.page * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
