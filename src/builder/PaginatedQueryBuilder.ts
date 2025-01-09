import {
  IPaginatedResponse,
  IPagination,
  IQueryOptions,
} from "@/interface/builder.interface";

class PaginatedQueryBuilder<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private query: any;
  private options: IQueryOptions;
  private pagination: IPagination;
  private baseUrl: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(query: any, options: IQueryOptions, baseUrl: string) {
    this.query = query;
    this.options = options;
    this.pagination = {
      page: Number(options.page) || 1,
      limit: Number(options.limit) || 10,
      totalPage: 1,
      total: 0,
      prevPage: null,
      nextPage: null,
    };
    this.baseUrl = baseUrl;
  }

  // Apply filtering
  filter() {
    const queryObj = { ...this.options };

    // Define the fields to exclude from the filter
    const excludeFields = [
      "search",
      "sort",
      "limit",
      "page",
      "fields",
      "sortBy",
      "sortType",
    ];

    excludeFields.forEach((el) => delete queryObj[el]);
    this.query = this.query.find(queryObj).select("-__v");
    return this;
  }

  // Apply search
  search(searchFields: string[] = ["title", "brief", "content"]) {
    if (this.options.search) {
      const regex = new RegExp(this.options.search, "i"); // Case-insensitive regex
      const searchConditions = searchFields.map((field) => ({
        [field]: regex,
      }));
      this.query = this.query.find({ $or: searchConditions }).select("-__v");
    }
    return this;
  }

  // Apply sorting
  sort() {
    const sortBy = this.options.sortBy || "updatedAt";
    const sortType = this.options.sortType === "asc" ? 1 : -1;
    this.query = this.query.sort({ [sortBy]: sortType });
    return this;
  }

  // Apply field selection
  selectFields(defaultFields?: string[]) {
    // Always exclude __v
    const excludeVersion = "-__v";

    // If specific fields are provided in the query options, use them
    if (this.options.fields) {
      const fields =
        this.options.fields.split(",").join(" ") + " " + excludeVersion;
      this.query = this.query.select(fields);
    }
    // If defaultFields are passed as an argument, use them
    else if (defaultFields && defaultFields.length > 0) {
      const fields = defaultFields.join(" ") + " " + excludeVersion;
      this.query = this.query.select(fields);
    }
    // If no fields specified, just exclude __v
    else {
      this.query = this.query.select(excludeVersion);
    }

    return this;
  }

  // Dynamically apply populate based on fields
  populateFields(populatableFields: string[]) {
    if (this.options.fields) {
      // Populate only the specified fields
      const requestedFields = this.options.fields.split(",");
      populatableFields.forEach((field) => {
        if (requestedFields.includes(field)) {
          this.query = this.query.populate({
            path: field,
            select: "-__v",
          });
        }
      });
    } else {
      // Populate all fields by default
      populatableFields.forEach((field) => {
        this.query = this.query.populate({
          path: field,
          select: "-__v",
        });
      });
    }
    return this;
  }

  // Apply pagination
  paginate() {
    const skip = (this.pagination.page - 1) * this.pagination.limit;
    this.query = this.query.skip(skip).limit(this.pagination.limit);
    return this;
  }

  // Build query string from options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildQueryString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  }

  // Execute the query and include pagination metadata
  async execute(): Promise<IPaginatedResponse<T>> {
    const [data, total] = await Promise.all([
      this.query.exec(),
      this.query.model.countDocuments(this.query.getQuery()),
    ]);

    const totalPage = Math.ceil(total / this.pagination.limit);
    const nextPage =
      this.pagination.page < totalPage
        ? `${this.baseUrl}?${this.buildQueryString({
            ...this.options,
            page: Number(this.pagination.page) + 1,
          })}`
        : null;
    const prevPage =
      this.pagination.page > 1
        ? `${this.baseUrl}?${this.buildQueryString({
            ...this.options,
            page: Number(this.pagination.page) - 1,
          })}`
        : null;

    // Set the pagination data
    this.pagination = {
      ...this.pagination,
      totalPage,
      total,
      prevPage,
      nextPage,
    };

    return {
      data,
      pagination: this.pagination,
    };
  }
}

export default PaginatedQueryBuilder;
