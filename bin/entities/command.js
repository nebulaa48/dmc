export class Command {
  constructor(command, description, action, builder) {
    this.command = command;
    this.description = description;
    this.builder = (yargs) => {
      builder && builder(yargs);
    };
    this.handler = (args) => {
      action && action(args);
    };
  }
}
