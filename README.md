# php-unserialize-js

PHP [unserialize](https://www.php.net/manual/es/function.unserialize.php) function for JavaScript.

## Installation

```bash
npm install @swordev/php-unserialize
```

## Usage

```typescript
import { unserialize } from "@swordev/php-unserialize"

unserialize(`key|s:11:"hello world";`) // { key: "hello world" }
```

## Contributing

To contribute to the project, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and check them: `npm run prepare`.
4. Commit your changes: `git commit -m '<commit_message>'`.
5. Push to the original branch: `git push origin <branch_name>`.
6. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Forked project

This project was forked from [node-php-session-unserialize](https://github.com/ALiangLiang/node-php-session-unserialize) because it had bugs and it was not being maintained.

## License

Distributed under the MIT License. See LICENSE for more information.