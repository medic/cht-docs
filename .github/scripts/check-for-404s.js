
import Sitemapper from 'sitemapper';
import http from 'http';


// https://github.com/seantomburke/sitemapper
const sitemapper = new Sitemapper();
const testUrl = 'http://localhost:1313'
sitemapper.timeout = 1000;

sitemapper
    .fetch('https://docs.communityhealthtoolkit.org/sitemap.xml')
    .then(({ url, sites }) => {
        // console.log(`url:${url}`, 'sites:', sites);
        sites.forEach((docUrl) => {
            docUrl = testUrl + docUrl.replace(
                'https://docs.communityhealthtoolkit.org',
                ''
            );
            http.get(docUrl, res => {
                let data = [];
                const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
                console.log('URL:', docUrl, 'Status Code:', res.statusCode);
            }).on('error', err => {
                console.log('Error: ', err.message);
            });
        });
        console.log(`url:${url}`);

    })
    .catch((error) => console.log(error));



