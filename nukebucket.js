var aws = require('aws-sdk');

var marker;
var PromiseList = [];
var bucketname = 'bucketname'; // bucket name goes here
var params = {
      Bucket: bucketname
};

let s3 = new aws.S3();
thousand_count = 0;

var creds = new aws.SharedIniFileCredentials({ profile: '' }); // profile name in ~/.aws/config
aws.config.credentials = creds;

// nuke the bucket
function NukeBucket(params, marker) {

      let isTruncated = true;

      let listParams = {
            Bucket: bucketname,
            KeyMarker: marker
      };

      // using listObjectVersions as it handles both versioned and non-versioned buckets

      var listPromise = s3.listObjectVersions(listParams).promise();
      listPromise.then(function (data) {
            data.Versions.forEach(function (element) {

                  var KeyParams = {
                        Bucket: bucketname,
                        Key: element.Key,
                        VersionId: element.VersionId
                  };
                  let objPromise = s3.deleteObject(KeyParams).promise();
                  // one promise per object delete
                  PromiseList.push(objPromise);
            });

            // handler for delete markers

            data.DeleteMarkers.forEach(function (element) {

                  var KeyParams = {
                        Bucket: bucketname,
                        Key: element.Key,
                        VersionId: element.VersionId
                  };

                  let objPromise = s3.deleteObject(KeyParams).promise();
                  PromiseList.push(objPromise);

            });

            isTruncated = data.IsTruncated;
            marker = data.NextKeyMarker;
            thousand_count += 1;
            console.log('Deleting ' + thousand_count + '000 objects...');

            if (isTruncated) { listobjpromise(params, marker); }
            else {
                  console.log('All deletes started.');
                  // wait for all the deletes to finish, then delete bucket
                  Promise.all(PromiseList).then(function () {
                        s3.deleteBucket(params, function (err, data) {
                              if (err) console.log(err, err.stack); // an error occurred
                              else console.log(data, 'All deletes finished.\nBucket deleted!');
                        });
                  });
            }
      }).catch(function (err) {
            console.log(err, err.stack); // an error occurred
      });

}

// sends the request
NukeBucket(params, marker);