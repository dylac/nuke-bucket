# nuke-bucket
Simple Node.js script to delete an S3 bucket along with all objects/versions

1) Add bucket name

2) Add a configured profile in ~/.aws/config, or configure credentials any way you choose allowed by the AWS node.js SDK:
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html

3) Run the script. Bye bye bucket + all objects.
