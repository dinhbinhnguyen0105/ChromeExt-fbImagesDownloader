console.log('contentScript.js');
chrome.runtime.onMessage.addListener((request, sender, senRes) => {
    const metaElm = document.querySelector('meta[name="google-site-verification"]');
    if (metaElm) {
        const pElm = metaElm.parentElement;
        const imagesElm = pElm.querySelectorAll('img[referrerpolicy="origin-when-cross-origin"]');

        if (imagesElm.length > 0) {
            imagesElm.forEach((image) => {
                const srcAtt = image.getAttribute('src');
                // images.push({ src: srcAtt, name: getName(srcAtt) });
                downloadImage(srcAtt, getName(srcAtt));
            });
            senRes({ response: 'Downloaded' });

        }
    }
});

const getName = (src) => {
    const srcSub = src.split('/');
    const name = srcSub[srcSub.length - 1].split('?');
    return name[0];
};

const downloadImage = async (src, name) => {
    const image = await fetch(src);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
