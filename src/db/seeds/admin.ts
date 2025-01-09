import config from "@/config";
import { User } from "@/modules/user/user.model";

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL });

    if (!existingAdmin) {
      // Create admin user
      await User.create({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        role: "admin",
      });

      // eslint-disable-next-line no-console
      console.log("Admin user seeded successfully".green);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to seed admin user:", error);
    process.exit(1);
  }
};

export default seedAdmin;
