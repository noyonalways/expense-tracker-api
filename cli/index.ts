import chalk from "chalk"; // Use import instead of require
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .command("generate-module <module> <location>")
  .description("Generate module files")
  .action((module, location) => {
    const moduleDir = path.join(location, module);

    // Define the file names you want to generate
    const files = [
      { name: `${module}.routes.ts`, content: "/* Routes content */" },
      { name: `${module}.controller.ts`, content: "/* Controller content */" },
      { name: `${module}.service.ts`, content: "/* Service content */" },
      { name: `${module}.validation.ts`, content: "/* Validation content */" },
      { name: `${module}.model.ts`, content: "/* Model content */" },
    ];

    // Ensure the module directory exists
    fs.ensureDirSync(moduleDir);

    // Create the files and use chalk to color the output
    files.forEach((file) => {
      const filePath = path.join(moduleDir, file.name);
      fs.writeFileSync(filePath, file.content);
      // eslint-disable-next-line no-console
      console.log(chalk.green(`Generated: ${filePath}`)); // Colored success message
    });

    // eslint-disable-next-line no-console
    console.log(
      chalk.blue(
        `Module '${module}' has been successfully created in ${location}`,
      ),
    ); // Informative message
  });

// Directly handle the action for the `generate-module` command
program.parse(process.argv);
