html5-cloud-storage-direct-uploade
===================================

This a personal project where I intended to integrate different cloud storage services into one place. Further more, it supports directly uploading data from the browser side into those cloud storage server to reduce the burden on the application server side (e.g., your website). Yet you are still able to keep track of those uploaded files for later useage (e.g., user A might want to retrieve file B sometime later). 

## Overview
As already mentioned, there are actually three main features for this project: 
1. Directly data uploading into the cloud service, so the data is not stored on your website server (burden reduced)
2. Being able to keep track of information about where, what and who regarding one specific uploading
3. Being able to conduct later usage (e.g., view an uploaded image) for the user

What the current version supports are listed as follows:
1. Support direct uploading to Amazon S3, Microsoft Azure Blob Storage
2. Keep track of where and what did the website visitor uploaded
3. Support image gallary, one could view all its uploaded image data in a slide show mode
4. Support Image preview 


## Techniques/Programming Languages involved 
PHP, JavaScript, HTML5, MySQL, Cloud Storage Service (e.e., S3, Azure)

## How to build and run the test

0. Enable CORS for your cloud storage serice (for Azure, you need to write code to do this)
1. Deploy the the website files as what you usually did for your PHP website
2. Run the sql script to create the database
3. Vist index.php through the browser after the deployment and your server is started
4. follow the instructions on the page and do uploading, viewing jobs. 

## Screenshots

some of the screenshots are:

1. The index and the main page UI for the uploading:

![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/IndexPageFirstOpen.png)

2. What the select file and preview image looks like after you click browse and select an image file:

![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/SelectPicAndPreview.png)

3. After you click upload either to S3 or Azure, you could see a messge box on success:

![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/Upload2AzureOnSuccess.png)
![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/upload2S3OnSuccess.png)


4. Then you could also check your cloud storage console to see whether the images are already there:

![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/AzureConsoleAfterUpload.png)
![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/S3ConsoleAfterUoload.png)

5. User might want later usage say view his or her uploaded images, then you can click the link to view the images in slide mode in a separate page, you probably could see similar things as follows:

Azure:

![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/AzurePhotoGalaryPage.png)

S3: 
![alt tag](https://github.com/yongminyan/html5-cloud-storage-direct-uploader/blob/master/screenshots.d/S3PhotoGalary.png)


## Future Work

Some future work in my mind:

1. Add login functionality and each user has its own file container
2. Support more cloud service
3. Support more later usage, e.g., counting
4. You suggest more?

