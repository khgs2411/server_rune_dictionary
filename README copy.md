# do_serverless_ts

Boilerplate for Digital Ocean serverless functions development and deployment.

This project is a boilerplate for creating Digital Ocean Functions and deploying them using GitHub Actions. It is built using Bun.js, but it can also run with Node.js with very little changes (mainly in the `package.json` file - changing the runtime to `node` (npm) rather than `bun`).

## Getting Started

1. **Create an Environment**:

-   Create the following environment variables:
    -   `DOCTL_NAMESPACE`: Your Digital Ocean serverless namespace.
-   Go to your GitHub repository and create a secret for this project:
    -   `GITHUB_SECRET_KEY`: Your Digital Ocean API key.

2. **Disconnect from the Origin Repository**:

-   Run the following command to disconnect this repo from the origin:
    ```
    git remote remove origin
    ```

3. **Connect to Digital Ocean**:

-   If you are connected to a different project/account/team, please use the following command to disconnect:
    ```
    doctl auth remove --context default
    ```
-   Then, run the following commands to connect to your Digital Ocean account:
    ```
    doctl auth status
    doctl auth init
    ```
    -   Provide your Digital Ocean API key from [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens).
-   Finally, run the following command to connect to your Digital Ocean serverless namespace:
    ```
    doctl serverless connect <your-namespace>
    ```

The project starts with a default method under `src/main/index`. You can add new methods using `bun run new <method-name>` and remove them using `bun run remove <method-name>`.

## Deployment

This project supports deployment through GitHub Actions on push. To configure the deployment, you need to update the `.github/workflows/main.yml` remove the `if: false` condition from the `deploy` job.

Alternatively, you can manually deploy and build using the following commands:

-   `bun run build`: Build the project.
-   `bun run deploy`: Deploy the project.
-   `bun run publish`: Build and deploy the project.

## Contributing

If you have any suggestions or issues, please feel free to open a new issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
