import { Category } from "@/modules/category/category.model";

async function seedCategories() {
  const relevantCategories = [
    { name: "Technology", description: "All about tech and gadgets." },
    { name: "Health", description: "Topics related to health and wellness." },
    { name: "Finance", description: "Financial news and advice." },
    { name: "Education", description: "Resources for learning and education." },
    { name: "Travel", description: "Travel tips and destination guides." },
    { name: "Food", description: "Delicious recipes and food reviews." },
    { name: "Lifestyle", description: "Lifestyle tips and trends." },
    {
      name: "Entertainment",
      description: "Movies, music, and entertainment news.",
    },
    { name: "Sports", description: "Latest in sports and fitness." },
    { name: "Fashion", description: "Fashion trends and style tips." },
  ];

  // Insert categories using the Category model
  await Category.insertMany(relevantCategories);
}

export default seedCategories;
