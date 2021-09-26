import Functions from '@google-cloud/functions-framework'
import { Storage } from '@google-cloud/storage'
import * as path from 'path'

const handler: Functions.HttpFunction = async (message, context) => {
    const option = process.env.NODE_ENV === 'production' ? undefined : {keyFilename: path.resolve(__dirname, '../', 'env', 'key.json')}
    const storage = new Storage(option);
    console.log({ storage });

    console.log('-- list buckets ----------------------------------------')
    // ロール：ストレージ管理者が必要(bucketとobjectは権限が違う)
    const [buckets] = await storage.getBuckets();
    for (const bucket of buckets) {
        console.log(bucket.name)
    }
    console.log('-- get bucket-------------------------------------------')

    const bucket = storage.bucket('harusame-develop-bucket');
    console.log({ bucket });

    console.log('-- list files ------------------------------------------')
    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getFiles
    const [files] = await bucket.getFiles({
        prefix: '/'
    });
    for (const file of files) {
        // Blobには本来ディレクトリという概念はないが name(full-path)を/で区切って階層構造を表現している
        // またディレクトリは必ず最後が/で終わるようになっている
        console.log(file.name, await file.exists(), 'isDir:' + (file.name.slice(-1) == '/'));
        // if (file.name.slice(-1) == '/') {
        //     await file.delete({ignoreNotFound: true});
        // }
    }
    // bucket.getFiles();
    // context.send({buckets});
}

handler('msg', 'ctx');
