Most of these classes aren't used in the `password` grant type for OAuth2. Only `OAuthClientRepository`
and `OAuthUserRepository` are used and thus, also have unit tests. Scopes aren't also implemented
for this exercise.

The other classes are a result of trying to meet the contracts/interfaces of [`@jmondi/oauth2-server`][1],
as well as misunderstanding and overhyping the **OAuth2** portion of the coding assignment at first.

[1]: https://github.com/jasonraimondi/ts-oauth2-server
