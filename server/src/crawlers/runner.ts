import parseArgs from "minimist";

export default class Runner {
  crawlerName: string;

  constructor(crawlerName: string) {
    require("dotenv").config();
    this.crawlerName = crawlerName;
  }

  async start(callback: (option: parseArgs.ParsedArgs) => Promise<void>) {
    const option = parseArgs(process.argv.slice(2));
    console.log(`runner: Started running ${this.crawlerName}. option:`, option);

    if (!option.testMode) {
      await callback(option);
    }

    this.onEnd(option);
  }

  onEnd(option: parseArgs.ParsedArgs) {
    console.log(
      `runner: Finished running ${this.crawlerName}. option:`,
      option
    );
    process.exit(0);
  }
}
