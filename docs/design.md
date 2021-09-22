
# Design

## View Model
To enable a rich feature set for your Aurelia Views, first we need to handle the corresponding View models well.
This includes
1. Gathering all Aurelia related js/ts files
2. Watching for changes (up-to-date completions)
3. Refactoring

For this, we will utilize the [ts-morph library][1].
We may want to use the vanilla TS compiler at some time, thus we try to design the extension following [Clean Architecture][2]

## View
Coming to the heart of this extension, the View.
The very first step is to parse the html files.
The library we use is [parse5][3].

...

(Speaking from the perspective of one of the original authors)
I fully endorse the approach to still separate View and View Model via html and js/ts.
Thus, one of the major goals is to provide a parser, that (eg. via the visitor pattern) not only supports
Aurelia specific View syntaxes, but also for syntaxes of other FE framework.
This goal will also be a nice "force" to design the parser more modular.
Win-win as I see it.

### Virtual
To enable a rich "Typescript experience" in the view, we create a "Virtual Typescript Source File" with content from the view, on which we can call the Typescript API.

#### Definition
For Go To Definition to work
1. Get the cursor index
2. Get the source word
   1. This is the crux.
   2. Create a virtual source file, that includes the source word
   3. Perform Go To Definition

##### Assumption
Each variable or method is declared (eg. on top of your class)



# Footnotes

[1]: https://github.com/dsherret/ts-morph
[2]: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
[3]: https://github.com/inikulin/parse5
