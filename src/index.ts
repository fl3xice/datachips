import chalk from "chalk";
import { Command } from "commander";
import password from "@inquirer/password";
import type { Prettify, PartialDeep } from "@inquirer/type";
import { DataChipsCipher } from "./cipher";
import { DataChipsTemplate } from "./template";
import { createChip, type Chip } from "./chip";
import open from "open";

/**
 * THIS IS A CLI
 */

const VERSION = "1.0.0";
const PROGRAMM = new Command();
const DEFAULT_PASSPHRASE_FILE_NAME = "datachip.secret";
const DIR_CHIPS_STORE = "chips";

const THEME_PASSWORD: PartialDeep<Theme> = {
  prefix: "🔑",
};
const MASK_PASSWORD = "•";

type DefaultTheme = {
  prefix: string;
  spinner: {
    interval: number;
    frames: string[];
  };
  style: {
    answer: (text: string) => string;
    message: (text: string) => string;
    error: (text: string) => string;
    defaultAnswer: (text: string) => string;
    help: (text: string) => string;
    highlight: (text: string) => string;
    key: (text: string) => string;
  };
};

type Theme<Extension extends object = object> = Prettify<
  Extension & DefaultTheme
>;

async function getKey(): Promise<DataChipsCipher.Key> {
  const passphraseRemembed = await Bun.file(
    DEFAULT_PASSPHRASE_FILE_NAME
  ).exists();

  let key: DataChipsCipher.Key = Buffer.alloc(DataChipsCipher.KEY_LEN);

  if (!passphraseRemembed) {
    const passphrase = await password({
      message: "Type passphrase ",
      mask: MASK_PASSWORD,
      theme: THEME_PASSWORD,
    });

    const retypePassphrase = await password({
      message: "Retype passphrase ",
      mask: MASK_PASSWORD,
      theme: THEME_PASSWORD,
    });

    if (passphrase != retypePassphrase) {
      throw new Error(
        "Sorry, but you made a mistake when you repeated the passphrase."
      );
    }

    key = DataChipsCipher.createKey(passphrase);

    if (parsed.opts().save) {
      await Bun.write(DEFAULT_PASSPHRASE_FILE_NAME, key);
    }
  } else {
    key = Buffer.from(
      await Bun.file(DEFAULT_PASSPHRASE_FILE_NAME).arrayBuffer()
    );
  }

  return key;
}

PROGRAMM.name("Datachips")
  .description("CLI for generate a chips")
  .version(VERSION);

PROGRAMM.option(
  "-s, --save",
  "Save the passphrase in a file and remember it and use it in future"
).option("-o, --open", "Open in the browser", false);

PROGRAMM.command("gen")
  .aliases(["create"])
  .description("Create a chip from a markdown file")
  .argument("<input-file>", "Markdown file path")
  .argument("<output-file>", "Output chip path")
  .argument("[title]", "Title of the chip")
  .action(
    async (
      markdownFilePath: string,
      outputChipPath: string,
      title?: string
    ) => {
      try {
        const key = await getKey();

        const mdFile = Bun.file(markdownFilePath);

        if (!(await mdFile.exists())) {
          console.error(
            chalk.red("Sorry but the specified markdown file was not found")
          );
          return;
        }

        const convertedMarkdown = DataChipsTemplate.convertMarkdown(
          await mdFile.text(),
          title
        );

        const templateOptions = convertedMarkdown.toTemplateOptions();

        const html = DataChipsTemplate.generateByTemplate(templateOptions);

        const chip = createChip(
          DataChipsCipher.encrypt(html, key),
          templateOptions.title || title || "Unnamed Chip"
        );

        await Bun.write(outputChipPath, JSON.stringify(chip));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(chalk.red(err.message));
        }
      }
    }
  );

PROGRAMM.command("decrypt")
  .aliases(["open"])
  .description("Open a chip")
  .argument("<input-file>", "Chip")
  .action(async (chipFilePath) => {
    try {
      const key = await getKey();

      const chipFile = Bun.file(chipFilePath);

      if (!(await chipFile.exists())) {
        throw new Error("Sorry but chip by path was not found");
      }

      const chip: Chip = await chipFile.json();

      if (
        chip.encrypted == undefined ||
        chip.name == undefined ||
        chip.encrypted.data == undefined ||
        chip.encrypted.iv == undefined
      ) {
        throw new Error("Sorry but this is not a chip");
      }

      console.log(chalk.green(`Started decrypting chip: ${chip.name}`));

      const decrypted = DataChipsCipher.decrypt(chip.encrypted, key);
      const outputPath = `${DIR_CHIPS_STORE}/${chip.name}.html`;

      await Bun.write(outputPath, decrypted);

      if (parsed.opts().open) {
        open(outputPath);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(chalk.red(err.message));
      }
    }
  });

const parsed = PROGRAMM.parse();
