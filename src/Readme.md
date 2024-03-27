# NestJS core structure

## NestJS Components

1.  **Modules**: Modules are a way of organizing related controllers, providers, and services together into groups. Each module is a single responsibility within your application, and modules can import other modules to create a hierarchical structure.
2.  **Controllers**: As you mentioned, controllers handle incoming requests and return responses to the client. They are responsible for accepting input and returning the result of a request to the user.
3.  **Providers and Services**: Providers (including services) are a fundamental concept in NestJS. They are used to abstract away the details of complex operations and provide a way to share functionality across your application. Services, as a type of provider, are used to encapsulate business logic and can be injected into controllers or other services.
4.  **Middleware**: Middleware in NestJS is a function which is called before the route handler. Middleware functions have access to the request and response objects, and they can perform operations like modifying the request/response or ending the request/response cycle.
5.  **Pipes**: Pipes are used for validation and transformation of the arguments being processed by a controller route handler. They can be used for tasks like validating user input, transforming input data, or handling errors.
6.  **Guards**: Guards are responsible for determining whether a request will be handled by the route handler or not, based on certain conditions (like authentication or authorization).
7.  **Interceptors**: Interceptors have a set of useful capabilities, such as inspecting and changing the data being returned from a route handler, or changing the data being passed to a route handler.
8.  **Exception Filters**: Exception filters are a way to handle exceptions across your whole application in a centralized place.
9.  **Decorators**: Decorators allow you to annotate or modify classes and their members (properties, methods, etc.). NestJS provides many custom decorators like `@Get()`, `@Post()`, `@Body()`, `@Req()`, etc., and you can also define your own.
10. **DTOs (Data Transfer Objects)**: DTOs are objects that define how data will be sent over the network. They help to define what the data input and output of a method should be, using TypeScript interfaces or classes.

## Folder structure

### Source structure - layer 0:

`Src` should contain a single `app.module.ts` file that imports all the modules, a single `main.ts` file to initialize the port and stuffs.

Apart from that, each module should be separated into their own folders like the below:

- `src`: Main folder
  | - `app.module.ts`: module centralized
  | - `main.ts`: initialize server port
  |- `cats` - cat module folder
  - | - `cats.controller.ts` - controller for cat module
    | - `cats.module.ts` - cat module config
    | - `cats.service.ts` - provider for cat module
    | - `dto` - data object for request
    - | - `create-cat.dto.ts`
  - | - `interfaces` - interface for providers
    - | - `cat.interface.ts`
