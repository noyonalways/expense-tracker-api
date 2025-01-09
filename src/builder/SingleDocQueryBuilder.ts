import { Model } from "mongoose";

interface IQueryOptions {
  fields?: string;
  expand?: boolean;
  filter?: Record<string, unknown>;
}

class SingleDocQueryBuilder<T> {
  private query;

  constructor(
    private readonly model: Model<T>,
    private readonly filter: Record<string, unknown>,
    private readonly options: IQueryOptions = {},
  ) {
    this.query = this.model.findOne(filter);
    this.handleSelect();
  }

  private handleSelect() {
    if (this.options.fields) {
      const fieldsToSelect = this.options.fields
        .split(",")
        .filter(Boolean)
        .join(" ");
      this.query = this.query.select(fieldsToSelect);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  populate(fields: string[]) {
    if (this.options.expand === false) {
      return this;
    }

    fields.forEach((field) => {
      this.query = this.query.populate({
        path: field,
        select: "-__v",
      });
    });
    return this;
  }

  async execute(): Promise<T | null> {
    const result = await this.query.lean().exec();
    if (result) {
      this.removeVersionField(result);
    }
    return result;
  }

  private removeVersionField(obj: Record<string, unknown>) {
    delete (obj as Record<string, unknown>).__v;
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === "object") {
        this.removeVersionField(obj[key] as Record<string, unknown>);
      }
    });
  }
}

export default SingleDocQueryBuilder;
