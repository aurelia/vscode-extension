import { initCucumberTests } from '../jest-cucumber-setup.spec';

// initCucumberTests('@cli_generated');
// initCucumberTests('@cli_generated and @focus');
// initCucumberTests('@core');
// initCucumberTests('@core and @focus');
// initCucumberTests('@monorepo or @core');
// initCucumberTests('@monorepo');
// initCucumberTests('@scoped_for_testing');
initCucumberTests('@scoped_for_testing and @focus');
// /* prettier-ignore */ initCucumberTests('@cli_generated or @scoped_for_testing or @monorepo or @core');
// /* prettier-ignore */ initCucumberTests('@cli_generated or @scoped_for_testing');
// initCucumberTests();
